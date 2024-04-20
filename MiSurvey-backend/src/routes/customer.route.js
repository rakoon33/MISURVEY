const express = require("express");
const { customerController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const router = express.Router();

router
  .route("/searchCustomers")
  .get(
    authMiddleware.tokenVerification,
    customerController.searchCustomersController
  );

router
  .route("/")
  .get(
    authMiddleware.tokenVerification,
    customerController.getAllCustomersController
  )
  .post(
    authMiddleware.tokenVerification,
    customerController.createCustomerController
  );

router
  .route("/:CustomerID")
  .delete(
    authMiddleware.tokenVerification,
    customerController.deleteCustomerController
  )
  .get(
    authMiddleware.tokenVerification,
    customerController.getOneCustomerController
  )
  .put(
    authMiddleware.tokenVerification,
    customerController.updateCustomerController
  );

module.exports = router;