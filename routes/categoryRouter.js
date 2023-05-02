const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const categoryValidationSchema = require("../apiValidationSchemas/categoryValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// createCategory
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(categoryValidationSchema.createCategory),
  categoryController.createCategory
);

// getCategoryById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(categoryValidationSchema.getCategoryById),
  categoryController.getCategoryById
);

// getAllCategories
router.get(
  "/",
  joiSchemaValidation.validateParams(categoryValidationSchema.getAllCategories),
  categoryController.getAllCategories
);

// updateCategory
router.put(
  "/:id",
  joiSchemaValidation.validateParams(categoryValidationSchema.getCategoryById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(categoryValidationSchema.updateCategory),
  categoryController.updateCategory
);

// deleteCategory
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(categoryValidationSchema.getCategoryById),
  jwtValidation.validateAdminToken,
  categoryController.deleteCategory
);

module.exports = router;
