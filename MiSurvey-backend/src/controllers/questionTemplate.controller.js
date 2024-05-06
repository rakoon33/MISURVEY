const { questionTemplateService } = require("../services");

const createQuestionTemplateController = async (req, res) => {
  try {
    const result = await questionTemplateService.createQuestionTemplate(req.body, req.user);
    res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

const getAllQuestionTemplatesController = async (req, res) => {
  const { page, pageSize } = req.query;
  try {
    const result = await questionTemplateService.getAllQuestionTemplates(page, pageSize);
    res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuestionTemplateController = async (req, res) => {
  const { templateID } = req.params;
  try {
    const result = await questionTemplateService.updateQuestionTemplate(templateID, req.body, req.user);
    res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestionTemplateController = async (req, res) => {
  const { templateID } = req.params;
  try {
    const result = await questionTemplateService.deleteQuestionTemplate(templateID, req.user);
    res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuestionTemplateController = async (req, res) => {
  const { templateId } = req.params;
  try {
    const result = await questionTemplateService.getQuestionTemplateById(templateId);
    if (!result.status) {
      return res.status(404).json({ message: result.message });
    }
    res.json(result.template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchQuestionTemplatesController = async (req, res) => {
  const { searchTerm } = req.query;
  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }
  try {
    const result = await questionTemplateService.searchQuestionTemplates(searchTerm);
    if (!result.status) {
      return res.status(404).json({ message: result.message });
    }
    res.json(result.templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuestionTemplateController,
  getAllQuestionTemplatesController,
  updateQuestionTemplateController,
  deleteQuestionTemplateController,
  getQuestionTemplateController,
  searchQuestionTemplatesController,
};
