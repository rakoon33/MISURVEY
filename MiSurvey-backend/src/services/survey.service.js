const db = require('../config/database');
const { Survey, SurveyPage, SurveyQuestion, SurveyType } = require('../models');
const {createSurveyPage, updateSurveyPage} = require('./surveyPage.service');
const {createSurveyQuestion, updateSurveyQuestion} = require('./surveyQuestion.service');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
let nanoid;

const createSurvey = async (data) => {
    if (!nanoid) {
        nanoid = (await import('nanoid')).nanoid;
    }
    try {
        // Directly access the survey data since only one survey is being created at a time
        const surveyData = data;

        // Create the survey
        const survey = await Survey.create({
            UserID: surveyData.UserID,
            CompanyID: surveyData.CompanyID,
            Title: surveyData.Title,
            SurveyDescription: surveyData.SurveyDescription,
            SurveyImages: surveyData.SurveyImages,
            InvitationMethod: surveyData.InvitationMethod,
            SurveyStatus: surveyData.SurveyStatus,
            Customizations: surveyData.Customizations, // Assuming Customizations is stored as JSON in the database
            CreatedBy: surveyData.CreatedBy,
            Approve: surveyData.Approve
        });

        surveyData.SurveyLink = await nanoid();
        const [addSurveyLink] = await Survey.update({SurveyLink:surveyData.SurveyLink}, {
            where: { SurveyID: survey.SurveyID },
          });
        if (addSurveyLink === 0) {
            return { status: false, message: "Failed create Survey Link" };
        }
        // Create each survey page
        for (const pageData of surveyData.pages) {
            // Add SurveyID to page data
            pageData.SurveyID = survey.SurveyID; // Assuming the created survey object has an 'id' property

            // Create the survey page
            const page = await createSurveyPage(pageData);
            
            const questionData = pageData.question;
            // Add PageID to question data
            questionData.PageID = page; // Assuming the created page object has an 'id' property
            console.log(questionData);
            // Create the survey question
            await createSurveyQuestion(questionData);
        }

        return { status: true, message: "Survey created successfully", survey };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

const getOneSurveyWithData = async (surveyID) => {
  try {
      const survey = await Survey.findByPk(surveyID, {
          attributes: { 
              exclude: [
                  "SurveyDescription", "SurveyImages", "InvitationMethod",
                  "StartDate", "EndDate", "CreatedAt", "ResponseRate",
                  "CreatedBy", "UpdatedAt", "UpdatedBy", "Approve", "SurveyStatus", "SurveyLink"
              ]
          },
          include: [{
              model: SurveyPage,
              as: 'SurveyPages',
              include: [{
                  model: SurveyQuestion,
                  as: 'SurveyQuestions',
                  include: [{
                      model: SurveyType,
                      as: 'SurveyType',
                      attributes: ['SurveyTypeName'] // Replace 'TypeName' with the actual name of the field in your SurveyType model
                  }]
              }]
          }]
      });

      if (!survey) {
          return { status: false, message: "Survey not found" };
      }

      // Transform the 'QuestionType' field to include the type name
      const surveyJSON = survey.toJSON();
      surveyJSON.SurveyPages.forEach(page => {
          page.SurveyQuestions.forEach(question => {
              question.QuestionType = {
                  id: question.QuestionType,
                  name: question.SurveyType ? question.SurveyType.SurveyTypeName : null
              };
              delete question.SurveyType; // Optional: Remove if you don't want the SurveyType object in the response
          });
      });

      return { status: true, survey: surveyJSON };
  } catch (error) {
      return { status: false, message: error.message, error: error.toString() };
  }
};



const getOneSurveyWithoutData = async (surveyID) => {
    try {
        const survey = await Survey.findByPk(surveyID);

        if (!survey) {
            return { status: false, message: "Survey not found" };
        }

        return { status: true, survey };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

const getAllSurvey = async () => {
    try {
        const surveys = await Survey.findAll({
            attributes: { 
                exclude: [
                    "CreatedAt", "ResponseRate",
                    "CreatedBy", "UpdatedAt", "UpdatedBy"
                ]
            }
        });
        return { status: true, message: "Surveys fetched successfully", surveys };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

const updateSurvey = async (surveyID, updateData) => {
    const transaction = await sequelize.transaction();

    try {
        // Update the survey main details
        await Survey.update(updateData, {
            where: { SurveyID: surveyID },
            transaction
        });

        // Iterate through each page data in the updateData
        for (const pageData of updateData.pages || []) {
            if (pageData.PageID) {
                // Update existing question
                const questionData = pageData.question;
                if (questionData && questionData.QuestionID) {
                    await updateSurveyQuestion(questionData.QuestionID, questionData, transaction);
                }
            } else {
                // Create new page and question
                const newPageID = await createSurveyPage({ SurveyID: surveyID, PageOrder: pageData.PageOrder }, transaction);
                const questionData = pageData.question;
                if (questionData) {
                    await createSurveyQuestion({ ...questionData, PageID: newPageID }, transaction);
                }
            }
        }

        await transaction.commit();
        const updatedSurvey = await Survey.findByPk(surveyID);
        return { status: true, message: "Survey updated successfully", updatedSurvey };
    } catch (error) {
        if (transaction.finished !== 'commit') {
            await transaction.rollback();
        }
        return { status: false, message: error.message, error: error.toString() };
    }
};

const deleteSurvey = async (surveyID) => {
    const transaction = await sequelize.transaction();

    try {
        // First, find all the pages associated with the survey
        const pages = await SurveyPage.findAll({
            where: { SurveyID: surveyID },
            transaction
        });

        // Delete each question associated with each page
        for (const page of pages) {
            await SurveyQuestion.destroy({
                where: { PageID: page.PageID },
                transaction
            });
        }

        // Delete all the pages associated with the survey
        await SurveyPage.destroy({
            where: { SurveyID: surveyID },
            transaction
        });

        // Finally, delete the survey itself
        await Survey.destroy({
            where: { SurveyID: surveyID },
            transaction
        });

        await transaction.commit();
        return { status: true, message: "Survey deleted successfully" };
    } catch (error) {
        if (transaction.finished !== 'commit') {
            await transaction.rollback();
        }
        return { status: false, message: error.message, error: error.toString() };
    }
};

const searchSurvey = async (column, searchTerm) => {
    console.log(column,searchTerm);
    try {
      const validColumns = [
        "Title",
        "SurveyDescription",
        "InvitationMethod"
      ];
      if (!validColumns.includes(column) && column !== "Fullname") {
        return {
          status: false,
          message: "Invalid search column",
        };
      }
  
      let whereClause;
      if (column === "Fullname") {
        // Split names by spaces, hyphens, or capital letters
        let names = searchTerm.split(/\s|-/).map((name) => name.trim());
  
        // If it's a single string like "NancyMiller", split it further using capital letters
        if (names.length === 1 && names[0].length > 1) {
          names = searchTerm.split(/(?=[A-Z])/).map((name) => name.trim());
        }
  
        if (names.length === 1) {
          whereClause = {
            [Op.or]: [
              { FirstName: { [Op.like]: `%${names[0]}%` } },
              { LastName: { [Op.like]: `%${names[0]}%` } },
            ],
          };
        } else {
          whereClause = {
            [Op.or]: [
              {
                [Op.and]: [
                  { FirstName: { [Op.like]: `%${names[0]}%` } },
                  { LastName: { [Op.like]: `%${names[1]}%` } },
                ],
              },
              {
                [Op.and]: [
                  { FirstName: { [Op.like]: `%${names[1]}%` } },
                  { LastName: { [Op.like]: `%${names[0]}%` } },
                ],
              },
            ],
          };
        }
      } else {
        whereClause = { [column]: { [Op.like]: `%${searchTerm}%` } };
      }
  
      const users = await Survey.findAll({ where: whereClause });
  
      if (!users || users.length === 0) {
        return {
          status: false,
          message: "No surveys found for the given search criteria",
        };
      }
  
      return {
        status: true,
        data: users,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || "Failed to search survey",
        error: error?.toString(),
      };
    }
  };


module.exports = {
    createSurvey,
    getOneSurveyWithData,
    getOneSurveyWithoutData,
    getAllSurvey,
    updateSurvey,
    deleteSurvey,
    searchSurvey
};
