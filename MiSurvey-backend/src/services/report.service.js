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
const {   getNPSClassification,
    getCSATClassification,
    getEvaluationForStars } = require("./survey.service");

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
          where: { SurveyID: surveyId }, 
          attributes: ["RecipientCount", "Recipients"],
          required: false 
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

    const uniqueResponseCount = await SurveyResponse.count({
      where: { SurveyID: surveyId },
      distinct: true,
      col: 'ResponseID', 
      group: ['CustomerID', 'QuestionID']
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

      const maxResponsesPerCustomer = uniqueResponseCount.reduce((acc, item) => {
        if (!acc[item.CustomerID] || acc[item.CustomerID] < item.count) {
          acc[item.CustomerID] = item.count; // Cập nhật nếu không có hoặc nhỏ hơn count hiện tại
        }
        return acc;
      }, {});
      
      // Tính tổng các giá trị count lớn nhất của mỗi khách hàng
      const totalMaxResponses = Object.values(maxResponsesPerCustomer).reduce((total, maxCount) => total + maxCount, 0);
      
      
      const totalResponses = question.Responses.length;
      const responseRate =
      totalMaxResponses === 0
          ? "0%"
          : `${((totalResponses / totalMaxResponses) * 100).toFixed(2)}%`;

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
    if (survey.InvitationMethod === "Email" && survey.SurveyDetails.length > 0) {
      recipientInfo = survey.SurveyDetails.map((detail) => ({
        recipientCount: detail.RecipientCount,
        recipients: detail.Recipients.split(', '), 
      }));
    }

    return {
      status: true,
      data: { surveyQuestions: formattedSurveyQuestions, recipientInfo, invitationMethod: survey.InvitationMethod },
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

// Calculate NPS Data
const calculateNpsData = (responses) => {
  const scores = responses.map((res) => parseInt(res.ResponseValue, 10));

  const countByValue = Array.from({ length: 10 }, (_, i) => i + 1).reduce(
    (acc, score) => ({ ...acc, [score]: 0 }),
    {}
  );

  const promoters = scores.filter((score) => score >= 9).length;
  const passives = scores.filter((score) => score >= 7 && score <= 8).length;
  const detractors = scores.filter((score) => score <= 6).length;

  scores.forEach((score) => countByValue[score]++);

  const nps = ((promoters - detractors) / scores.length) * 100;
  const evaluation = getNPSClassification(nps);
  const npsPercentage = `${nps.toFixed(0)}%`;
  return {
    promoters,
    passives,
    detractors,
    total: scores.length,
    nps: npsPercentage,
    evaluation,
    countByValue,
  };
};

// Calculate CSAT Data
const calculateCsatData = (responses) => {
  const scores = responses.map((res) => parseInt(res.ResponseValue, 10));

  const countByValue = Array.from({ length: 5 }, (_, i) => i + 1).reduce(
    (acc, score) => ({ ...acc, [score]: 0 }),
    {}
  );

  const satisfiedCount = scores.filter((score) => score >= 4).length;
  const neutralCount = scores.filter((score) => score === 3).length;
  const dissatisfiedCount = scores.filter((score) => score <= 2).length;

  scores.forEach((score) => countByValue[score]++);
  const csat = (satisfiedCount / scores.length) * 100;
  const evaluation = getCSATClassification(csat);
  const csatPercentage = `${csat.toFixed(0)}%`;

  return {
    satisfied: satisfiedCount,
    neutral: neutralCount,
    dissatisfied: dissatisfiedCount,
    total: scores.length,
    csat: csatPercentage,
    evaluation,
    countByValue,
  };
};

// Calculate Stars Data
const calculateStarsData = (responses) => {
  const scores = responses.map((res) => parseInt(res.ResponseValue, 10));

  const countByValue = Array.from({ length: 5 }, (_, i) => i + 1).reduce(
    (acc, score) => ({ ...acc, [score]: 0 }),
    {}
  );

  const sumOfAllRating = scores.reduce((acc, score) => acc + score, 0);
  const averageRating = sumOfAllRating / scores.length;
  const evaluation = getEvaluationForStars(averageRating);
  scores.forEach((score) => countByValue[score]++);

  return {
    sumOfAllRating,
    averageRating,
    evaluation,
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

    const positivePercentage = ((counts.veryGood + counts.good) / total) * 100;

    const negativePercentage = ((counts.veryBad + counts.bad) / total) * 100;

    let evaluation;
    if (positivePercentage <= 35) {
        evaluation = "Highly Unsatisfied";
    } else if (positivePercentage <= 50) {
        evaluation = "Unsatisfied";
    } else if (positivePercentage <= 65) {
        evaluation = "Quite Satisfied";
    } else if (positivePercentage <= 80) {
        evaluation = "Satisfied";
    } else {
        evaluation = "Highly Satisfied";
    }
    if (responses.length === 0) evaluation = "No Responses";

  return {
    ...counts,
    total,
    negativePercentage: `${negativePercentage.toFixed(0)}%`,
    positivePercentage: `${positivePercentage.toFixed(0)}%`,
    evaluation,
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

  const upPercentage = (thumbsUp / total) * 100;
  const downPercentage = (thumbsDown / total) * 100;

  let evaluation;
    if (upPercentage <= 35) {
        evaluation = "Highly Unsatisfied";
    } else if (upPercentage <= 50) {
        evaluation = "Unsatisfied";
    } else if (upPercentage <= 65) {
        evaluation = "Quite Satisfied";
    } else if (upPercentage <= 80) {
        evaluation = "Satisfied";
    } else {
        evaluation = "Highly Satisfied";
    }

    if (responses.length === 0) evaluation = "No Responses";


  return {
    thumbsUp,
    thumbsDown,
    total,
    upPercentage: `${upPercentage.toFixed(0)}%`,
    downPercentage: `${downPercentage.toFixed(0)}%`,
    evaluation
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
