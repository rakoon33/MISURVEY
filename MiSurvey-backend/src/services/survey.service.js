const db = require('../config/database');
const { Survey, SurveyPage, SurveyQuestion, SurveyType } = require('../models');
const {createSurveyPage, updateSurveyPage} = require('./surveyPage.service');
const {createSurveyQuestion, updateSurveyQuestion} = require('./surveyQuestion.service');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
let nanoid;

const createSurvey = async (data) => {
  let nanoid;
  if (!nanoid) {
      nanoid = (await import('nanoid')).nanoid;
  }

  try {
      const surveyData = data; // Assuming 'data' contains all necessary survey information

      // Start a transaction
      const transaction = await db.sequelize.transaction();

      try {
          // Create the survey
          const survey = await Survey.create({
              UserID: surveyData.UserID,
              CompanyID: surveyData.CompanyID,
              Title: surveyData.Title,
              SurveyDescription: surveyData.SurveyDescription,
              SurveyImages: surveyData.SurveyImages,
              InvitationMethod: surveyData.InvitationMethod,
              SurveyStatus: surveyData.SurveyStatus,
              Customizations: surveyData.Customizations,
              CreatedBy: surveyData.CreatedBy,
              Approve: surveyData.Approve
          }, { transaction });

          // Generate a SurveyLink using nanoid
          surveyData.SurveyLink = nanoid();
          await survey.update({ SurveyLink: surveyData.SurveyLink }, { transaction });

          // Create each survey page and its questions
          for (const pageData of surveyData.SurveyPages) {
              // Create the survey page
              const page = await SurveyPage.create({
                  SurveyID: survey.SurveyID,
                  PageOrder: pageData.PageOrder
              }, { transaction });

              // Prepare question data
              const questionData = pageData.SurveyQuestions;
              questionData.PageID = page.PageID;

              // Create the survey question
              await SurveyQuestion.create(questionData, { transaction });
          }

          // Commit the transaction
          await transaction.commit();

          return { status: true, message: "Survey created successfully", survey: survey.toJSON() };
      } catch (error) {
          // Rollback the transaction in case of an error
          await transaction.rollback();
          throw error; // Rethrow the error after rollback
      }
  } catch (error) {
      // If an error is caught, it means transaction rollback also failed
      return { status: false, message: error.message, error: error.toString() };
  }
};

const getOneSurveyWithData = async (surveyID) => {
  try {
    const survey = await Survey.findByPk(surveyID, {
      attributes: [
        'UserID', 'CompanyID', 'Title', 'Customizations', 'SurveyDescription', 'SurveyImages', 
        'InvitationMethod', 'SurveyStatus', 'CreatedBy', 'Approve',
        // Any other attributes you want to include
      ],
      include: [{
        model: SurveyPage,
        as: 'SurveyPages',
        attributes: ['PageOrder'],
        include: [{
          model: SurveyQuestion,
          as: 'SurveyQuestions',
          attributes: ['QuestionText', 'QuestionType'],
        }]
      }]
    });

    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    // Transform the response to match the required output format
    const surveyJSON = survey.toJSON();

    // Iterate over SurveyPages and SurveyQuestions to adjust the structure
    surveyJSON.SurveyPages.forEach(page => {
      page.SurveyQuestions.forEach(question => {
        if (question.SurveyType) {
          question.SurveyTypeName = question.SurveyType.SurveyTypeName;
          delete question.SurveyType; // Remove the SurveyType object
        }
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
