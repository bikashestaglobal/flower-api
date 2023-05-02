const occasionModel = require("../database/models/occasionModel");
const { formatMongoData } = require("../helpers/dbHelper");
const { occasionMessage } = require("../constants");

// createOccasion
module.exports.createOccasion = async (serviceData) => {
  try {
    // find first
    const occasion = await occasionModel.findOne({
      $or: [
        {
          name: serviceData.name,
        },
        {
          slug: serviceData.slug,
        },
      ],
    });

    if (occasion) {
      throw new Error(occasionMessage.OCCASION_ALREADY_EXIST);
    }

    const newData = new occasionModel(serviceData);
    const result = await newData.save();
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: occasionService: createOccasion`,
      error.message
    );
    throw new Error(error);
  }
};

// getOccasionById
module.exports.getOccasionById = async (serviceData) => {
  try {
    const id = serviceData?.id;
    const result = await occasionModel.findOne({ _id: id });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: occasionService: getOccasionById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllOccasions
module.exports.getAllOccasions = async (serviceData) => {
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
    const result = await occasionModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: occasionService: getAllOccasions`,
      error.message
    );
    throw new Error(error);
  }
};

// updateOccasion
module.exports.updateOccasion = async (serviceData) => {
  try {
    const { id, body } = serviceData;
    const result = await occasionModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: occasionService: updateOccasion`,
      error.message
    );
    throw new Error(error);
  }
};

// deleteOccasion
module.exports.deleteOccasion = async (serviceData) => {
  try {
    const { id } = serviceData;
    const result = await occasionModel.findByIdAndUpdate(id, {
      isDeleted: true,
      status: false,
    });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: occasionService: deleteOccasion`,
      error.message
    );
    throw new Error(error);
  }
};
