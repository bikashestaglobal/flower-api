const express = require("express");
const router = express.Router();
const occasionController = require("../controllers/occasionController");
const occasionValidationSchema = require("../apiValidationSchemas/occasionValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// createOccasion
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(occasionValidationSchema.createOccasion),
  occasionController.createOccasion
);

// getOccasionById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(occasionValidationSchema.getOccasionById),
  occasionController.getOccasionById
);

// getAllOccasions
router.get(
  "/",
  joiSchemaValidation.validateParams(occasionValidationSchema.getAllOccasions),
  occasionController.getAllOccasions
);

// updateOccasion
router.put(
  "/:id",
  joiSchemaValidation.validateParams(occasionValidationSchema.getOccasionById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(occasionValidationSchema.updateOccasion),
  occasionController.updateOccasion
);

// deleteOccasion
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(occasionValidationSchema.getOccasionById),
  jwtValidation.validateAdminToken,
  occasionController.deleteOccasion
);

module.exports = router;
