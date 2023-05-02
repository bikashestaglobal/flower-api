const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// createProduct
module.exports.createProduct = Joi.object({
  name: Joi.string().required().trim(),
  slug: Joi.string().required().trim(),
  mrp: Joi.number().required(),
  sellingPrice: Joi.number().required(),
  sku: Joi.string().optional().trim().allow(""),
  maximumOrderQuantity: Joi.number(),
  defaultImage: Joi.string().required(),
  images: Joi.array(),
  shortDescription: Joi.string().optional().trim().allow(""),
  description: Joi.string().optional().trim().allow(""),
  category: Joi.string().custom(customCallback).required(),
  occasion: Joi.string().custom(customCallback).required(),
  tagLine: Joi.string().valid("HOT", "SALE", "BESTSELLER"),

  seoTitle: Joi.string().optional().trim().allow(""),
  seoDescription: Joi.string().optional().trim().allow(""),
  seoTags: Joi.string().optional().trim().allow(""),
});

// getAllProducts
module.exports.getAllProducts = Joi.object({
  skip: Joi.string(),
  limit: Joi.string(),
  slug: Joi.string(),
  category: Joi.string(),
  occasion: Joi.string(),
  minPrice: Joi.string(),
  maxPrice: Joi.string(),
  searchQuery: Joi.string(),
  status: Joi.string(),
});

// getAllProduct
module.exports.getProductById = Joi.object({
  id: Joi.string().custom(customCallback),
});

// filterProduct
// module.exports.filterProduct = Joi.object({
//   colors: Joi.array(),
//   materials: Joi.array(),
//   sizes: Joi.array(),
//   skip: Joi.number(),
//   limit: Joi.number(),
//   parCatId: Joi.string(),
//   subCatId: Joi.string(),
//   childCatId: Joi.string(),

//   minPrice: Joi.string(),
//   maxPrice: Joi.string(),

//   parCatSlug: Joi.string(),
//   subCatSlug: Joi.string(),
//   childCatSlug: Joi.string(),
//   status: Joi.string(),
// });

// getProductBySlug
// module.exports.getProductBySlug = Joi.object({
//   slug: Joi.string(),
// });

// updateProduct
module.exports.updateProduct = Joi.object({
  name: Joi.string().trim(),
  slug: Joi.string().trim(),
  mrp: Joi.number(),
  sellingPrice: Joi.number(),
  sku: Joi.string().trim().allow(""),
  maximumOrderQuantity: Joi.number(),

  defaultImage: Joi.string(),
  images: Joi.array(),
  shortDescription: Joi.string().trim().allow(""),
  description: Joi.string().trim().allow(""),
  category: Joi.string().custom(customCallback),
  occasion: Joi.string().custom(customCallback),
  tagLine: Joi.string().valid("HOT", "SALE", "BESTSELLER"),

  seoTitle: Joi.string().trim().allow(""),
  seoDescription: Joi.string().trim().allow(""),
  seoTags: Joi.string().trim().allow(""),
  status: Joi.boolean(),
});

// deleteProduct
module.exports.deleteProduct = Joi.object({
  id: Joi.string().custom(customCallback),
});
