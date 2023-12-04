const express = require('express');
const { companyUserController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

// Route to create a new company user
router.post('/', authMiddleware.tokenVerification, companyUserController.createCompanyUserController);

// You can add more routes here if needed
router.delete('/:companyUserId', authMiddleware.tokenVerification, companyUserController.deleteCompanyUserController);

router.get('/:companyUserId', authMiddleware.tokenVerification, companyUserController.getOneCompanyUserController);

// Route to get all company users
router.get('/', authMiddleware.tokenVerification, companyUserController.getAllCompanyUsersController);

module.exports = router;
