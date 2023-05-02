const deliveryBoyModel = require("../database/models/deliveryBoyModel");
const constant = require("../constants");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbHelper = require("../helpers/dbHelper");
const smsHelper = require("../helpers/smsHelper");
const moment = require("moment");
const supervisorModel = require("../database/models/supervisorModel");

// createDeliveryBoy
module.exports.createDeliveryBoy = async (serviceData) => {
  const response = {};
  try {
    // Check Email is already exist or not
    const deliveryBoy = await deliveryBoyModel.findOne({
      email: serviceData.email,
    });
    if (deliveryBoy) {
      response.errors = {
        email: constant.authMessage.EMAIL_EXISTS,
      };
      return response;
    }
    // Hash Password
    serviceData.password = await bcryptjs.hash(serviceData.password, 12);

    const newData = new deliveryBoyModel(serviceData);

    const result = await newData.save();

    if (result) {
      // generate jwt token
      const formatData = dbHelper.formatMongoData(result);
      response.body = formatData;
    } else {
      throw new Error("Oops! Something went wrong");
    }
  } catch (error) {
    console.log(
      `Something went wrong Service: deliveryBoyService: createDeliveryBoy`,
      error.message
    );
    throw new Error(error.message);
  }
  return response;
};

// loginDeliveryBoy
module.exports.loginDeliveryBoy = async (serviceData) => {
  const response = {
    errors: {},
  };
  try {
    // Find admin
    const deliveryBoyData = await deliveryBoyModel.findOne({
      email: serviceData.email,
    });
    if (deliveryBoyData) {
      // Check password is matched or not
      const isCorrect = await bcryptjs.compare(
        serviceData.password,
        deliveryBoyData.password
      );
      if (isCorrect) {
        // Sign jwt token
        const token = jwt.sign(
          { id: deliveryBoyData._id },
          process.env.JWT_DELIVERY_BOY_SECRET_KEY,
          { expiresIn: "2 days" }
        );
        const formatData = deliveryBoyData.toObject();
        response.body = { token };
      } else {
        response.errors.password = constant.authMessage.INVALID_PASSWORD;
      }
    } else {
      response.errors.email = constant.authMessage.INVALID_EMAIL;
    }
  } catch (error) {
    console.log(
      `Something went wrong Service: deliveryBoyService: loginDeliveryBoy`
    );
    throw new Error(error.message);
  }
  return response;
};

// getProfile
module.exports.getProfile = async (serviceData) => {
  try {
    const result = await deliveryBoyModel.findOne({
      _id: serviceData.deliveryBoyId,
    });
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryBoyService: getProfile`,
      error.message
    );
    throw new Error(error);
  }
};

// updateProfile
module.exports.updateProfile = async (serviceData) => {
  const response = {
    errors: {},
  };
  try {
    const { deliveryBoyId, body } = serviceData;

    // If Password available
    if (body.password) {
      if (!body.oldPassword) {
        response.errors.oldPassword = "Old Password is required";
        return response;
      }

      const deliveryBoyData = await deliveryBoyModel.findOne({
        _id: deliveryBoyId,
      });
      if (deliveryBoyData) {
        const isCorrect = await bcryptjs.compare(
          body.oldPassword,
          deliveryBoyData.password
        );
        if (isCorrect) {
          body.password = await bcryptjs.hash(body.password, 12);
        } else {
          response.errors.oldPassword = constant.authMessage.INVALID_PASSWORD;
          return response;
        }
      } else {
        // Profile not found
        throw new Error("Profile not found");
      }
    }

    const result = await deliveryBoyModel.findByIdAndUpdate(
      deliveryBoyId,
      body,
      {
        new: true,
      }
    );

    response.body = dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryBoyService:  updateProfile`,
      error.message
    );
    throw new Error(error);
  }
  return response;
};

// findAccount
module.exports.findAccount = async (serviceData) => {
  const response = {
    errors: {},
  };

  try {
    // Check Email exist or not
    const data = await deliveryBoyModel.findOne({
      email: serviceData.email,
    });
    const otp = smsHelper.createOTP();
    if (data) {
      // Send Email
      const mailResponse = await smsHelper.sendOTPEmail({
        emailTo: serviceData.email,
        subject: "Reset Password OTP",
        name: data.name,
        otp: otp,
      });

      if (!mailResponse.status) {
        throw new Error(
          `Account Found ! But some Error occured ${mailResponse.message}`
        );
      }

      // Save OTP To Database
      const date = moment.utc().toDate();
      const otpExpiredAt = date.setMinutes(date.getMinutes() + 3);

      const updateData = await deliveryBoyModel.findByIdAndUpdate(data._id, {
        otp,
        otpExpiredAt,
      });

      if (updateData) {
        response.body = serviceData;
      } else {
        throw new Error(`Account Found but OTP Data Not Updated to Table`);
      }
    } else {
      response.errors.email = constant.adminMessage.ACCOUNT_NOT_FOUND;
    }
  } catch (error) {
    console.log(
      `Something went wrong Service: deliveryBoyService: findAccount`
    );
    throw new Error(error.message);
  }
  return response;
};

// verifyOTP
module.exports.verifyOTP = async (serviceData) => {
  const response = {
    errors: {},
  };

  try {
    // Verify OTP
    const currentTime = new Date().toISOString();
    const data = await deliveryBoyModel.findOne({
      email: serviceData.email,
      otp: serviceData.otp,
      otpExpiredAt: { $gte: currentTime },
    });

    if (data) {
      // generate token
      const token = jwt.sign(
        { id: data._id },
        process.env.JWT_DELIVERY_BOY_SECRET_KEY,
        { expiresIn: "3m" }
      );

      response.body = {
        token,
      };
    } else {
      response.errors.otp = "Wrong or Expired OTP";
    }
  } catch (error) {
    console.log(`Something went wrong Service: deliveryBoyService: verifyOTP`);
    throw new Error(error.message);
  }
  return response;
};

// createNewPassword
module.exports.createNewPassword = async (serviceData) => {
  const response = {
    errors: {},
  };

  try {
    const password = await bcryptjs.hash(serviceData.password, 12);
    const deliveryBoyId = serviceData.deliveryBoyId;

    const result = await deliveryBoyModel.findOneAndUpdate(
      { _id: deliveryBoyId },
      { password: password },
      {
        new: true,
      }
    );

    if (result) {
      response.body = dbHelper.formatMongoData(result);
    } else {
      throw new Error(constant.adminMessage.PASSWORD_NOT_UPDATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryBoyService:  createNewPassword`,
      error.message
    );
    throw new Error(error);
  }

  return response;
};

// getDeliveryBoyById
module.exports.getDeliveryBoyById = async (serviceData) => {
  try {
    const id = serviceData?.id;
    const result = await deliveryBoyModel.findOne({ _id: id });
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryBoyService: getDeliveryBoyById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllDeliveryBoys
module.exports.getAllDeliveryBoys = async (serviceData) => {
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
          { email: { $regex: searchQuery, $options: "i" } },
          { mobile: { $regex: searchQuery, $options: "i" } },
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

    const result = await deliveryBoyModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryBoyService: getAllDeliveryBoys`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllNotAssignedDeliveryBoys
module.exports.getAllNotAssignedDeliveryBoys = async (serviceData) => {
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
          { email: { $regex: searchQuery, $options: "i" } },
          { mobile: { $regex: searchQuery, $options: "i" } },
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

    const result = await deliveryBoyModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const allNotAssignedBoys = [];
    for (let i = 0; i < result.length; i++) {
      const assignedBoy = await supervisorModel.findOne({
        deliveryBoys: {
          $in: result[i]._id,
        },
      });

      if (!assignedBoy) allNotAssignedBoys.push(result[i]);
    }

    return dbHelper.formatMongoData(allNotAssignedBoys);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryBoyService: getAllNotAssignedDeliveryBoys`,
      error.message
    );
    throw new Error(error);
  }
};

// updateDeliveryBoy
module.exports.updateDeliveryBoy = async (serviceData) => {
  try {
    const { id, body } = serviceData;
    const result = await deliveryBoyModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryBoyService: updateDeliveryBoy`,
      error.message
    );
    throw new Error(error);
  }
};

// deleteDeliveryBoy
module.exports.deleteDeliveryBoy = async (serviceData) => {
  try {
    const { id } = serviceData;
    const result = await deliveryBoyModel.findByIdAndUpdate(
      id,
      { isDeleted: true, status: false },
      {
        new: true,
      }
    );
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: supervisorService: deleteDeliveryBoy`,
      error.message
    );
    throw new Error(error);
  }
};
