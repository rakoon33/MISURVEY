const db = require("../config/database");
const {
  SurveyQuestion,
  SurveyType,
  SurveyResponse,
  Ticket,
  Customer,
  UserPackage,
  ServicePackage,
  Survey
} = require("../models");

const createSurveyResponses = async (data) => {
  try {
    let customerID = null;

    // Use 'Anonymous' if FullName is empty or not provided
    const fullName =
      data.FullName && data.FullName.trim()
        ? data.FullName
        : `Anonymous_${Date.now()}`;

    // Always check for or create a customer regardless of whether email is provided
    if (data.Email) {
      // Check for existing customer by email first
      const existingCustomer = await Customer.findOne({
        where: { Email: data.Email }, // Email assumed unique
      });

      if (existingCustomer) {
        customerID = existingCustomer.CustomerID;
      } else {
        // Create new customer with provided email
        const customerResult = await createCustomer({
          ...data,
          FullName: fullName,
        });
        if (!customerResult.status) {
          throw new Error(customerResult.message);
        }
        customerID = customerResult.CustomerID;
      }
    } else {
      // Create new customer with 'Anonymous' and no email
      const customerResult = await createCustomer({
        Email: "",
        FullName: fullName,
      });
      if (!customerResult.status) {
        throw new Error(customerResult.message);
      }
      customerID = customerResult.CustomerID;
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

const getSurveyResponseCount = async (surveyID) => {
  try {
    // Fetch the survey to get the associated CompanyID
    const survey = await Survey.findByPk(surveyID);

    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    // Get the active package using the company ID
    const companyID = survey.CompanyID;

    let activePackage = await UserPackage.findOne({
      where: {
        CompanyID: companyID,
        IsActive: true,
      },
      include: [{ model: ServicePackage, as: "servicePackage" }],
    });

    if (
      activePackage &&
      activePackage.EndDate &&
      new Date(activePackage.EndDate) < new Date()
    ) {
      activePackage.IsActive = false;
      await activePackage.save();
      activePackage = null;
    }

    if (!activePackage) {
      const freePackage = await UserPackage.findOne({
        where: {
          PackageID: 1,
          CompanyID: companyID,
          IsActive: false,
        },
        include: [{ model: ServicePackage, as: "servicePackage" }],
      });

      if (freePackage) {
        freePackage.IsActive = true;
        await freePackage.save();
        activePackage = freePackage;
      }
    }

    if (!activePackage) {
      return { status: false, message: "No active package found" };
    }

    // Count unique customers who have submitted responses for the survey
    const responseCount = await SurveyResponse.count({
      where: { SurveyID: surveyID },
      distinct: true,
      col: 'CustomerID'
    });

    // Return both the count and the package information
    return {
      status: true,
      count: responseCount,
      responseLimit: activePackage.servicePackage.ResponseLimit
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

module.exports = {
  createSurveyResponses,
  deleteResponse,
  getOneResponse,
  getAllResponsesFromSurvey,
  getSurveyResponseCount,
};
