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
        const customers = await Customer.findAll({
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
        customerCount = customers.length;
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
        endDateParsed.setDate(endDateParsed.getDate() + 1);
        if (isNaN(startDateParsed.getTime()) || isNaN(endDateParsed.getTime())) {
            throw new Error("Invalid date format provided.");
        }

        let whereCondition = {
            '$User.CreatedAt$': {
                [Op.gte]: startDateParsed, 
                [Op.lte]: endDateParsed 
            }  
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
        let startDateParsed = new Date(startDate);
        let endDateParsed = new Date(endDate);
        endDateParsed.setDate(endDateParsed.getDate() + 1);
        if (isNaN(startDateParsed.getTime()) || isNaN(endDateParsed.getTime())) {
            throw new Error("Invalid date format provided.");
        }
        
        if (userData.role === "SuperAdmin") {
            // Truy vấn cho SuperAdmin không cần bộ lọc CompanyID
            return await getSurveyTypeUsageForSuperAdmin(startDateParsed, endDateParsed);
        } else {
            // Truy vấn cho các roles khác, áp dụng bộ lọc CompanyID
            return await getSurveyTypeUsageForNonSuperAdmin(startDateParsed, endDateParsed, userData.companyID);
        }
    } catch (error) {
        console.error("Error in getSurveyTypeUsage: ", error);
        return { status: false, message: error.message };
    }
};


const getSurveyTypeUsageForSuperAdmin = async (startDate, endDate) => {
    const surveyTypeUsage = await SurveyType.findAll({
        include: [{
            model: SurveyQuestion,
            as: 'SurveyQuestions',
            attributes: [],
            include: [{
                model: Survey,
                as: 'Survey',
                where: {
                    CreatedAt: {
                        [Op.gte]: startDate, 
                        [Op.lte]: endDate 
                    }  
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
};

const getSurveyTypeUsageForNonSuperAdmin = async (startDate, endDate, companyID) => {
    const surveyTypeUsage = await SurveyType.findAll({
        include: [{
            model: SurveyQuestion,
            as: 'SurveyQuestions',
            attributes: [],
            include: [{
                model: Survey,
                as: 'Survey',
                where: {
                    CreatedAt: {
                        [Op.gte]: startDate, 
                        [Op.lte]: endDate 
                    }  ,
                    CompanyID: companyID 
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
};
const getSurveyCountByDateRange = async (startDate, endDate, userData) => {
    try {
        let startDateParsed = new Date(startDate);
        let endDateParsed = new Date(endDate);
        endDateParsed.setDate(endDateParsed.getDate() + 1);
        if (isNaN(startDateParsed.getTime()) || isNaN(endDateParsed.getTime())) {
            throw new Error("Invalid date format provided.");
        }

        let whereCondition = {
            CreatedAt: {
                [Op.gte]: startDateParsed, 
                [Op.lte]: endDateParsed 
            }  
        };

        // Apply the company filter for non-SuperAdmin users
        if (userData.role !== "SuperAdmin") {
            whereCondition.CompanyID = userData.companyID;
        }

        const dailySurveyCount = await Survey.findAll({
            where: whereCondition,
            attributes: [
                [sequelize.fn('date', sequelize.col('CreatedAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('SurveyID')), 'count']
            ],
            group: [sequelize.fn('date', sequelize.col('CreatedAt'))],
            raw: true
        });

        return {
            status: true,
            data: dailySurveyCount,
            message: "Survey count fetched successfully for each day"
        };
    } catch (error) {
        console.error('Error fetching daily survey count:', error);
        return { status: false, message: error.message };
    }
};


module.exports = {
    getDashboardData,
    getSurveyTypeUsage,
    getActivityOverview,
    getSurveyCountByDateRange
};
