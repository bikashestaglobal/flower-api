const express = require("express");
const router = express.Router();
const supervisorController = require("../controllers/supervisorController");
const supervisorValidationSchema = require("../apiValidationSchemas/supervisorValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// createSupervisor
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(supervisorValidationSchema.createSupervisor),
  supervisorController.createSupervisor
);

// loginSupervisor
router.post(
  "/login",
  joiSchemaValidation.validateBody(supervisorValidationSchema.loginSupervisor),
  supervisorController.loginSupervisor
);

// findAccount
router.post(
  "/findAccount",
  joiSchemaValidation.validateBody(supervisorValidationSchema.findAccount),
  supervisorController.findAccount
);

// verifyOTP
router.post(
  "/verifyOTP",
  joiSchemaValidation.validateBody(supervisorValidationSchema.verifyOTP),
  supervisorController.verifyOTP
);

// getProfile
router.get(
  "/profile",
  jwtValidation.validateSupervisorToken,
  supervisorController.getProfile
);

// createNewPassword
router.put(
  "/createNewPassword",
  jwtValidation.validateSupervisorToken,
  joiSchemaValidation.validateBody(
    supervisorValidationSchema.createNewPassword
  ),
  supervisorController.createNewPassword
);

// updateProfile
router.put(
  "/profile",
  jwtValidation.validateSupervisorToken,
  joiSchemaValidation.validateBody(supervisorValidationSchema.updateProfile),
  supervisorController.updateProfile
);

// getSupervisorById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(
    supervisorValidationSchema.getSupervisorById
  ),
  jwtValidation.validateAdminToken,
  supervisorController.getSupervisorById
);

// getAllSupervisors
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(
    supervisorValidationSchema.getAllSupervisors
  ),
  supervisorController.getAllSupervisors
);

// updateSupervisor
router.put(
  "/:id",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(supervisorValidationSchema.updateSupervisor),
  supervisorController.updateSupervisor
);

// deleteSupervisor
router.delete(
  "/:id",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    supervisorValidationSchema.getSupervisorById
  ),
  supervisorController.deleteSupervisor
);
module.exports = router;
