const { User, Company, Survey, SurveyType, SurveyQuestion } = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

const getDashboardData = async () => {
    try {
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
    } catch (error) {
        return { status: false, message: error.message };
    }
};

const getActivityOverview = async (startDate, endDate) => {
    try {
        const surveyCountByDate = await Survey.findAll({
            where: {
                CreatedAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
            },
            attributes: [
                [sequelize.fn('date', sequelize.col('CreatedAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('SurveyID')), 'count']
            ],
            group: ['date'],
            raw: true
        });

        const newUserCountByDate = await User.findAll({
            where: {
                CreatedAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
            },
            attributes: [
                [sequelize.fn('date', sequelize.col('CreatedAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('UserID')), 'count']
            ],
            group: ['date'],
            raw: true
        });

        return {
            status: true,
            data: {
                surveyCountByDate,
                newUserCountByDate
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
};

const getSurveyTypeUsage = async (startDate, endDate) => {
    try {
        const surveyTypeUsage = await SurveyType.findAll({
            include: [{
                model: SurveyQuestion,
                as: 'SurveyQuestions',
                include: [{
                    model: Survey,
                    as: 'Surveys',
                    where: {
                        CreatedAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                    },
                    attributes: []  // Không lấy thêm thuộc tính nào từ Survey
                }]
            }],
            attributes: [
                'SurveyTypeName',
                [sequelize.fn('COUNT', sequelize.col('SurveyQuestions.SurveyQuestions->Surveys.SurveyID')), 'SurveyCount']
            ],
            group: ['SurveyType.SurveyTypeID', 'SurveyTypeName'],
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


module.exports = {
    getDashboardData,
    getSurveyTypeUsage,
    getActivityOverview
};
