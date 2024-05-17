const imageService = require("../services/image.service");

const saveSurveyImageController = async (req, res) => {
  const { id: surveyId } = req.params;
  try {
    const result = await imageService.saveSurveyImage(surveyId, req.file, req.user);
    res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

const saveCompanyLogoController = async (req, res) => {
  const { id: companyId } = req.params;
  try {
    const result = await imageService.saveCompanyLogo(companyId, req.file, req.user);
    res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

const saveUserAvatarController = async (req, res) => {
  const { id: userId } = req.params;
  try {
    const result = await imageService.saveUserAvatar(userId, req.file, req.user);
    res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

const updateSurveyImageController = async (req, res) => {
    const { id: surveyId } = req.params;
    try {
      const result = await imageService.updateSurveyImage(surveyId, req.file, req.user);
      res.status(result.status ? 200 : 400).json(result);
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
  };
  
  const updateCompanyLogoController = async (req, res) => {
    const { id: companyId } = req.params;
    try {
      const result = await imageService.updateCompanyLogo(companyId, req.file, req.user);
      res.status(result.status ? 200 : 400).json(result);
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
  };
  
  const updateUserAvatarController = async (req, res) => {
    const { id: userId } = req.params;
    try {
      const result = await imageService.updateUserAvatar(userId, req.file, req.user);
      res.status(result.status ? 200 : 400).json(result);
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
  };

const deleteSurveyImageController = async (req, res) => {
    const { id: surveyId } = req.params;
    try {
      const result = await imageService.deleteSurveyImage(surveyId, req.user);
      res.status(result.status ? 200 : 400).json(result);
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
  };
  
  const deleteCompanyLogoController = async (req, res) => {
    const { id: companyId } = req.params;
    try {
      const result = await imageService.deleteCompanyLogo(companyId, req.user);
      res.status(result.status ? 200 : 400).json(result);
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
  };
  
  const deleteUserAvatarController = async (req, res) => {
    const { id: userId } = req.params;
    try {
      const result = await imageService.deleteUserAvatar(userId, req.user);
      res.status(result.status ? 200 : 400).json(result);
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
  };

module.exports = {
  saveSurveyImageController,
  saveCompanyLogoController,
  saveUserAvatarController,
  deleteCompanyLogoController,
  deleteSurveyImageController,
  deleteUserAvatarController,
  updateCompanyLogoController,
  updateSurveyImageController,
  updateUserAvatarController
};
