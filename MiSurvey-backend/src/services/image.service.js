const { v2: cloudinary } = require('cloudinary');
const { Survey, Company, User } = require("../models");
const { createLogActivity } = require("./userActivityLog.service");
const db = require("../config/database");

cloudinary.config({
  cloud_name: 'dum3tvemz',
  api_key: '861614929385347',
  api_secret: 'WxC4UsI_ZvrmiYcdIfNMIyuB_1E'
});

const uploadImage = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', public_id: fileName },
        (error, result) => {
          if (error) {
            reject(new Error('Failed to upload image to Cloudinary'));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  };

const saveSurveyImage = async (surveyId, file, udata) => {
  const transaction = await db.sequelize.transaction();
  try {
    const imageUrl = await uploadImage(file.buffer, file.originalname);
    console.log(imageUrl);
    await Survey.update({ SurveyImages: imageUrl }, { where: { SurveyID: surveyId }, transaction });
    await createLogActivity(udata.id, 'UPDATE', `Survey image updated for survey ID: ${surveyId}`, 'Surveys', udata.companyID, transaction);
    await transaction.commit();
    return { status: true, message: "Survey image uploaded successfully", imageUrl };
  } catch (error) {
    await transaction.rollback();
    return { status: false, message: error.message, error: error.toString() };
  }
};

const saveCompanyLogo = async (companyId, file, udata) => {
  const transaction = await db.sequelize.transaction();
  try {
    const imageUrl = await uploadImage(file.buffer, file.originalname);
    await Company.update({ CompanyLogo: imageUrl }, { where: { CompanyID: companyId }, transaction });
    await createLogActivity(udata.id, 'UPDATE', `Company logo updated for company ID: ${companyId}`, 'Companies', udata.companyID, transaction);
    await transaction.commit();
    return { status: true, message: "Company logo uploaded successfully", imageUrl };
  } catch (error) {
    await transaction.rollback();
    return { status: false, message: error.message, error: error.toString() };
  }
};

const saveUserAvatar = async (userId, file, udata) => {
  const transaction = await db.sequelize.transaction();
  try {
    const imageUrl = await uploadImage(file.buffer, file.originalname);
    await User.update({ UserAvatar: imageUrl }, { where: { UserID: userId }, transaction });
    await createLogActivity(udata.id, 'UPDATE', `User avatar updated for user ID: ${userId}`, 'Users', udata.companyID, transaction);
    await transaction.commit();
    return { status: true, message: "User avatar uploaded successfully", imageUrl };
  } catch (error) {
    await transaction.rollback();
    return { status: false, message: error.message, error: error.toString() };
  }
};

const updateSurveyImage = async (surveyId, file, udata) => {
    const transaction = await db.sequelize.transaction();
    try {
      const imageUrl = await uploadImage(file.buffer, file.originalname);
      await Survey.update({ SurveyImages: imageUrl }, { where: { SurveyID: surveyId }, transaction });
      await createLogActivity(udata.id, 'UPDATE', `Survey image updated for survey ID: ${surveyId}`, 'Surveys', udata.companyID, transaction);
      await transaction.commit();
      return { status: true, message: "Survey image updated successfully", imageUrl };
    } catch (error) {
      await transaction.rollback();
      return { status: false, message: error.message, error: error.toString() };
    }
  };
  
  const updateCompanyLogo = async (companyId, file, udata) => {
    const transaction = await db.sequelize.transaction();
    try {
      const imageUrl = await uploadImage(file.buffer, file.originalname);
      await Company.update({ CompanyLogo: imageUrl }, { where: { CompanyID: companyId }, transaction });
      await createLogActivity(udata.id, 'UPDATE', `Company logo updated for company ID: ${companyId}`, 'Companies', udata.companyID, transaction);
      await transaction.commit();
      return { status: true, message: "Company logo updated successfully", imageUrl };
    } catch (error) {
      await transaction.rollback();
      return { status: false, message: error.message, error: error.toString() };
    }
  };
  
  const updateUserAvatar = async (userId, file, udata) => {
    const transaction = await db.sequelize.transaction();
    try {
      const imageUrl = await uploadImage(file.buffer, file.originalname);
      await User.update({ UserAvatar: imageUrl }, { where: { UserID: userId }, transaction });
      await createLogActivity(udata.id, 'UPDATE', `User avatar updated for user ID: ${userId}`, 'Users', udata.companyID, transaction);
      await transaction.commit();
      return { status: true, message: "User avatar updated successfully", imageUrl };
    } catch (error) {
      await transaction.rollback();
      return { status: false, message: error.message, error: error.toString() };
    }
  };

const deleteSurveyImage = async (surveyId, udata) => {
    const transaction = await db.sequelize.transaction();
    try {
      await Survey.update({ SurveyImages: null }, { where: { SurveyID: surveyId }, transaction });
      await createLogActivity(udata.id, 'UPDATE', `Survey image deleted for survey ID: ${surveyId}`, 'Surveys', udata.companyID, transaction);
      await transaction.commit();
      return { status: true, message: "Survey image deleted successfully" };
    } catch (error) {
      await transaction.rollback();
      return { status: false, message: error.message, error: error.toString() };
    }
};
  
const deleteCompanyLogo = async (companyId, udata) => {
    const transaction = await db.sequelize.transaction();
    try {
      await Company.update({ CompanyLogo: null }, { where: { CompanyID: companyId }, transaction });
      await createLogActivity(udata.id, 'UPDATE', `Company logo deleted for company ID: ${companyId}`, 'Companies', udata.companyID, transaction);
      await transaction.commit();
      return { status: true, message: "Company logo deleted successfully" };
    } catch (error) {
      await transaction.rollback();
      return { status: false, message: error.message, error: error.toString() };
    }
};
  
const deleteUserAvatar = async (userId, udata) => {
    const transaction = await db.sequelize.transaction();
    try {
      await User.update({ UserAvatar: null }, { where: { UserID: userId }, transaction });
      await createLogActivity(udata.id, 'UPDATE', `User avatar deleted for user ID: ${userId}`, 'Users', udata.companyID, transaction);
      await transaction.commit();
      return { status: true, message: "User avatar deleted successfully" };
    } catch (error) {
      await transaction.rollback();
      return { status: false, message: error.message, error: error.toString() };
    }
};

module.exports = {
  saveSurveyImage,
  saveCompanyLogo,
  saveUserAvatar,
  deleteCompanyLogo,
  deleteSurveyImage,
  deleteUserAvatar,
  updateCompanyLogo,
  updateSurveyImage,
  updateUserAvatar
};
