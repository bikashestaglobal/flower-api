const productModel = require("../database/models/productModel");
const categoryModel = require("../database/models/categoryModel");
const occasionModel = require("../database/models/occasionModel");
const constants = require("../constants");
const dbHelpers = require("../helpers/dbHelper");
const mongoose = require("mongoose");

// createProduct
module.exports.createProduct = async (serviceData) => {
  try {
    const product = new productModel(serviceData);
    const result = await product.save();
    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.productMessage.PRODUCT_NOT_CREATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: productService:  createProduct`,
      error.message
    );
    throw new Error(error);
  }
};

// getProductById
module.exports.getProductById = async (serviceData) => {
  try {
    const result = await productModel
      .findOne({ _id: serviceData.id })
      .populate({ path: "category", select: "name" })
      .populate({ path: "occasion", select: "name" });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.productMessage.PRODUCT_NOT_FETCHED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: productService: getProductById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllProducts
module.exports.getAllProducts = async ({
  limit = 10,
  skip = 0,
  searchQuery,
  slug,
  category,
  occasion,
  status = true,
}) => {
  let condition = {};

  // Search query is available
  if (searchQuery) {
    condition = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { slug: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }

  if (status == "All") {
    delete condition.status;
  } else {
    condition.status = status;
  }

  // If slug is available
  if (slug) {
    condition.slug = slug;
  }

  // If category is available
  if (category) {
    condition.category = category;
  }

  // If occasion is available
  if (occasion) {
    condition.occasion = occasion;
  }

  try {
    const result = await productModel
      .find(condition)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate({ path: "category", select: "name" })
      .populate({ path: "occasion", select: "name" })
      .sort({ createdAt: -1 });

    if (result) {
      if (result.length) {
        let formatedData = dbHelpers.formatMongoData(result);
        return formatedData;
      }

      throw new Error(constants.productMessage.PRODUCT_NOT_FOUND);
    } else {
      throw new Error(constants.productMessage.PRODUCT_NOT_FETCHED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: productService: getAllProducts`,
      error.message
    );
    throw new Error(error);
  }
};

// // updateProduct
module.exports.updateProduct = async (serviceData) => {
  try {
    const { id, body } = serviceData;
    const result = await productModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.productMessage.PRODUCT_NOT_UPDATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: productService:  updateProduct`,
      error.message
    );
    throw new Error(error);
  }
};

// // updateStock
// module.exports.updateStock = async ({ id, data }) => {
//   try {
//     // Check id is valid or not
//     if (!dbHelpers.checkMongoObject(id)) {
//       throw new Error(constants.databaseMessage.INVALID_OBJECTID);
//     }

//     const result = await productModel.findByIdAndUpdate(id, data, {
//       new: true,
//     });
//     if (result) {
//       return dbHelpers.formatMongoData(result);
//     } else {
//       throw new Error(constants.productMessage.PRODUCT_NOT_FOUND);
//     }
//   } catch (error) {
//     console.log(
//       `Somthing Went Wrong Service: productService:  updateStock`,
//       error.message
//     );
//     throw new Error(error);
//   }
// };

// deleteProduct

module.exports.deleteProduct = async ({ id }) => {
  try {
    const result = await productModel.findOneAndDelete({ _id: id });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.productMessage.PRODUCT_NOT_DELETED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: productService: deleteProduct`,
      error.message
    );
    throw new Error(error);
  }
};
