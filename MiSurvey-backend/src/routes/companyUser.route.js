const express = require('express');
const { companyUserController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const router = express.Router();

router
    .route('/')
    .post(authMiddleware.tokenVerification, companyUserController.createCompanyUserController)
    .get(authMiddleware.tokenVerification, companyUserController.getAllCompanyUsersController);

router
    .route('/:companyUserId')
    .delete(authMiddleware.tokenVerification, companyUserController.deleteCompanyUserController)
    .get(authMiddleware.tokenVerification, companyUserController.getOneCompanyUserController);

module.exports = router;
