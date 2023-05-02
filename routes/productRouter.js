const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");
const productValidationSchema = require("../apiValidationSchemas/productValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");

const jwtValidation = require("../middlewares/jwtValidation");

// createProduct
productRouter.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(productValidationSchema.createProduct),
  productController.createProduct
);

// updateProduct
productRouter.put(
  "/:id",
  joiSchemaValidation.validateParams(productValidationSchema.getProductById),
  joiSchemaValidation.validateBody(productValidationSchema.updateProduct),
  jwtValidation.validateAdminToken,
  productController.updateProduct
);

// deleteProduct
productRouter.delete(
  "/:id",
  joiSchemaValidation.validateParams(productValidationSchema.deleteProduct),
  jwtValidation.validateAdminToken,
  productController.deleteProduct
);

// getAllProducts
productRouter.get(
  "/",
  joiSchemaValidation.validateQuery(productValidationSchema.getAllProducts),
  productController.getAllProducts
);

// getProductById
productRouter.get(
  "/:id",
  joiSchemaValidation.validateParams(productValidationSchema.getProductById),
  productController.getProductById
);

module.exports = productRouter;
