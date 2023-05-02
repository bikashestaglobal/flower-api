const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const subscriptionValidationSchema = require("../apiValidationSchemas/subscriptionValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");

const jwtValidation = require("../middlewares/jwtValidation");

// createSubscription
router.post(
  "/",
  jwtValidation.validateCustomerToken,
  joiSchemaValidation.validateBody(
    subscriptionValidationSchema.createSubscription
  ),
  subscriptionController.createSubscription
);

// getCustomersAllSubscriptions
router.get(
  "/",
  jwtValidation.validateCustomerToken,
  joiSchemaValidation.validateQuery(
    subscriptionValidationSchema.getCustomersAllSubscriptions
  ),
  subscriptionController.getCustomersAllSubscriptions
);

// cancelCustomerSubscription
router.put(
  "/cancel/:id",
  jwtValidation.validateCustomerToken,
  joiSchemaValidation.validateQuery(
    subscriptionValidationSchema.cancelCustomerSubscription
  ),
  subscriptionController.cancelCustomerSubscription
);

// renewalSubscription
router.post(
  "/renewal/:id",
  joiSchemaValidation.validateParams(
    subscriptionValidationSchema.getSubscriptionById
  ),
  jwtValidation.validateCustomerToken,
  joiSchemaValidation.validateBody(
    subscriptionValidationSchema.renewalSubscription
  ),
  subscriptionController.renewalSubscription
);

// getCustomersSubscriptionDetails
router.get(
  "/:id",
  jwtValidation.validateCustomerToken,
  joiSchemaValidation.validateQuery(
    subscriptionValidationSchema.getSubscriptionById
  ),
  subscriptionController.getCustomersSubscriptionDetails
);

module.exports = router;
