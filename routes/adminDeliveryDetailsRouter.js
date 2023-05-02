const express = require("express");
const router = express.Router();
const deliveryDetailsController = require("../controllers/deliveryDetailsController");
const deliveryDetailsValidationSchema = require("../apiValidationSchemas/deliveryDetailsValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");

const jwtValidation = require("../middlewares/jwtValidation");

// createDeliveryDetails
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    deliveryDetailsValidationSchema.createDeliveryDetails
  ),
  deliveryDetailsController.createDeliveryDetails
);

// getAllDeliveryDetails
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(
    deliveryDetailsValidationSchema.getAllDeliveryDetails
  ),
  deliveryDetailsController.getAllDeliveryDetails
);

// getDeliveryDetailsById
router.get(
  "/:id",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(
    deliveryDetailsValidationSchema.getDeliveryDetailsById
  ),
  deliveryDetailsController.getDeliveryDetailsById
);

module.exports = router;
