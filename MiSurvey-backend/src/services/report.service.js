const {
  User,
  Company,
  Survey,
  SurveyType,
  SurveyQuestion,
  CompanyUser,
  CompanyRole,
  Customer,
  SurveyResponse,
  SurveyDetail,
} = require("../models");
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
        },
      };
    } else {
      // Fetch data scoped to the user's company
      const userCount = await User.count({
        include: [
          {
            model: CompanyUser,
            as: "CompanyUsers", // Using the correct alias as defined in models/index.js
            required: true,
            where: { CompanyID: userData.companyID },
          },
        ],
      });
      const surveyCount = await Survey.count({
        where: {
          CompanyID: userData.companyID,
        },
      });
      const companyRoleCount = await CompanyRole.count({
        where: {
          CompanyID: userData.companyID,
        },
      });
      const customers = await Customer.findAll({
        include: [
          {
            model: SurveyResponse,
            as: "Responses", // Ensuring to use the correct alias
            required: true,
            include: [
              {
                model: Survey,
                as: "Survey", // Ensuring to use the correct alias
                required: true,
                where: {
                  CompanyID: userData.companyID,
                },
              },
            ],
          },
        ],
      });
      customerCount = customers.length;
      return {
        status: true,
        data: {
          userCount,
          surveyCount,
          companyRoleCount,
          customerCount,
        },
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
      "$User.CreatedAt$": {
        [Op.gte]: startDateParsed,
        [Op.lte]: endDateParsed,
      },
    };

    if (userData.role !== "SuperAdmin") {
      // Adjusting query for non-SuperAdmin to join with CompanyUser table
      const newUserCountByDate = await User.findAll({
        include: [
          {
            model: CompanyUser,
            as: "CompanyUsers",
            required: true,
            where: { CompanyID: userData.companyID },
          },
        ],
        where: whereCondition,
        attributes: [
          [sequelize.fn("date", sequelize.col("User.CreatedAt")), "date"], // Specify the table alias in the function
          [sequelize.fn("COUNT", sequelize.col("User.UserID")), "count"], // Specify the table alias here too
        ],
        group: ["date"],
        raw: true,
      });

      return {
        status: true,
        data: {
          newUserCountByDate,
        },
      };
    } else {
      // SuperAdmin query does not need to filter by company
      const newUserCountByDate = await User.findAll({
        where: whereCondition,
        attributes: [
          [sequelize.fn("date", sequelize.col("User.CreatedAt")), "date"],
          [sequelize.fn("COUNT", sequelize.col("User.UserID")), "count"],
        ],
        group: ["date"],
        raw: true,
      });

      return {
        status: true,
        data: {
          newUserCountByDate,
        },
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
      return await getSurveyTypeUsageForSuperAdmin(
        startDateParsed,
        endDateParsed
      );
    } else {
      // Truy vấn cho các roles khác, áp dụng bộ lọc CompanyID
      return await getSurveyTypeUsageForNonSuperAdmin(
        startDateParsed,
        endDateParsed,
        userData.companyID
      );
    }
  } catch (error) {
    console.error("Error in getSurveyTypeUsage: ", error);
    return { status: false, message: error.message };
  }
};

const getSurveyTypeUsageForSuperAdmin = async (startDate, endDate) => {
  const surveyTypeUsage = await SurveyType.findAll({
    include: [
      {
        model: SurveyQuestion,
        as: "SurveyQuestions",
        attributes: [],
        include: [
          {
            model: Survey,
            as: "Survey",
            where: {
              CreatedAt: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
              },
            },
            attributes: [],
          },
        ],
      },
    ],
    attributes: [
      "SurveyTypeName",
      [
        sequelize.fn("COUNT", sequelize.col("SurveyQuestions.QuestionID")),
        "QuestionCount",
      ],
    ],
    group: ["SurveyTypeID", "SurveyTypeName"],
    raw: true,
  });

  return {
    status: true,
    data: surveyTypeUsage,
  };
};

const getSurveyTypeUsageForNonSuperAdmin = async (
  startDate,
  endDate,
  companyID
) => {
  const surveyTypeUsage = await SurveyType.findAll({
    include: [
      {
        model: SurveyQuestion,
        as: "SurveyQuestions",
        attributes: [],
        include: [
          {
            model: Survey,
            as: "Survey",
            where: {
              CreatedAt: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
              },
              CompanyID: companyID,
            },
            attributes: [],
          },
        ],
      },
    ],
    attributes: [
      "SurveyTypeName",
      [
        sequelize.fn("COUNT", sequelize.col("SurveyQuestions.QuestionID")),
        "QuestionCount",
      ],
    ],
    group: ["SurveyTypeID", "SurveyTypeName"],
    raw: true,
  });

  return {
    status: true,
    data: surveyTypeUsage,
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
        [Op.lte]: endDateParsed,
      },
    };

    // Apply the company filter for non-SuperAdmin users
    if (userData.role !== "SuperAdmin") {
      whereCondition.CompanyID = userData.companyID;
    }

    const dailySurveyCount = await Survey.findAll({
      where: whereCondition,
      attributes: [
        [sequelize.fn("date", sequelize.col("CreatedAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("SurveyID")), "count"],
      ],
      group: [sequelize.fn("date", sequelize.col("CreatedAt"))],
      raw: true,
    });

    return {
      status: true,
      data: dailySurveyCount,
      message: "Survey count fetched successfully for each day",
    };
  } catch (error) {
    console.error("Error fetching daily survey count:", error);
    return { status: false, message: error.message };
  }
};

// report in detail for survey
const getSurveyQuestionData = async (surveyId) => {
  try {
    const survey = await Survey.findOne({
      where: { SurveyID: surveyId },
      include: [
        {
          model: SurveyQuestion,
          as: "SurveyQuestions",
          include: [
            {
              model: SurveyResponse,
              as: "Responses",
              attributes: ["ResponseValue"],
            },
            {
              model: SurveyType,
              as: "SurveyType",
              attributes: ["SurveyTypeName"],
            },
          ],
          attributes: ["QuestionID", "QuestionText"],
        },
        {
          model: SurveyDetail,
          as: "SurveyDetails",
          attributes: ["RecipientCount", "Recipients"], // Remove where clause
        },
      ],
      attributes: ["InvitationMethod"],
    });

    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    // Count the total number of participants who took the survey
    const totalParticipants = await SurveyResponse.count({
      where: { SurveyID: surveyId },
      distinct: true,
      col: "CustomerID",
    });

    const formattedSurveyQuestions = survey.SurveyQuestions.map((question) => {
      let formattedData;
      switch (question.SurveyType.SurveyTypeName) {
        case "NPS":
          formattedData = calculateNpsData(question.Responses);
          break;
        case "CSAT":
          formattedData = calculateCsatData(question.Responses);
          break;
        case "Stars":
          formattedData = calculateStarsData(question.Responses);
          break;
        case "Emoticons":
          formattedData = calculateEmoticonsData(question.Responses);
          break;
        case "Thumbs":
          formattedData = calculateThumbsData(question.Responses);
          break;
        case "Text":
          formattedData = calculateTextData(question.Responses);
          break;
        default:
          formattedData = question.Responses.map((res) => res.ResponseValue);
          break;
      }

      // Calculate response rate
      const totalResponses = question.Responses.length;
      const responseRate =
        totalParticipants === 0
          ? "0%"
          : `${((totalResponses / totalParticipants) * 100).toFixed(2)}%`;

      return {
        questionId: question.QuestionID,
        questionText: question.QuestionText,
        questionType: question.SurveyType.SurveyTypeName,
        data: formattedData,
        responseRate,
      };
    });

    // Only include the survey details if InvitationMethod is 'Email'
    let recipientInfo = null;
    if (
      survey.InvitationMethod === "Email" &&
      survey.SurveyDetails.length > 0
    ) {
      recipientInfo = survey.SurveyDetails.map((detail) => ({
        recipientCount: detail.RecipientCount,
        recipients: detail.Recipients,
      }));
    }

    return {
      status: true,
      data: { surveyQuestions: formattedSurveyQuestions, recipientInfo },
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

// Calculate NPS Data
const calculateNpsData = (responses) => {
  const scores = responses.map((res) => parseInt(res.ResponseValue, 10));

  // Initialize counts with all possible values (0 to 10) set to 0
  const countByValue = Array.from({ length: 10 }, (_, i) => i + 1).reduce(
    (acc, score) => ({ ...acc, [score]: 0 }),
    {}
  );

  const promoters = scores.filter((score) => score >= 9).length;
  const passives = scores.filter((score) => score >= 7 && score <= 8).length;
  const detractors = scores.filter((score) => score <= 6).length;

  scores.forEach((score) => countByValue[score]++);

  return {
    promoters,
    passives,
    detractors,
    total: scores.length,
    nps: ((promoters - detractors) / scores.length) * 100,
    countByValue,
  };
};

// Calculate CSAT Data
const calculateCsatData = (responses) => {
  const scores = responses.map((res) => parseInt(res.ResponseValue, 10));

  // Initialize counts with all possible values (1 to 5) set to 0
  const countByValue = Array.from({ length: 5 }, (_, i) => i + 1).reduce(
    (acc, score) => ({ ...acc, [score]: 0 }),
    {}
  );

  const satisfiedCount = scores.filter((score) => score >= 4).length;
  const neutralCount = scores.filter((score) => score === 3).length;
  const dissatisfiedCount = scores.filter((score) => score <= 2).length;

  scores.forEach((score) => countByValue[score]++);

  return {
    satisfied: satisfiedCount,
    neutral: neutralCount,
    dissatisfied: dissatisfiedCount,
    total: scores.length,
    csat: (satisfiedCount / scores.length) * 100,
    countByValue,
  };
};

// Calculate Stars Data
const calculateStarsData = (responses) => {
  const scores = responses.map((res) => parseInt(res.ResponseValue, 10));

  // Initialize counts with all possible values (1 to 5) set to 0
  const countByValue = Array.from({ length: 5 }, (_, i) => i + 1).reduce(
    (acc, score) => ({ ...acc, [score]: 0 }),
    {}
  );

  const averageRating =
    scores.reduce((acc, score) => acc + score, 0) / scores.length;

  scores.forEach((score) => countByValue[score]++);

  return {
    averageRating,
    total: scores.length,
    countByValue,
  };
};

// Calculate Emoticons Data
const calculateEmoticonsData = (responses) => {
  const counts = {
    veryBad: 0,
    bad: 0,
    neutral: 0,
    good: 0,
    veryGood: 0,
  };

  responses.forEach((res) => {
    const value = res.ResponseValue.toLowerCase();
    if (value.includes("very-bad")) counts["veryBad"]++;
    else if (value.includes("bad")) counts["bad"]++;
    else if (value.includes("meh")) counts["neutral"]++;
    else if (value.includes("good")) counts["good"]++;
    else if (value.includes("very-good")) counts["veryGood"]++;
  });

  const total =
    counts.veryBad +
    counts.bad +
    counts.neutral +
    counts.good +
    counts.veryGood;

  return {
    ...counts,
    total,
    negativePercentage: ((counts.veryBad + counts.bad) / total) * 100,
    positivePercentage: ((counts.veryGood + counts.good) / total) * 100,
  };
};

// Calculate Thumbs Data
const calculateThumbsData = (responses) => {
  const thumbsUp = responses.filter(
    (res) => res.ResponseValue === "true"
  ).length;
  const thumbsDown = responses.filter(
    (res) => res.ResponseValue === "false"
  ).length;

  const total = thumbsUp + thumbsDown;

  return {
    thumbsUp,
    thumbsDown,
    total,
    upPercentage: (thumbsUp / total) * 100,
    downPercentage: (thumbsDown / total) * 100,
  };
};

const calculateTextData = (responses) => {
  return {
    responses: responses.map((res) => res.ResponseValue),
    total: responses.length,
  };
};

module.exports = {
  getDashboardData,
  getSurveyTypeUsage,
  getActivityOverview,
  getSurveyCountByDateRange,
  getSurveyQuestionData,
};
