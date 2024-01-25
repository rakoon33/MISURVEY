const db = require('../config/database');
const { SurveyQuestion, SurveyType, SurveyResponse, Ticket } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const createSurveyResponses = async (responses) => {
    try {
        for (const response of responses) {
            // Insert the survey response and get the inserted response with its ResponseID
            const insertedResponse = await insertIntoSurveyResponses(response);

            // Evaluate the response
            const isBadResponse = await evaluateResponse(insertedResponse);
            if (isBadResponse) {
                // Create a ticket if the response is bad, passing the insertedResponse which includes ResponseID
                await createTicket(insertedResponse);
            }
        }
        return { status: true, message: "Responses recorded successfully" };
    } catch (error) {
        return { status: false, message: error.message };
    }
};


const evaluateResponse = async (response) => {
    const question = await SurveyQuestion.findByPk(response.QuestionID, {
        include: { model: SurveyType, as: 'SurveyType' }
    });

    if (question.SurveyType.SurveyTypeName === 'Text') {
        // Automatically pass text responses
        return false;
    }

    const responseValue = parseInt(response.ResponseValue, 10);
    switch (question.SurveyType.SurveyTypeName) {
        case 'NPS':
            return responseValue < 5;
        case 'Emoticons':
        case 'CSAT':
        case 'Stars':
            return responseValue < 3;
        case 'Thumb':
            return responseValue === 0;
        default:
            return false; // Default case for unexpected types
    }
};

const insertIntoSurveyResponses = async (response) => {
    const insertedResponse = await SurveyResponse.create({
        ...response,
        CreatedAt: new Date() // Ensuring CreatedAt is set
    });
    return insertedResponse;
};


const createTicket = async (response) => {
    return await Ticket.create({
        TicketStatus: 'Open',
        CreatedBy: null, // Setting CreatedBy to null
        SurveyID: response.SurveyID,
        ResponseID: response.ResponseID
    });
};

const getOneResponse = async (responseID) => {
    try {
        const response = await SurveyResponse.findByPk(responseID);
        if (!response) {
            return { status: false, message: "Survey response not found" };
        }
        return { status: true, response };
    } catch (error) {
        return { status: false, message: error.message };
    }
};

const deleteResponse = async (responseID) => {
    try {
        // Start a transaction
        const transaction = await db.sequelize.transaction();

        try {
            // First, delete any tickets associated with the response
            await Ticket.destroy({
                where: { ResponseID: responseID },
                transaction
            });

            // Then, delete the response
            await SurveyResponse.destroy({
                where: { ResponseID: responseID },
                transaction
            });

            // Commit the transaction
            await transaction.commit();
            return { status: true, message: "Survey response and associated tickets deleted successfully" };
        } catch (error) {
            // If an error occurs, roll back the transaction
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        return { status: false, message: error.message };
    }
};

const getAllResponsesFromSurvey = async (surveyID) => {
    try {
        const responses = await SurveyResponse.findAll({
            where: { SurveyID: surveyID },
            include: [
                {
                    model: SurveyQuestion,
                    as: 'SurveyQuestion', // Replace with correct association alias if different
                    include: [
                        {
                            model: SurveyType,
                            as: 'SurveyType' // Replace with correct association alias if different
                        }
                    ]
                },
            ]
        });

        if (responses.length === 0) {
            return { status: false, message: "No responses found for this survey" };
        }

        return { status: true, responses };
    } catch (error) {
        return { status: false, message: error.message };
    }
};


module.exports = {
    createSurveyResponses,
    deleteResponse,
    getOneResponse,
    getAllResponsesFromSurvey
}