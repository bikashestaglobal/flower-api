const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const subscriptionValidationSchema = require("../apiValidationSchemas/subscriptionValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");

const jwtValidation = require("../middlewares/jwtValidation");

// updateSubscriptionByAdmin
router.put(
  "/:id",
  joiSchemaValidation.validateParams(
    subscriptionValidationSchema.getSubscriptionById
  ),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    subscriptionValidationSchema.updateSubscriptionByAdmin
  ),
  subscriptionController.updateSubscriptionByAdmin
);

// getAllSubscriptions
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(
    subscriptionValidationSchema.getAllSubscriptions
  ),
  subscriptionController.getAllSubscriptions
);

// getSubscriptionById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(
    subscriptionValidationSchema.getSubscriptionById
  ),
  jwtValidation.validateAdminToken,
  subscriptionController.getSubscriptionById
);

// deleteSubscription
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(
    subscriptionValidationSchema.deleteSubscription
  ),
  jwtValidation.validateAdminToken,
  subscriptionController.deleteSubscription
);

module.exports = router;
