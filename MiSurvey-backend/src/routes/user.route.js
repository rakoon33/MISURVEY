const express = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares');
const router = express.Router();


router
    .route('/profile')
    .get(authMiddleware.tokenVerification, userController.getUserProfileController)
    .put(authMiddleware.tokenVerification, userController.updateUserController);

router
    .route('/searchUsers')
    .get(authMiddleware.tokenVerification, userController.searchUserController);

router.route('/')
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, userController.getAllUsersController)
    .post(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, userController.createUserController);

router
    .route('/:UserId')
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, userController.deleteUserController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, userController.getOneUserController)
    .put(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, userController.updateUserController);


module.exports = router;
