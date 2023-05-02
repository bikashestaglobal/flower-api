const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

/*
 ******************************
 ******** COMMON BLOCK ********
 ******************************
 */

// getDeliveryDetailsById
module.exports.getDeliveryDetailsById = Joi.object({
  id: Joi.custom(customCallback),
});

/*
 ##############################
 ########## END BLOCK #########
 ##############################
 */

/*
 ******************************
 ********CUSTOMER BLOCK********
 ******************************
 */

// createDeliveryDetailsByCustomer
module.exports.createDeliveryDetailsByCustomer = Joi.object({
  subscription: Joi.string().custom(customCallback).required(),
  deliveryBoy: Joi.string().custom(customCallback).required(),
  deliveryDate: Joi.date().required(),
  deliveryStatus: Joi.string()
    .valid("DELIVERED", "SKIPPED", "CANCELLED")
    .required(),
  deliveryNotes: Joi.string(),
});

// getAllDeliveryDetailsByCustomer
module.exports.getAllDeliveryDetailsByCustomer = Joi.object({
  subscriptionId: Joi.custom(customCallback),
  deliveryStatus: Joi.string().valid("DELIVERED", "SKIPPED", "CANCELLED"),
  skip: Joi.number(),
  limit: Joi.number(),
});

/*
 ******************************
 ******END CUSTOMER BLOCK******
 ******************************
 */

/*
 ******************************
 COMMON FOR ADMIN & SUPERVISOR
 ******************************
 */

// createDeliveryDetails
module.exports.createDeliveryDetails = Joi.object({
  customer: Joi.string().custom(customCallback).required(),
  subscription: Joi.string().custom(customCallback).required(),
  deliveryBoy: Joi.string().custom(customCallback).required(),
  deliveryDate: Joi.date().required(),
  createdBy: Joi.string().required(),
  deliveryStatus: Joi.string()
    .valid("DELIVERED", "SKIPPED", "CANCELLED")
    .required(),
  deliveryNotes: Joi.string(),
});

// getDeliveryDetailsById
module.exports.getDeliveryDetailsById = Joi.object({
  id: Joi.custom(customCallback),
});

// getAllDeliveryDetails
module.exports.getAllDeliveryDetails = Joi.object({
  id: Joi.custom(customCallback),
  subscriptionId: Joi.custom(customCallback),
  customerId: Joi.custom(customCallback),
  deliveryBoyId: Joi.custom(customCallback),
  deliveryStatus: Joi.string().valid("DELIVERED", "SKIPPED", "CANCELLED"),
  skip: Joi.number(),
  limit: Joi.number(),
});

/*
 ******************************
 ********** END BLOCK *********
 ******************************
 */

/*
 ##############################
 ########## END BLOCK #########
 ##############################
 */

/*
 ******************************
 *********ADMIN BLOCK**********
 ******************************
 */
