const supervisorModel = require("../database/models/supervisorModel");
const constant = require("../constants");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbHelper = require("../helpers/dbHelper");
const smsHelper = require("../helpers/smsHelper");
const moment = require("moment");

// createSupervisor
module.exports.createSupervisor = async (serviceData) => {
  const response = {};
  try {
    // Check Email is already exist or not
    const data = await supervisorModel.findOne({
      email: serviceData.email,
    });
    if (data) {
      response.errors = {
        email: constant.authMessage.EMAIL_EXISTS,
      };
      return response;
    }
    // Hash Password
    serviceData.password = await bcryptjs.hash(serviceData.password, 12);

    const newData = new supervisorModel(serviceData);

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
      `Something went wrong Service: supervisorService: createSupervisor`,
      error.message
    );
    throw new Error(error.message);
  }
  return response;
};

// loginSupervisor
module.exports.loginSupervisor = async (serviceData) => {
  const response = {
    errors: {},
  };
  try {
    // Find admin
    const data = await supervisorModel.findOne({
      email: serviceData.email,
      isDeleted: false,
      status: true,
    });
    if (data) {
      // Check password is matched or not
      const isCorrect = await bcryptjs.compare(
        serviceData.password,
        data.password
      );
      if (isCorrect) {
        // Sign jwt token
        const token = jwt.sign(
          { id: data._id },
          process.env.JWT_SUPERVISOR_SECRET_KEY,
          { expiresIn: "2 days" }
        );
        const formatData = data.toObject();
        response.body = { token };
      } else {
        response.errors.password = constant.authMessage.INVALID_PASSWORD;
      }
    } else {
      response.errors.email = constant.authMessage.INVALID_EMAIL;
    }
  } catch (error) {
    console.log(
      `Something went wrong Service: supervisorService: loginSupervisor`
    );
    throw new Error(error.message);
  }
  return response;
};

// getProfile
module.exports.getProfile = async (serviceData) => {
  try {
    const result = await supervisorModel.findOne({
      _id: serviceData.supervisorId,
      isDeleted: false,
      status: true,
    });
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: supervisorService: getProfile`,
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
    const { supervisorId, body } = serviceData;

    // If Password available
    if (body.password) {
      if (!body.oldPassword) {
        response.errors.oldPassword = "Old Password is required";
        return response;
      }

      const data = await supervisorModel.findOne({
        _id: supervisorId,
      });
      if (data) {
        const isCorrect = await bcryptjs.compare(
          body.oldPassword,
          data.password
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

    const result = await supervisorModel.findOneAndUpdate(
      { _id: supervisorId, isDeleted: false },
      body,
      {
        new: true,
      }
    );

    response.body = dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: supervisorService:  updateProfile`,
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
    const data = await supervisorModel.findOne({
      email: serviceData.email,
      isDeleted: false,
      status: true,
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

      const updateData = await supervisorModel.findByIdAndUpdate(data._id, {
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
    console.log(`Something went wrong Service: supervisorService: findAccount`);
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
    const data = await supervisorModel.findOne({
      email: serviceData.email,
      otp: serviceData.otp,
      otpExpiredAt: { $gte: currentTime },
      isDeleted: false,
    });

    if (data) {
      // generate token
      const token = jwt.sign(
        { id: data._id },
        process.env.JWT_SUPERVISOR_SECRET_KEY,
        { expiresIn: "3m" }
      );

      response.body = {
        token,
      };
    } else {
      response.errors.otp = "Wrong or Expired OTP";
    }
  } catch (error) {
    console.log(`Something went wrong Service: supervisorService: verifyOTP`);
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
    const supervisorId = serviceData.supervisorId;

    const result = await supervisorModel.findOneAndUpdate(
      { _id: supervisorId, isDeleted: false },
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
      `Somthing Went Wrong Service: supervisorService:  createNewPassword`,
      error.message
    );
    throw new Error(error);
  }

  return response;
};

// getSupervisorById
module.exports.getSupervisorById = async (serviceData) => {
  try {
    const id = serviceData?.id;
    const result = await supervisorModel
      .findOne({ _id: id, isDeleted: false })
      .populate({
        path: "pincodes",
        select: "pincode state city",
      })
      .populate({
        path: "deliveryBoys",
        select: "name email mobile",
      });
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: supervisorService: getSupervisorById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllSupervisors
module.exports.getAllSupervisors = async (serviceData) => {
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
    const result = await supervisorModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate({
        path: "pincodes",
        select: "pincode city",
      })
      .populate({
        path: "deliveryBoys",
        select: "name email",
      });
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: supervisorService: getAllSupervisors`,
      error.message
    );
    throw new Error(error);
  }
};

// updateSupervisor
module.exports.updateSupervisor = async (serviceData) => {
  try {
    const { id, body } = serviceData;
    const result = await supervisorModel.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: supervisorService: updateSupervisor`,
      error.message
    );
    throw new Error(error);
  }
};

// deleteSupervisor
module.exports.deleteSupervisor = async (serviceData) => {
  try {
    const { id } = serviceData;
    const result = await supervisorModel.findByIdAndUpdate(
      id,
      { isDeleted: true, status: false },
      {
        new: true,
      }
    );
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: supervisorService: deleteSupervisor`,
      error.message
    );
    throw new Error(error);
  }
};
