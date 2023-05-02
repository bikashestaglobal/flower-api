const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// createPincode
module.exports.createPincode = Joi.object({
  pincode: Joi.number().required().min(6),
  state: Joi.string().required().trim().allow(""),
  city: Joi.string().required().trim().allow(""),
});

// getAllPincode
module.exports.getAllPincode = Joi.object({
  skip: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  status: Joi.string(),
});

module.exports.getPincodeById = Joi.object({
  id: Joi.custom(customCallback),
});

// updatePincode
module.exports.updatePincode = Joi.object({
  pincode: Joi.number().min(6),
  state: Joi.string().trim(),
  city: Joi.string().trim(),
  status: Joi.boolean(),
  isDeleted: Joi.boolean(),
});
