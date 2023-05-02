const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// createBucket
module.exports.createBucket = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  category: Joi.string().custom(customCallback).required(),
  occasion: Joi.string().custom(customCallback).required(),
  image: Joi.string().uri(),
  shortDescription: Joi.string().allow(""),
  seoTitle: Joi.string().allow(""),
  seoDescription: Joi.string().allow(""),
  seoTags: Joi.string().allow(""),
  monday: Joi.array().items(Joi.string().custom(customCallback).required()),
  tuesday: Joi.array().items(Joi.string().custom(customCallback)),
  wednesday: Joi.array().items(Joi.string().custom(customCallback)),
  thursday: Joi.array().items(Joi.custom(customCallback)),
  friday: Joi.array().items(Joi.custom(customCallback)),
  saturday: Joi.array().items(Joi.custom(customCallback)),
  sunday: Joi.array().items(Joi.custom(customCallback)),
  sellingPrice: Joi.number().required(),
  mrp: Joi.number().required(),
  validity: Joi.number().required(),
});

// getAllBuckets
module.exports.getAllBuckets = Joi.object({
  skip: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  status: Joi.string(),
});

// getBucketById
module.exports.getBucketById = Joi.object({
  id: Joi.custom(customCallback),
});

// updateBucket
module.exports.updateBucket = Joi.object({
  name: Joi.string(),
  slug: Joi.string(),
  category: Joi.string().custom(customCallback),
  occasion: Joi.string().custom(customCallback),
  image: Joi.string().uri(),
  shortDescription: Joi.string().allow(""),
  seoTitle: Joi.string().allow(""),
  seoDescription: Joi.string().allow(""),
  seoTags: Joi.string().allow(""),
  monday: Joi.array().items(Joi.custom(customCallback)),
  tuesday: Joi.array().items(Joi.custom(customCallback)),
  wednesday: Joi.array().items(Joi.custom(customCallback)),
  thursday: Joi.array().items(Joi.custom(customCallback)),
  friday: Joi.array().items(Joi.custom(customCallback)),
  saturday: Joi.array().items(Joi.custom(customCallback)),
  sunday: Joi.array().items(Joi.custom(customCallback)),
  sellingPrice: Joi.number(),
  mrp: Joi.number(),
  validity: Joi.number(),
  status: Joi.string().trim(),
});
