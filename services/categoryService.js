const categoryModel = require("../database/models/categoryModel");
const { formatMongoData } = require("../helpers/dbHelper");
const { categoryMessage } = require("../constants");

// createCategory
module.exports.createCategory = async (serviceData) => {
  try {
    // find first
    const category = await categoryModel.findOne({
      name: serviceData.name,
    });

    if (category) {
      throw new Error(categoryMessage.CATEGORY_ALREADY_EXIST);
    }

    const newData = new categoryModel(serviceData);
    const result = await newData.save();
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: categoryService: createCategory`,
      error.message
    );
    throw new Error(error);
  }
};

// getCategoryById
module.exports.getCategoryById = async (serviceData) => {
  try {
    const id = serviceData?.id;
    const result = await categoryModel.findOne({ _id: id });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: categoryService: getCategoryById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllCategories
module.exports.getAllCategories = async (serviceData) => {
  try {
    let conditions = {};
    const {
      limit = 10,
      skip = 0,
      searchQuery,
      status = true,
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { slug: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    const result = await categoryModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: categoryService: getAllCategories`,
      error.message
    );
    throw new Error(error);
  }
};

// updateCategory
module.exports.updateCategory = async (serviceData) => {
  try {
    const { id, body } = serviceData;
    const result = await categoryModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: categoryService: updateCategory`,
      error.message
    );
    throw new Error(error);
  }
};

// deleteCategory
module.exports.deleteCategory = async (serviceData) => {
  try {
    const { id } = serviceData;
    const result = await categoryModel.findByIdAndUpdate(id, {
      isDeleted: true,
      status: false,
    });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: categoryService: deleteCategory`,
      error.message
    );
    throw new Error(error);
  }
};
