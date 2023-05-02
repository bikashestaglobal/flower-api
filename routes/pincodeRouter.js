const express = require("express");
const router = express.Router();
const pincodeController = require("../controllers/pincodeController");
const pincodeVlidationSchema = require("../apiValidationSchemas/pincodeVlidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// createPincode
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(pincodeVlidationSchema.createPincode),
  pincodeController.createPincode
);

// getAllNotAssignedPincodes
router.get(
  "/getAllNotAssigned",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(pincodeVlidationSchema.getAllPincode),
  pincodeController.getAllNotAssignedPincodes
);

// getPincodeById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(pincodeVlidationSchema.getPincodeById),
  pincodeController.getPincodeById
);

// getAllPincodes
router.get(
  "/",
  joiSchemaValidation.validateParams(pincodeVlidationSchema.getAllPincode),
  pincodeController.getAllPincodes
);

// updatePincode
router.put(
  "/:id",
  joiSchemaValidation.validateParams(pincodeVlidationSchema.getPincodeById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(pincodeVlidationSchema.updatePincode),
  pincodeController.updatePincode
);

// deletePincode
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(pincodeVlidationSchema.getPincodeById),
  jwtValidation.validateAdminToken,
  pincodeController.deletePincode
);

module.exports = router;
