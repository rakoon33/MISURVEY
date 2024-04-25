const { User, Company, Survey, SurveyType, SurveyQuestion, CompanyUser, CompanyRole, Customer, SurveyResponse } = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

const getDashboardData = async (userData) => {
    try {
      if (userData.role === "SuperAdmin") {
        // Fetch data as SuperAdmin (system-wide)
        const userCount = await User.count();
        const companyCount = await Company.count();
        const surveyCount = await Survey.count();
  
        return {
          status: true,
          data: {
            userCount,
            companyCount,
            surveyCount,
          }
        };
      } else {
        // Fetch data scoped to the user's company
        const userCount = await User.count({
          include: [{
            model: CompanyUser,
            as: 'CompanyUsers', // Using the correct alias as defined in models/index.js
            required: true,
            where: { CompanyID: userData.companyID }
          }]
        });
        const surveyCount = await Survey.count({
          where: {
            CompanyID: userData.companyID
          }
        });
        const companyRoleCount = await CompanyRole.count({
          where: {
            CompanyID: userData.companyID
          }
        });
        const customerCount = await Customer.count({
          include: [{
            model: SurveyResponse,
            as: 'Responses', // Ensuring to use the correct alias
            required: true,
            include: [{
              model: Survey,
              as: 'Survey', // Ensuring to use the correct alias
              required: true,
              where: {
                CompanyID: userData.companyID
              }
            }]
          }]
        });
  
        return {
          status: true,
          data: {
            userCount,
            surveyCount,
            companyRoleCount,
            customerCount
          }
        };
      }
    } catch (error) {
      return { status: false, message: error.message };
    }
  };
  

  const getActivityOverview = async (startDate, endDate, userData) => {
    try {
        let startDateParsed = new Date(startDate);
        let endDateParsed = new Date(endDate);
        if (isNaN(startDateParsed.getTime()) || isNaN(endDateParsed.getTime())) {
            throw new Error("Invalid date format provided.");
        }

        let whereCondition = {
            '$User.CreatedAt$': { [Op.between]: [startDateParsed, endDateParsed] }  // Explicitly specify the table alias for CreatedAt
        };

        if (userData.role !== "SuperAdmin") {
            // Adjusting query for non-SuperAdmin to join with CompanyUser table
            const newUserCountByDate = await User.findAll({
                include: [{
                    model: CompanyUser,
                    as: 'CompanyUsers',
                    required: true,
                    where: { CompanyID: userData.companyID }
                }],
                where: whereCondition,
                attributes: [
                    [sequelize.fn('date', sequelize.col('User.CreatedAt')), 'date'],  // Specify the table alias in the function
                    [sequelize.fn('COUNT', sequelize.col('User.UserID')), 'count']   // Specify the table alias here too
                ],
                group: ['date'],
                raw: true
            });

            return {
                status: true,
                data: {
                    newUserCountByDate
                }
            };
        } else {
            // SuperAdmin query does not need to filter by company
            const newUserCountByDate = await User.findAll({
                where: whereCondition,
                attributes: [
                    [sequelize.fn('date', sequelize.col('User.CreatedAt')), 'date'],
                    [sequelize.fn('COUNT', sequelize.col('User.UserID')), 'count']
                ],
                group: ['date'],
                raw: true
            });

            return {
                status: true,
                data: {
                    newUserCountByDate
                }
            };
        }
    } catch (error) {
        return { status: false, message: error.message };
    }
};



const getSurveyTypeUsage = async (startDate, endDate, userData) => {
    try {
        // Assuming SurveyQuestion has a CreatedAt or you filter through Survey
        const surveyTypeUsage = await SurveyType.findAll({
            include: [{
                model: SurveyQuestion,
                as: 'SurveyQuestions',
                attributes: [], // No additional attributes from SurveyQuestions
                include: [{
                    model: Survey,
                    as: 'Survey', // Make sure this alias is correct
                    where: {
                        CreatedAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                    },
                    attributes: []
                }]
            }],
            attributes: [
                'SurveyTypeName',
                [sequelize.fn('COUNT', sequelize.col('SurveyQuestions.QuestionID')), 'QuestionCount']
            ],
            group: ['SurveyTypeID', 'SurveyTypeName'],
            raw: true
        });

        return {
            status: true,
            data: surveyTypeUsage
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
};


const getSurveyCountByDateRange = async (startDate, endDate, userData) => {
    try {
        const surveyCount = await Survey.count({
            where: {
                CreatedAt: {
                    [Op.between]: [
                        new Date(startDate).toISOString(),
                        new Date(endDate).toISOString()
                    ]
                }
            },
        
        });

        return {
            status: true,
            data: { surveyCount },
            message: "Survey count fetched successfully"
        };
    } catch (error) {
        console.error('Error fetching survey count:', error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    getDashboardData,
    getSurveyTypeUsage,
    getActivityOverview,
    getSurveyCountByDateRange
};
