const customerModel = require("../database/models/customerModel");
const pincodeModel = require("../database/models/pincodeModel");
const constant = require("../constants");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbHelper = require("../helpers/dbHelper");
const smsHelper = require("../helpers/smsHelper");
const moment = require("moment");

// registerCustomer
module.exports.registerCustomer = async (serviceData) => {
  const response = {
    status: "OK",
  };
  try {
    // Check Email is already exist or not
    const data = await customerModel.findOne({
      email: serviceData.email,
    });

    if (data) {
      if (data.isDeleted) {
        throw new Error("Account is deleted permanently");
      } else if (!data.isVerified) {
        response.status = "ACCOUNT_NOT_VERIFIED";
        response.errors = {
          email: "Email already exists need Verification",
        };

        // Send otp
        const otp = smsHelper.createOTP();
        const mailResponse = await smsHelper.sendOTPEmail({
          emailTo: serviceData.email,
          subject: "Account Verification OTP",
          name: data.firstName,
          otp: otp,
        });

        if (!mailResponse.status) {
          throw new Error(
            `Email Exist But some Error occured ${mailResponse.message}`
          );
        }

        // Save OTP To Database
        const date = moment.utc().toDate();
        const otpExpiredAt = date.setMinutes(date.getMinutes() + 3);

        const updateData = await customerModel.findByIdAndUpdate(data._id, {
          otp,
          otpExpiredAt,
        });

        return response;
      } else if (!data.status) {
        response.status = "ACCOUNT_DISABLED";
        response.errors = {
          email: "Email disabled, talk to Admin",
        };
        return response;
      } else {
        response.status = "ACCOUNT_EXIST";
        response.errors = {
          email: "Email already exists, Need login to continue",
        };
        return response;
      }
    }

    // Hash Password
    serviceData.password = await bcryptjs.hash(serviceData.password, 12);

    // generate otp
    const otp = smsHelper.createOTP();
    const date = moment.utc().toDate();
    const otpExpiredAt = date.setMinutes(date.getMinutes() + 3);
    serviceData.otp = otp;
    serviceData.otpExpiredAt = otpExpiredAt;
    const newData = new customerModel(serviceData);
    const result = await newData.save();

    // SEND OTP
    const mailResponse = await smsHelper.sendOTPEmail({
      emailTo: serviceData.email,
      subject: "Account Verification OTP",
      name: serviceData.firstName,
      otp: otp,
    });

    if (!mailResponse.status) {
      throw new Error(
        `Email Exist But some Error occured ${mailResponse.message}`
      );
    }

    if (result) {
      const formatData = dbHelper.formatMongoData(result);
      response.body = formatData;
    } else {
      throw new Error("Oops! Something went wrong");
    }
  } catch (error) {
    console.log(
      `Something went wrong Service: customerService: registerCustomer`,
      error.message
    );
    throw new Error(error.message);
  }
  return response;
};

// verifyAccount
module.exports.verifyAccount = async (serviceData) => {
  const response = {
    errors: {},
  };

  try {
    // Verify Account
    const currentTime = new Date().toISOString();
    const data = await customerModel.findOne({
      email: serviceData.email,
      otp: serviceData.otp,
      otpExpiredAt: { $gte: currentTime },
    });

    if (data) {
      // generate token
      const token = jwt.sign(
        { id: data._id },
        process.env.JWT_CUSTOMER_SECRET_KEY,
        { expiresIn: "2 days" }
      );

      // Update status
      const result = await customerModel.findByIdAndUpdate(data._id, {
        status: true,
        isVerified: true,
      });

      response.body = {
        token,
      };
    } else {
      response.errors.otp = "Wrong or Expired OTP";
    }
  } catch (error) {
    console.log(`Something went wrong Service: customerService: verifyAccount`);
    throw new Error(error.message);
  }
  return response;
};

// loginCustomer
module.exports.loginCustomer = async (serviceData) => {
  const response = {
    errors: {},
  };
  try {
    // Find account
    const data = await customerModel.findOne({
      email: serviceData.email,
    });

    if (data) {
      // When account is deleted
      if (data.isDeleted) {
        throw new Error("Account is deleted permanently");
      }

      // When account is not verified
      if (!data.isVerified) {
        response.status = "ACCOUNT_NOT_VERIFIED";
        response.errors = {
          email: "Email already exists need Verification",
        };

        // Send otp
        const otp = smsHelper.createOTP();

        const mailResponse = await smsHelper.sendOTPEmail({
          emailTo: serviceData.email,
          subject: "Account Activation OTP",
          name: data.firstName,
          otp: otp,
        });
        if (!mailResponse.status) {
          throw new Error(
            `Email Exist But some Error occured ${mailResponse.message}`
          );
        }

        // Save OTP To Database
        const date = moment.utc().toDate();
        const otpExpiredAt = date.setMinutes(date.getMinutes() + 3);

        const updateData = await customerModel.findByIdAndUpdate(data._id, {
          otp,
          otpExpiredAt,
        });

        return response;
      }

      // When account is disabled
      if (!data.status) {
        response.status = "ACCOUNT_DISABLED";
        response.errors = {
          email: "Email disabled, talk to Admin",
        };
        return response;
      }

      // ===========================================
      // Now checking the password
      // Check password is matched or not
      const isCorrect = await bcryptjs.compare(
        serviceData.password,
        data.password
      );
      if (isCorrect) {
        // Sign jwt token
        const token = jwt.sign(
          { id: data._id },
          process.env.JWT_CUSTOMER_SECRET_KEY,
          { expiresIn: "2 days" }
        );
        response.status = "OK";
        response.body = { token };
        return response;
      } else {
        response.status = "PASSWORD_MISMATCH";
        response.errors.password = constant.authMessage.INVALID_PASSWORD;
        return response;
      }
    } else {
      response.errors.email = constant.authMessage.INVALID_EMAIL;
      response.status = "INVALID_EMAIL";
      return response;
    }
  } catch (error) {
    console.log(`Something went wrong Service: customerService: loginCustomer`);
    throw new Error(error.message);
  }
};

// getProfile
module.exports.getProfile = async (serviceData) => {
  try {
    const result = await customerModel.findOne({
      _id: serviceData.customerId,
    });

    if (result) {
      if (result.isDeleted) throw new Error("Account is deleted permanently");
      if (!result.status) throw new Error("Account is disabled permanently");
    }

    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService: getProfile`,
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
    const { customerId, body } = serviceData;

    // If Password available
    if (body.password) {
      if (!body.oldPassword) {
        response.errors.oldPassword = "Old Password is required";
        return response;
      }

      const data = await customerModel.findOne({
        _id: customerId,
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

    const result = await customerModel.findByIdAndUpdate(customerId, body, {
      new: true,
    });

    response.body = dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService:  updateProfile`,
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
    status: "OK",
  };

  try {
    // Check Email exist or not
    const data = await customerModel.findOne({
      email: serviceData.email,
    });
    const otp = smsHelper.createOTP();
    if (data) {
      // When account is deleted
      if (data.isDeleted) {
        throw new Error("Account is deleted permanently");
      }

      // When account is not verified
      if (!data.isVerified) {
        response.status = "ACCOUNT_NOT_VERIFIED";
        response.errors = {
          email: "Email already exists need Verification",
        };

        // Send otp
        const otp = smsHelper.createOTP();

        const mailResponse = await smsHelper.sendOTPEmail({
          emailTo: serviceData.email,
          subject: "Account Activation OTP",
          name: data.firstName,
          otp: otp,
        });
        if (!mailResponse.status) {
          throw new Error(
            `Email Exist But some Error occured ${mailResponse.message}`
          );
        }

        // Save OTP To Database
        const date = moment.utc().toDate();
        const otpExpiredAt = date.setMinutes(date.getMinutes() + 3);

        const updateData = await customerModel.findByIdAndUpdate(data._id, {
          otp,
          otpExpiredAt,
        });

        return response;
      }

      // When account is disabled
      if (!data.status) {
        response.status = "ACCOUNT_DISABLED";
        response.errors = {
          email: "Email disabled, talk to Admin",
        };
        return response;
      }

      // Send Email
      const mailResponse = await smsHelper.sendOTPEmail({
        emailTo: serviceData.email,
        subject: "Reset Password OTP",
        name: data.firstName,
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

      const updateData = await customerModel.findByIdAndUpdate(data._id, {
        otp,
        otpExpiredAt,
      });

      if (updateData) {
        response.body = serviceData;
      } else {
        throw new Error(`Account Found but OTP Data Not Updated to Table`);
      }
    } else {
      response.status = "INVALID_EMAIL";
      response.errors.email = constant.customerMessage.INVALID_EMAIL;
    }
  } catch (error) {
    console.log(`Something went wrong Service: customerService: findAccount`);
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
    const data = await customerModel.findOne({
      email: serviceData.email,
      otp: serviceData.otp,
      otpExpiredAt: { $gte: currentTime },
    });

    if (data) {
      // generate token
      const token = jwt.sign(
        { id: data._id },
        process.env.JWT_CUSTOMER_SECRET_KEY,
        { expiresIn: "3m" }
      );

      response.body = {
        token,
      };
    } else {
      response.errors.otp = "Wrong or Expired OTP";
    }
  } catch (error) {
    console.log(`Something went wrong Service: customerService: verifyOTP`);
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
    const customerId = serviceData.customerId;

    const result = await customerModel.findOneAndUpdate(
      { _id: customerId },
      { password: password },
      {
        new: true,
      }
    );

    if (result) {
      response.body = dbHelper.formatMongoData(result);
    } else {
      throw new Error(constant.customerMessage.PASSWORD_NOT_CREATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService:  createNewPassword`,
      error.message
    );
    throw new Error(error);
  }

  return response;
};

// getCustomerById
module.exports.getCustomerById = async (serviceData) => {
  try {
    const id = serviceData?.id;
    const result = await customerModel.findOne({ _id: id });
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService: getCustomerById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllCustomers
module.exports.getAllCustomers = async (serviceData) => {
  try {
    let conditions = {};
    const {
      limit = 10,
      skip = 0,
      searchQuery,
      status = true,
      isDeleted = false,
      isVerified = "All",
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [
          { firstName: { $regex: searchQuery, $options: "i" } },
          { lastName: { $regex: searchQuery, $options: "i" } },
          { mobile: { $regex: searchQuery, $options: "i" } },
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

    // isVerified
    if (isVerified == "All") {
      delete conditions.isVerified;
    } else {
      conditions.isVerified = isVerified;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    const result = await customerModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService: getAllCustomers`,
      error.message
    );
    throw new Error(error);
  }
};

// updateCustomer
module.exports.updateCustomer = async (serviceData) => {
  try {
    const { id, body } = serviceData;
    const result = await customerModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService: updateCustomer`,
      error.message
    );
    throw new Error(error);
  }
};

// deleteCustomer
module.exports.deleteCustomer = async (serviceData) => {
  try {
    const { id } = serviceData;
    const result = await customerModel.findByIdAndUpdate(
      id,
      { isDeleted: true, status: false },
      {
        new: true,
      }
    );
    return dbHelper.formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: supervisorService: deleteCustomer`,
      error.message
    );
    throw new Error(error);
  }
};

/*
 *****************************
 ***********ADDRESS***********
 *****************************
 */

// addAddress
module.exports.addAddress = async (serviceData) => {
  const response = {
    errors: {},
    body: null,
  };

  try {
    const { customerId, body } = serviceData;

    // Check Pincode is available or not for delivery
    const pincodeData = await pincodeModel.findOne({
      pincode: serviceData?.body?.pincode,
      status: true,
      isDeleted: false,
    });

    if (!pincodeData) {
      response.errors.pincode =
        constant.pincodeMessage.PINCODE_NOT_FOR_DELIVERY;
      return response;
    }

    // check for the default address
    if (body.defaultAddress == true) {
      let r = await customerModel.findOneAndUpdate(
        { _id: customerId, "shippingAddresses.defaultAddress": true },
        {
          $set: { "shippingAddresses.$.defaultAddress": false },
        },
        { new: true }
      );
    }

    const result = await customerModel.findOneAndUpdate(
      { _id: customerId },
      {
        $push: { shippingAddresses: body },
      },
      { new: true }
    );
    if (result) {
      response.body = dbHelper.formatMongoData(result);
    } else {
      throw new Error(constant.customerMessage.ADDRESS_NOT_ADDED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService: addAddress`,
      error.message
    );
    throw new Error(error);
  }

  return response;
};

// getAddressById
module.exports.getAddressById = async (serviceData) => {
  try {
    const { customerId, addressId } = serviceData;
    const result = await customerModel.findOne(
      { _id: customerId, "shippingAddresses._id": addressId },
      { _id: 1, shippingAddresses: { $elemMatch: { _id: addressId } } }
    );
    if (result) {
      return dbHelper.formatMongoData(result.shippingAddresses[0]);
    } else {
      throw new Error(constant.customerMessage.ADDRESS_NOT_FOUND);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService: getAddressById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllAddress
module.exports.getAllAddress = async (serviceData) => {
  try {
    const { customerId } = serviceData;
    const result = await customerModel.findOne({ _id: customerId });
    if (result) {
      return dbHelper.formatMongoData(result.shippingAddresses);
    } else {
      throw new Error(constant.customerMessage.ADDRESS_NOT_FOUND);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService: getAllAddress`,
      error.message
    );
    throw new Error(error);
  }
};

// updateAddress
module.exports.updateAddress = async (serviceData) => {
  const response = {
    errors: {},
    body: null,
  };
  try {
    const { customerId, addressId, body } = serviceData;

    // Check Pincode is available or not for delivery
    const pincodeData = await pincodeModel.findOne({
      pincode: serviceData?.body?.pincode,
      status: true,
      isDeleted: false,
    });

    if (!pincodeData) {
      response.errors.pincode =
        constant.pincodeMessage.PINCODE_NOT_FOR_DELIVERY;
      return response;
    }

    // check for the default address
    if (body.defaultAddress == true) {
      let r = await customerModel.findOneAndUpdate(
        { _id: customerId, "shippingAddresses.defaultAddress": true },
        {
          $set: { "shippingAddresses.$.defaultAddress": false },
        },
        { new: true }
      );
    }

    const keys = Object.keys(body);
    const address = {};
    for (let key of keys) {
      address["shippingAddresses.$." + key] = body[key];
    }

    const result = await customerModel.findOneAndUpdate(
      { _id: customerId, "shippingAddresses._id": addressId },
      {
        $set: address,
      },
      { new: true }
    );
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      return response;
    } else {
      throw new Error(constant.customerMessage.ADDRESS_NOT_UPDATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService: updateAddress`,
      error.message
    );
    throw new Error(error);
  }
};

// deleteAddress
module.exports.deleteAddress = async (serviceData) => {
  try {
    const { customerId, addressId } = serviceData;

    const result = await customerModel.findOneAndUpdate(
      { _id: customerId },
      {
        $pull: { shippingAddresses: { _id: addressId } },
      },
      {
        new: true,
      }
    );
    if (result) {
      return dbHelper.formatMongoData(result);
    } else {
      throw new Error(constant.customerMessage.ADDRESS_NOT_DELETE);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: customerService: deleteAddress`,
      error.message
    );
    throw new Error(error);
  }
};

/*
 *****************************
 *********END ADDRESS*********
 *****************************
 */
