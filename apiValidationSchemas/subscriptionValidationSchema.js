const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

/*
 ******************************
 ********CUSTOMER BLOCK********
 ******************************
 */

// createSubscription
module.exports.createSubscription = Joi.object({
  shippingAddress: Joi.object({
    name: Joi.string().required(),
    mobile: Joi.string()
      .regex(/^[6-9]\d{9}$/)
      .required(),
    email: Joi.string().email(),
    alternateMobile: Joi.string().regex(/^[6-9]\d{9}$/),
    city: Joi.string().required(),
    address: Joi.string().required(),
    pincode: Joi.number().required(),
    landmark: Joi.string().allow(""),
    additionalInfo: Joi.string().allow(""),
  }).required(),
  // need improve validation
  bucketDetails: Joi.object({
    bucket: Joi.string().custom(customCallback),
    name: Joi.string().required(),
    slug: Joi.string().required(),
    image: Joi.string().optional(),
    monday: Joi.array().items(Joi.string().custom(customCallback)),
    tuesday: Joi.array().items(Joi.string().custom(customCallback)),
    wednesday: Joi.array().items(Joi.string().custom(customCallback)),
    thursday: Joi.array().items(Joi.string().custom(customCallback)),
    friday: Joi.array().items(Joi.string().custom(customCallback)),
    saturday: Joi.array().items(Joi.string().custom(customCallback)),
    sunday: Joi.array().items(Joi.string().custom(customCallback)),
  }),

  // need imrove validation
  coupon: Joi.object(),
  discountWithCoupon: Joi.number(),

  // need imrove validation
  specialDiscount: Joi.object(),
  specialDiscountAmount: Joi.number(),

  deliveryAmount: Joi.number(),
  subtotalAmount: Joi.number().required(),
  totalAmount: Joi.number().required(),
  totalAmount: Joi.number().required(),

  paymentMethod: Joi.string().required(),
  paymentId: Joi.string().allow(""),
  razorpayPaymentId: Joi.string().allow(""),
  razorpayOrderId: Joi.string().allow(""),

  subscriptionStartDate: Joi.date().required().label("Subscription Start Date"),
  subscriptionExpiryDate: Joi.date().required().label("Subscription End Date"),

  paymentId: Joi.string().allow(""),
});

// renewalSubscription
module.exports.renewalSubscription = Joi.object({
  // need improve validation
  coupon: Joi.object(),
  discountWithCoupon: Joi.number(),

  // need imrove validation
  specialDiscount: Joi.object(),
  specialDiscountAmount: Joi.number(),

  deliveryAmount: Joi.number(),
  subtotalAmount: Joi.number().required(),
  totalAmount: Joi.number().required(),

  paymentMethod: Joi.string().required(),
  paymentId: Joi.string().allow(""),
  razorpayPaymentId: Joi.string().allow(""),
  razorpayOrderId: Joi.string().allow(""),

  subscriptionStartDate: Joi.date().required().label("Subscription Start Date"),
  subscriptionExpiryDate: Joi.date().required().label("Subscription End Date"),

  paymentId: Joi.string().allow(""),
});

// getCustomersAllSubscriptions
module.exports.getCustomersAllSubscriptions = Joi.object({
  skip: Joi.number(),
  limit: Joi.number(),
  subscriptionStatus: Joi.string().valid(
    "All",
    "ORDERPLACED",
    "CONFIRMED",
    "RUNNING",
    "EXPIRED",
    "CANCELLED"
  ),
});

// cancelCustomerSubscription
module.exports.cancelCustomerSubscription = Joi.object({
  cancelMessage: Joi.string(),
});

/*
 ******************************
 *****END CUSTOMER BLOCK*******
 ******************************
 */

/*
 ******************************
 **********ADMIN BLOCK*********
 ******************************
 */

// updateSubscriptionByAdmin
module.exports.updateSubscriptionByAdmin = Joi.object({
  cancelledBy: Joi.string(),
  cancelMessage: Joi.string(),
  subscriptionStatus: Joi.string(),
  subscriptionExtendDate: Joi.date(),
  subscriptionExpiryDate: Joi.date(),
});

// getSubscriptionById
module.exports.getSubscriptionById = Joi.object({
  id: Joi.string().custom(customCallback),
});

// getAllSubscriptions
module.exports.getAllSubscriptions = Joi.object({
  skip: Joi.number(),
  limit: Joi.number(),
  subscriptionStatus: Joi.string().valid(
    "All",
    "ORDERPLACED",
    "CONFIRMED",
    "RUNNING",
    "EXPIRED",
    "CANCELLED"
  ),
  pincode: Joi.number(),
  searchQuery: Joi.string(),
  customerId: Joi.string().custom(customCallback),
});

// deleteSubscription
module.exports.deleteSubscription = Joi.object({
  id: Joi.string().custom(customCallback),
});

/*
 ******************************
 *******END ADMIN BLOCK********
 ******************************
 */

//============ Online Payment ====================//
// createRazorpayOrder
module.exports.createRazorpayOrder = Joi.object({
  amount: Joi.string().required(),
  paymentId: Joi.string().required(),
});

// verifyRazorpayPayment
module.exports.verifyRazorpayPayment = Joi.object({
  razorpayPaymentId: Joi.string().allow("").trim(),
  razorpaySignature: Joi.string().allow("").trim(),
  razorpayOrderId: Joi.string().allow("").trim(),
});
