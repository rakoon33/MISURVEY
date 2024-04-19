const db = require("../config/database");
const {
  SurveyQuestion,
  SurveyType,
  SurveyResponse,
  Ticket,
  Customer,
} = require("../models");

const createSurveyResponses = async (data) => {
  try {
    let customerID = null;

    // Check if customer information is provided
    if (data.FullName && data.Email) {
      // Check for existing customer first
      const existingCustomer = await Customer.findOne({
        where: { Email: data.Email } // Assumed unique
      });

      if (existingCustomer) {
        customerID = existingCustomer.CustomerID;
      } else {
        // Create new customer if not found
        const customerResult = await createCustomer(data);
        if (!customerResult.status) {
          throw new Error(customerResult.message);
        }
        customerID = customerResult.CustomerID;
      }
    }

    // Process each survey response
    for (const response of data.SurveyResponses) {
      // Include CustomerID in the response if available
      const responseWithCustomer = { ...response, CustomerID: customerID };

      // Insert the survey response
      const insertedResponse = await insertIntoSurveyResponses(
        responseWithCustomer
      );

      // Evaluate the response
      const isBadResponse = await evaluateResponse(insertedResponse);
      if (isBadResponse) {
        // Create a ticket if the response is bad
        await createTicket(insertedResponse);
      }
    }

    return { status: true, message: "Responses recorded successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const evaluateResponse = async (response) => {
  const question = await SurveyQuestion.findByPk(response.QuestionID, {
    include: { model: SurveyType, as: "SurveyType" },
  });

  if (!question) {
    // If there is no question found, we cannot evaluate the response
    return false;
  }

  let isBadResponse = false; // Flag to determine if the response is bad

  const responseValue = response.ResponseValue;
  const surveyType = question.SurveyType.SurveyTypeName;

  if (question.SurveyType.SurveyTypeName === "Text") {
    // Automatically pass text responses
    return false;
  }

  // Determine if the response is bad based on the survey type
  switch (surveyType) {
    case "NPS":
      isBadResponse = parseInt(responseValue, 10) < 7;
      break;
    case "Emoticons":
      isBadResponse = ["very-bad", "bad"].includes(responseValue);
      break;
    case "Stars":
      isBadResponse = parseInt(responseValue, 10) < 3;
      break;
    case "Thumb":
      isBadResponse = responseValue === "false";
      break;
    case "CSAT":
      isBadResponse = parseInt(responseValue, 10) < 3;
      break;
    default:
      isBadResponse = false;
      break;
  }

  return isBadResponse;
};

// Helper function to determine negativity in text responses
const isNegativeText = (textResponse) => {
  // Placeholder for actual text analysis logic
  // For now, simply returns false
  // TODO: Implement actual sentiment analysis to determine negativity
  return false;
};


const insertIntoSurveyResponses = async (response) => {
  const insertedResponse = await SurveyResponse.create({
    ...response,
    CreatedAt: new Date(),
  });
  return insertedResponse;
};

const createTicket = async (response) => {
  return await Ticket.create({
    TicketStatus: "Open",
    SurveyID: response.SurveyID,
    ResponseID: response.ResponseID,
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
    const getResponse = await getOneResponse(responseID);
    if (!getResponse.status) {
      // If the response doesn't exist, return the message from getOneResponse
      return getResponse;
    }
    
    const transaction = await db.sequelize.transaction();
    try {
      // First, delete any tickets associated with the response
      await Ticket.destroy({
        where: { ResponseID: responseID },
        transaction,
      });

      // Then, delete the response
      await SurveyResponse.destroy({
        where: { ResponseID: responseID },
        transaction,
      });

      // Commit the transaction
      await transaction.commit();
      return {
        status: true,
        message: "Survey response and associated tickets deleted successfully",
      };
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
          as: "SurveyQuestion", // Replace with correct association alias if different
          include: [
            {
              model: SurveyType,
              as: "SurveyType", // Replace with correct association alias if different
            },
          ],
        },
      ],
    });

    if (responses.length === 0) {
      return { status: false, message: "No responses found for this survey" };
    }

    return { status: true, responses };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const createCustomer = async (customerData) => {
  try {
    const newCustomer = await Customer.create({
      Email: customerData.Email,
      PhoneNumber: customerData.PhoneNumber,
      FullName: customerData.FullName,
    });

    return {
      status: true,
      message: "Customer created successfully",
      CustomerID: newCustomer.CustomerID, // Returning the CustomerID of the newly created customer
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      error: error.toString(),
    };
  }
};

module.exports = {
  createSurveyResponses,
  deleteResponse,
  getOneResponse,
  getAllResponsesFromSurvey,
};
