const express = require("express");
const router = express.Router();
const deliveryDetailsController = require("../controllers/deliveryDetailsController");
const deliveryDetailsValidationSchema = require("../apiValidationSchemas/deliveryDetailsValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");

const jwtValidation = require("../middlewares/jwtValidation");

// createDeliveryDetailsByCustomer
router.post(
  "/",
  jwtValidation.validateCustomerToken,
  joiSchemaValidation.validateBody(
    deliveryDetailsValidationSchema.createDeliveryDetailsByCustomer
  ),
  deliveryDetailsController.createDeliveryDetailsByCustomer
);

// getAllDeliveryDetailsByCustomer
router.get(
  "/",
  jwtValidation.validateCustomerToken,
  joiSchemaValidation.validateQuery(
    deliveryDetailsValidationSchema.getAllDeliveryDetailsByCustomer
  ),
  deliveryDetailsController.getAllDeliveryDetailsByCustomer
);

// getDeliveryDetailsByIdByCustomer
router.get(
  "/:id",
  joiSchemaValidation.validateParams(
    deliveryDetailsValidationSchema.getDeliveryDetailsById
  ),
  jwtValidation.validateCustomerToken,
  deliveryDetailsController.getDeliveryDetailsByIdByCustomer
);

module.exports = router;
