const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// createCoupon
module.exports.createCoupon = Joi.object({
  couponCode: Joi.string().required().trim(),
  applyFor: Joi.string()
    .required()
    .valid("NEW_USER", "EXISTING_USER", "ALL_USER"),
  discountType: Joi.string().required().valid("AMOUNT", "PERCENTAGE"),
  discount: Joi.number().required(),
  numberOfUsesTimes: Joi.number().required(),
  description: Joi.string().allow("").trim(),
  minimumAmount: Joi.number().required(),
  image: Joi.string().allow(""),
  startDate: Joi.date()
    .required()
    .less(
      Joi.ref("expiryDate", {
        adjust: (someField) => {
          return someField + 1;
        },
      })
    ),
  expiryDate: Joi.date().required(),
});

// getAllCoupons
module.exports.getAllCoupons = Joi.object({
  skip: Joi.string(),
  limit: Joi.string(),
  status: Joi.string(),
  searchQuery: Joi.string(),
  applyFor: Joi.string().valid("NEW_USER", "EXISTING_USER", "ALL_USER"),
  discountType: Joi.string().valid("AMOUNT", "PERCENTAGE"),
});

// getCouponById
module.exports.getCouponById = Joi.object({
  id: Joi.string().custom(customCallback),
});

// validateCoupon
module.exports.validateCoupon = Joi.object({
  couponCode: Joi.string().required().trim(),
});

// updateCoupon
module.exports.updateCoupon = Joi.object({
  couponCode: Joi.string().trim(),
  applyFor: Joi.string().valid("NEW_USER", "EXISTING_USER", "ALL_USER"),
  discountType: Joi.string().trim().valid("AMOUNT", "PERCENTAGE"),
  discount: Joi.number(),
  numberOfUsesTimes: Joi.number(),
  description: Joi.string().allow("").trim(),
  minimumAmount: Joi.number(),
  image: Joi.string().allow(""),
  startDate: Joi.date(),
  expiryDate: Joi.date(),
  status: Joi.boolean(),
});
