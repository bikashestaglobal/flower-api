const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// createOccasion
module.exports.createOccasion = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  image: Joi.string().uri().allow(""),
  shortDescription: Joi.string().allow(""),
  seoTitle: Joi.string().allow(""),
  seoDescription: Joi.string().allow(""),
});

// getAllOccasions
module.exports.getAllOccasions = Joi.object({
  skip: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  status: Joi.string(),
});

// getOccasionById
module.exports.getOccasionById = Joi.object({
  id: Joi.custom(customCallback),
});

// updateOccasion
module.exports.updateOccasion = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  image: Joi.string().uri(),
  shortDescription: Joi.string().allow(""),
  seoTitle: Joi.string().allow(""),
  seoDescription: Joi.string().allow(""),
  status: Joi.boolean(),
});
