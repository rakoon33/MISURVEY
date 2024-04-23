const { QuestionTemplate, SurveyType } = require("../models");
const { Op } = require("sequelize");

const createQuestionTemplate = async (data) => {
  try {
    const template = await QuestionTemplate.create(data);
    return { status: true, message: 'Create question successfully', template };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const getAllQuestionTemplates = async (page, pageSize) => {
    try {
      // Include Sequelize's "limit" and "offset" options to fetch the paginated data
      const limit = pageSize ? parseInt(pageSize, 10) : 10; // default page size to 10
      const offset = page ? (parseInt(page, 10) - 1) * limit : 0; // default page to first
  
      const { count, rows: templates } = await QuestionTemplate.findAndCountAll({
        include: [
          {
            model: SurveyType,
            as: "SurveyType",
          },
        ],
        limit,
        offset,
      });
  
      return { status: true, templates, total: count };
    } catch (error) {
      return { status: false, message: error.message };
    }
  };
  

const updateQuestionTemplate = async (templateID, updates) => {
  try {
    const template = await QuestionTemplate.findByPk(templateID);
    if (!template) {
      return { status: false, message: "Template not found" };
    }
    await template.update(updates);
    return { status: true, message: 'Update question successfully', template };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const deleteQuestionTemplate = async (templateID) => {
  try {
    const result = await QuestionTemplate.destroy({
      where: { TemplateID: templateID },
    });
    if (result === 0) {
      return { status: false, message: "Template not found" };
    }
    return { status: true, message: "Template deleted successfully" };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const getQuestionTemplateById = async (templateId) => {
  try {
    const template = await QuestionTemplate.findByPk(templateId, {
      include: [
        {
          model: SurveyType,
          as: "SurveyType",
        }
      ],
    });
    if (!template) {
      return { status: false, message: "Template not found" };
    }
    return { status: true, template };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const searchQuestionTemplates = async (searchTerm) => {
  try {
    const templates = await QuestionTemplate.findAll({
      where: {
        [Op.or]: [
          {
            TemplateText: {
              [Op.like]: `%${searchTerm}%`,
            },
          },
          {
            TemplateCategory: {
              [Op.like]: `%${searchTerm}%`,
            },
          },
        ],
      },
      include: [
        {
          model: SurveyType,
          as: "SurveyType",
        },
      ],
    });
    return { status: true, templates };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

module.exports = {
  createQuestionTemplate,
  getAllQuestionTemplates,
  updateQuestionTemplate,
  deleteQuestionTemplate,
  getQuestionTemplateById,
  searchQuestionTemplates,
};
