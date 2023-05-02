const express = require("express");
const router = express.Router();
const deliveryBoyController = require("../controllers/deliveryBoyController");
const deliveryBoyValidationSchema = require("../apiValidationSchemas/deliveryBoyValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// createDeliveryBoy
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    deliveryBoyValidationSchema.createDeliveryBoy
  ),
  deliveryBoyController.createDeliveryBoy
);

// loginDeliveryBoy
router.post(
  "/login",
  joiSchemaValidation.validateBody(
    deliveryBoyValidationSchema.loginDeliveryBoy
  ),
  deliveryBoyController.loginDeliveryBoy
);

// findAccount
router.post(
  "/findAccount",
  joiSchemaValidation.validateBody(deliveryBoyValidationSchema.findAccount),
  deliveryBoyController.findAccount
);

// verifyOTP
router.post(
  "/verifyOTP",
  joiSchemaValidation.validateBody(deliveryBoyValidationSchema.verifyOTP),
  deliveryBoyController.verifyOTP
);

// getProfile
router.get(
  "/profile",
  jwtValidation.validateDeliveryBoyToken,
  deliveryBoyController.getProfile
);

// createNewPassword
router.put(
  "/createNewPassword",
  jwtValidation.validateDeliveryBoyToken,
  joiSchemaValidation.validateBody(
    deliveryBoyValidationSchema.createNewPassword
  ),
  deliveryBoyController.createNewPassword
);

// updateProfile
router.put(
  "/profile",
  jwtValidation.validateDeliveryBoyToken,
  joiSchemaValidation.validateBody(deliveryBoyValidationSchema.updateProfile),
  deliveryBoyController.updateProfile
);

// getAllNotAssignedDeliveryBoys
router.get(
  "/getAllNotAssigned",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(
    deliveryBoyValidationSchema.getAllDeliveryBoys
  ),
  deliveryBoyController.getAllNotAssignedDeliveryBoys
);

// getDeliveryBoyById
router.get(
  "/:id",

  joiSchemaValidation.validateParams(
    deliveryBoyValidationSchema.getDeliveryBoyById
  ),
  jwtValidation.validateAdminToken,
  deliveryBoyController.getDeliveryBoyById
);

// assignPincodes
router.put(
  "/assignPincodes/:id",
  jwtValidation.validateSupervisorToken,
  joiSchemaValidation.validateBody(deliveryBoyValidationSchema.assignPincodes),
  deliveryBoyController.assignPincodes
);

// getAllDeliveryBoys
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(
    deliveryBoyValidationSchema.getAllDeliveryBoys
  ),
  deliveryBoyController.getAllDeliveryBoys
);

// updateDeliveryBoy
router.put(
  "/:id",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    deliveryBoyValidationSchema.updateDeliveryBoy
  ),
  deliveryBoyController.updateDeliveryBoy
);

module.exports = router;
