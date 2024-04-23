const { questionTemplateService } = require("../services");

const createQuestionTemplateController = async (req, res) => {
  const result = await questionTemplateService.createQuestionTemplate(req.body);
  res.status(result.status ? 200 : 400).json(result);
};

const getAllQuestionTemplatesController = async (req, res) => {
  const result = await questionTemplateService.getAllQuestionTemplates();
  res.status(result.status ? 200 : 400).json(result);
};

const updateQuestionTemplateController = async (req, res) => {
  const { templateID } = req.params;
  const result = await questionTemplateService.updateQuestionTemplate(
    templateID,
    req.body
  );
  res.status(result.status ? 200 : 400).json(result);
};

const deleteQuestionTemplateController = async (req, res) => {
  const { templateID } = req.params;
  const result = await questionTemplateService.deleteQuestionTemplate(
    templateID
  );
  res.status(result.status ? 200 : 400).json(result);
};

const getQuestionTemplateController = async (req, res) => {
  const { templateId } = req.params;
  const result = await questionTemplateService.getQuestionTemplateById(
    templateId
  );
  if (!result.status) {
    return res.status(404).json({ message: result.message });
  }
  res.json(result.template);
};

const searchQuestionTemplatesController = async (req, res) => {
  const { searchTerm } = req.query;
  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }
  const result = await questionTemplateService.searchQuestionTemplates(
    searchTerm
  );
  if (!result.status) {
    return res.status(404).json({ message: result.message });
  }
  res.json(result.templates);
};
module.exports = {
  createQuestionTemplateController,
  getAllQuestionTemplatesController,
  updateQuestionTemplateController,
  deleteQuestionTemplateController,
  getQuestionTemplateController,
  searchQuestionTemplatesController,
};
