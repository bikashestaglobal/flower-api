const pincodeModel = require("../database/models/pincodeModel");
const supervisorModel = require("../database/models/supervisorModel");
const { formatMongoData } = require("../helpers/dbHelper");
const { pincodeMessage } = require("../constants");
const dbHelper = require("../helpers/dbHelper");
// createPincode
module.exports.createPincode = async (serviceData) => {
  try {
    // find first
    const pincode = await pincodeModel.findOne({
      pincode: serviceData.pincode,
    });

    if (pincode) {
      throw new Error(pincodeMessage.PINCODE_ALREADY_EXIST);
    }

    const newData = new pincodeModel(serviceData);
    const result = await newData.save();
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: pincodeService: createPincode`,
      error.message
    );
    throw new Error(error);
  }
};

// getPincodeById
module.exports.getPincodeById = async (serviceData) => {
  try {
    const id = serviceData?.id;
    const result = await pincodeModel.findOne({ _id: id });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: pincodeService: getPincodeById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllPincodes
module.exports.getAllPincodes = async (serviceData) => {
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
          { pincode: { $regex: searchQuery, $options: "i" } },
          { city: { $regex: searchQuery, $options: "i" } },
          { state: { $regex: searchQuery, $options: "i" } },
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

    const result = await pincodeModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: pincodeService: getAllPincodes`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllNotAssignedPincodes
module.exports.getAllNotAssignedPincodes = async (serviceData) => {
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
          { state: { $regex: searchQuery, $options: "i" } },
          { city: { $regex: searchQuery, $options: "i" } },
          { pincode: { $regex: searchQuery, $options: "i" } },
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

    console.log(skip, limit);

    const result = await pincodeModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const allNotAssignedPincodes = [];
    for (let i = 0; i < result.length; i++) {
      const assignedPincode = await supervisorModel.findOne({
        pincodes: {
          $in: result[i]._id,
        },
      });

      if (!assignedPincode) allNotAssignedPincodes.push(result[i]);
    }

    return dbHelper.formatMongoData(allNotAssignedPincodes);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: pincodeService: getAllNotAssignedPincodes`,
      error.message
    );
    throw new Error(error);
  }
};

// updatePincode
module.exports.updatePincode = async (serviceData) => {
  try {
    const { id, body } = serviceData;
    const result = await pincodeModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: pincodeService: updatePincode`,
      error.message
    );
    throw new Error(error);
  }
};

// deletePincode
module.exports.deletePincode = async (serviceData) => {
  try {
    const { id } = serviceData;
    const result = await pincodeModel.findByIdAndUpdate(id, {
      isDeleted: true,
      status: false,
    });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: pincodeService: deletePincode`,
      error.message
    );
    throw new Error(error);
  }
};
