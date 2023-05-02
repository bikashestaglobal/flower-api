const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// createCategory
module.exports.createCategory = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  image: Joi.string().uri().allow(""),
  shortDescription: Joi.string().allow(""),
  seoTitle: Joi.string().allow(""),
  seoDescription: Joi.string().allow(""),
});

// getAllCategories
module.exports.getAllCategories = Joi.object({
  skip: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  status: Joi.string(),
});

// getCategoryById
module.exports.getCategoryById = Joi.object({
  id: Joi.custom(customCallback),
});

// updateCategory
module.exports.updateCategory = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  image: Joi.string().uri(),
  shortDescription: Joi.string().allow(""),
  seoTitle: Joi.string().allow(""),
  seoDescription: Joi.string().allow(""),
  status: Joi.boolean(),
});
