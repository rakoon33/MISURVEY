const express = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares');
const router = express.Router();

router.get('/getUserData', 
    authMiddleware.tokenVerification, 
    userController.getUserDataController);

router
    .route('/profile')
    .get(authMiddleware.tokenVerification, userController.getUserProfileController)
    .put(authMiddleware.tokenVerification, userController.updateUserController);

router
    .route('/searchUsers')
    .get(authMiddleware.tokenVerification, userController.searchUserController);

router.route('/')
    .get(authMiddleware.tokenVerification, userController.getAllUsersController)
    .post(authMiddleware.tokenVerification, userController.createUserController);

router
    .route('/:UserID')
    .delete(authMiddleware.tokenVerification, userController.deleteUserController)
    .get(authMiddleware.tokenVerification,userController.getOneUserController)
    .put(authMiddleware.tokenVerification, userController.updateUserController);


module.exports = router;
