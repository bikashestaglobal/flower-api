const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const customerValidationSchema = require("../apiValidationSchemas/customerValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// registerCustomer
router.post(
  "/register",
  joiSchemaValidation.validateBody(customerValidationSchema.registerCustomer),
  customerController.registerCustomer
);

// verifyAccount
router.post(
  "/verifyAccount",
  joiSchemaValidation.validateBody(customerValidationSchema.verifyAccount),
  customerController.verifyAccount
);

// loginCustomer
router.post(
  "/login",
  joiSchemaValidation.validateBody(customerValidationSchema.loginCustomer),
  customerController.loginCustomer
);

// findAccount
router.post(
  "/findAccount",
  joiSchemaValidation.validateBody(customerValidationSchema.findAccount),
  customerController.findAccount
);

// verifyOTP
router.post(
  "/verifyOTP",
  joiSchemaValidation.validateBody(customerValidationSchema.verifyOTP),
  customerController.verifyOTP
);

// getProfile
router.get(
  "/profile",
  jwtValidation.validateCustomerToken,
  customerController.getProfile
);

// createNewPassword
router.put(
  "/createNewPassword",
  jwtValidation.validateCustomerToken,
  joiSchemaValidation.validateBody(customerValidationSchema.createNewPassword),
  customerController.createNewPassword
);

// updateProfile
router.put(
  "/profile",
  jwtValidation.validateCustomerToken,
  joiSchemaValidation.validateBody(customerValidationSchema.updateProfile),
  customerController.updateProfile
);

/*
 *****************************
 ***********ADDRESS***********
 *****************************
 */

// addAddress
router.post(
  "/address",
  jwtValidation.validateCustomerToken,
  joiSchemaValidation.validateBody(customerValidationSchema.addAddress),
  customerController.addAddress
);

// getAddressById
router.get(
  "/address",
  jwtValidation.validateCustomerToken,
  customerController.getAllAddress
);

// getAddressById
router.get(
  "/address/:id",
  joiSchemaValidation.validateParams(customerValidationSchema.getAddressById),
  jwtValidation.validateCustomerToken,
  customerController.getAddressById
);

// updateAddress
router.put(
  "/address/:id",
  joiSchemaValidation.validateBody(customerValidationSchema.updateAddress),
  jwtValidation.validateCustomerToken,
  customerController.updateAddress
);

// deleteAddress
router.delete(
  "/address/:id",
  joiSchemaValidation.validateParams(customerValidationSchema.getAddressById),
  jwtValidation.validateCustomerToken,
  customerController.deleteAddress
);

/*
 *****************************
 *********END ADDRESS*********
 *****************************
 */

// getCustomerById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(customerValidationSchema.getCustomerById),
  jwtValidation.validateAdminToken,
  customerController.getCustomerById
);

// getAllCustomers
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(customerValidationSchema.getAllCustomers),
  customerController.getAllCustomers
);

// updateCustomer
router.put(
  "/:id",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(customerValidationSchema.updateCustomer),
  customerController.updateCustomer
);

// deleteCustomer
router.delete(
  "/:id",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(customerValidationSchema.getCustomerById),
  customerController.deleteCustomer
);

module.exports = router;
