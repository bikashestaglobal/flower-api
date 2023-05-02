const bucketModel = require("../database/models/bucketModel");
const constants = require("../constants");
const dbHelpers = require("../helpers/dbHelper");

// createBucket
module.exports.createBucket = async (serviceData) => {
  try {
    const product = new bucketModel(serviceData);
    const result = await product.save();
    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.bucketMessage.BUCKET_NOT_CREATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: bucketService:  createBucket`,
      error.message
    );
    throw new Error(error);
  }
};

// getBucketById
module.exports.getBucketById = async (serviceData) => {
  try {
    const result = await bucketModel
      .findOne({ _id: serviceData.id })
      .populate({ path: "category", select: "name createdAt updatedAt" })
      .populate({ path: "occasion", select: "name createdAt updatedAt" });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.bucketMessage.BUCKET_NOT_FETCHED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: bucketService: getBucketById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllBuckets
module.exports.getAllBuckets = async ({
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
    const result = await bucketModel
      .find(condition)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate({ path: "category", select: "name createdAt updatedAt" })
      .populate({ path: "occasion", select: "name createdAt updatedAt" })
      .sort({ createdAt: -1 });

    if (result) {
      if (result.length) {
        let formatedData = dbHelpers.formatMongoData(result);
        return formatedData;
      }

      throw new Error(constants.bucketMessage.BUCKET_NOT_FOUND);
    } else {
      throw new Error(constants.bucketMessage.BUCKET_NOT_FETCHED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: bucketService: getAllBuckets`,
      error.message
    );
    throw new Error(error);
  }
};

// updateBucket
module.exports.updateBucket = async (serviceData) => {
  try {
    const { id, body } = serviceData;
    const result = await bucketModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.bucketMessage.BUCKET_NOT_UPDATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: bucketService:  updateBucket`,
      error.message
    );
    throw new Error(error);
  }
};

// deleteBucket
module.exports.deleteBucket = async ({ id }) => {
  try {
    const result = await bucketModel.findOneAndDelete({ _id: id });
    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.bucketMessage.BUCKET_NOT_DELETED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: bucketService: deleteBucket`,
      error.message
    );
    throw new Error(error);
  }
};
