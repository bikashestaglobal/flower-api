const express = require("express");
const bucketRouter = express.Router();
const bucketController = require("../controllers/bucketController");
const bucketValidationSchema = require("../apiValidationSchemas/bucketValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// createBucket
bucketRouter.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(bucketValidationSchema.createBucket),
  bucketController.createBucket
);

// updateBucket
bucketRouter.put(
  "/:id",
  joiSchemaValidation.validateParams(bucketValidationSchema.getBucketById),
  joiSchemaValidation.validateBody(bucketValidationSchema.updateBucket),
  jwtValidation.validateAdminToken,
  bucketController.updateBucket
);

// deleteBucket
bucketRouter.delete(
  "/:id",
  joiSchemaValidation.validateParams(bucketValidationSchema.getBucketById),
  jwtValidation.validateAdminToken,
  bucketController.deleteBucket
);

// getAllBuckets
bucketRouter.get(
  "/",
  joiSchemaValidation.validateQuery(bucketValidationSchema.getAllBuckets),
  bucketController.getAllBuckets
);

// getBucketById
bucketRouter.get(
  "/:id",
  joiSchemaValidation.validateParams(bucketValidationSchema.getBucketById),
  bucketController.getBucketById
);

module.exports = bucketRouter;
