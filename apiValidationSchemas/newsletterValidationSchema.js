const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// createNewsletter
module.exports.createNewsletter = Joi.object({
  email: Joi.string().email().required(),
});

// getAllNewsletters
module.exports.getAllNewsletters = Joi.object({
  skip: Joi.number().optional(),
  limit: Joi.number().optional(),
  status: Joi.string().optional(),
  searchQuery: Joi.string().optional(),
});

// getNewsletterById
module.exports.getNewsletterById = Joi.object({
  id: Joi.string().custom(customCallback),
});

// updateNewsletter
module.exports.updateNewsletter = Joi.object({
  email: Joi.string().optional(),
  status: Joi.boolean().optional(),
});

// deleteNewsletter
module.exports.deleteNewsletter = Joi.object({
  id: Joi.string().custom(customCallback),
});
