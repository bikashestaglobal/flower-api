const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// registerCustomer
module.exports.registerCustomer = Joi.object({
  firstName: Joi.string().trim().required().min(2),
  lastName: Joi.string().trim(),
  email: Joi.string().email().trim().required(),
  mobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .required(),
  password: Joi.string().min(5).trim().required(),
  cPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

// verifyAccount
module.exports.verifyAccount = Joi.object({
  email: Joi.string().email().trim().required(),
  otp: Joi.string().min(4).required(),
});

// loginCustomer
module.exports.loginCustomer = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(5).trim().required(),
});

// getAllCustomers
module.exports.getAllCustomers = Joi.object({
  skip: Joi.string(),
  limit: Joi.string(),
  status: Joi.string().optional(),
  isDeleted: Joi.boolean().optional(),
  searchQuery: Joi.string(),
  isVerified: Joi.string(),
});

// getAllCustomers
module.exports.getCustomerById = Joi.object({
  id: Joi.custom(customCallback),
});

// generateReport
// module.exports.generateReport = Joi.object({
//   skip: Joi.string(),
//   limit: Joi.string(),
//   allCustomers: Joi.string(),
//   topCustomers: Joi.string(),
//   startDate: Joi.string(),
//   endDate: Joi.string(),
// });

// addAddress
module.exports.addAddress = Joi.object({
  name: Joi.string().trim().min(3).required(),
  mobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
      "any.required": `"Mobile" is a required field`,
    }),
  email: Joi.string().email().trim().allow(""),
  alternateMobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
      "any.required": `"Mobile" is a required field`,
    }),
  city: Joi.string().trim().required(),
  address: Joi.string().min(6).trim().required(),
  pincode: Joi.number().min(6).required(),
  landmark: Joi.string().allow(""),
  addressType: Joi.string().required(),
  defaultAddress: Joi.boolean(),
});

// updateProfile
module.exports.updateProfile = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  mobile: Joi.string().trim().min(10),
  email: Joi.string().email().trim(),
  password: Joi.string().min(6).trim(),
  oldPassword: Joi.string().min(6).trim(),
});

// findAccount
module.exports.findAccount = Joi.object({
  email: Joi.string().email().trim().required(),
});

// verifyOTP
module.exports.verifyOTP = Joi.object({
  email: Joi.string().email().trim().required(),
  otp: Joi.string().min(4).required(),
});

// createNewPassword
module.exports.createNewPassword = Joi.object({
  password: Joi.string().min(5).trim().required(),
  cPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
});

// updateCustomer
module.exports.updateCustomer = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  email: Joi.string().email().trim(),
  mobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
    }),
  status: Joi.boolean(),
  isVerified: Joi.boolean(),
});

/*
 *****************************
 ***********ADDRESS***********
 *****************************
 */

// addAddress
module.exports.addAddress = Joi.object({
  name: Joi.string().trim().min(3).required(),
  mobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
      "any.required": `"Mobile" is a required field`,
    }),
  email: Joi.string().email().trim().allow(""),
  alternateMobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
      "any.required": `"Mobile" is a required field`,
    }),
  city: Joi.string().trim().required(),
  address: Joi.string().min(6).trim().required(),
  pincode: Joi.number().min(6).required(),
  landmark: Joi.string().allow(""),
  addressType: Joi.string().required(),
  defaultAddress: Joi.boolean(),
});

module.exports.getAddressById = Joi.object({
  id: Joi.string().custom(customCallback),
});

// updateAddress
module.exports.updateAddress = Joi.object({
  name: Joi.string().trim().min(3),
  mobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
      "any.required": `"Mobile" is a required field`,
    }),
  email: Joi.string().email().trim().allow(""),
  alternateMobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
      "any.required": `"Mobile" is a required field`,
    }),
  city: Joi.string().trim(),
  address: Joi.string().min(6).trim(),
  pincode: Joi.number().min(6),
  landmark: Joi.string().allow(""),
  addressType: Joi.string(),
  defaultAddress: Joi.boolean(),
});

/*
 *****************************
 *********END ADDRESS*********
 *****************************
 */
