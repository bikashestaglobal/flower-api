const deliveryBoyService = require("../services/deliveryBoyService");
const {
  defaultServerResponse,
  authMessage,
  deliveryBoyMessage,
} = require("../constants");

// createDeliveryBoy
module.exports.createDeliveryBoy = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.createDeliveryBoy(
      req.body
    );
    if (serviceResponse.body) {
      response.body = serviceResponse.body;
      response.status = 200;
      response.message = deliveryBoyMessage.DELIVERY_BOY_CREATED;
    } else {
      response.errors = serviceResponse.errors;
      response.message = deliveryBoyMessage.DELIVERY_BOY_NOT_CREATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: createDeliveryBoy`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// loginDeliveryBoy
module.exports.loginDeliveryBoy = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.loginDeliveryBoy(req.body);
    if (serviceResponse.body) {
      response.body = serviceResponse.body;
      response.status = 200;
      response.message = authMessage.LOGIN_SUCCESS;
    } else {
      response.errors = serviceResponse.errors;
      response.message = authMessage.LOGIN_FAILED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: loginDeliveryBoy`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getProfile
module.exports.getProfile = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.getProfile(req.params);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = deliveryBoyMessage.PROFILE_FETCHED;
    } else {
      response.message = deliveryBoyMessage.PROFILE_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: getProfile`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// updateProfile
module.exports.updateProfile = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.updateProfile({
      deliveryBoyId: req.params.deliveryBoyId,
      body: req.body,
    });

    if (serviceResponse.body) {
      response.body = serviceResponse.body;
      response.status = 200;
      response.message = deliveryBoyMessage.PROFILE_UPDATED;
    } else {
      response.message = deliveryBoyMessage.PROFILE_NOT_UPDATED;
      response.errors = serviceResponse.errors;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: updateProfile`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findAccount
module.exports.findAccount = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.findAccount(req.body);
    if (serviceResponse.body) {
      response.body = serviceResponse.body;
      response.status = 200;
      response.message = "Account found and OTP send to your Email";
    } else {
      response.message = "Oops Something went wrong";
      response.errors = serviceResponse.errors;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: findAccount`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// verifyOTP
module.exports.verifyOTP = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.verifyOTP(req.body);
    if (serviceResponse.body) {
      response.body = serviceResponse.body;
      response.status = 200;
      response.message = "OTP Verify Successfully";
    } else {
      response.message = "Oops Something went wrong";
      response.errors = serviceResponse.errors;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: verifyOTP`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// createNewPassword
module.exports.createNewPassword = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.createNewPassword({
      ...req.body,
      ...req.params,
    });
    if (serviceResponse.body) {
      response.body = serviceResponse.body;
      response.status = 200;
      response.message = "Password Created successfully";
    } else {
      response.message = "Oops Something went wrong";
      response.errors = serviceResponse.errors;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: createNewPassword`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getDeliveryBoyById
module.exports.getDeliveryBoyById = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.getDeliveryBoyById(
      req.params
    );
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = deliveryBoyMessage.DELIVERY_BOY_FETCHED;
    } else {
      response.message = deliveryBoyMessage.DELIVERY_BOY_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: getDeliveryBoyById`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getAllDeliveryBoys
module.exports.getAllDeliveryBoys = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.getAllDeliveryBoys(
      req.query
    );
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = deliveryBoyMessage.DELIVERY_BOY_FETCHED;
    } else {
      response.message = deliveryBoyMessage.DELIVERY_BOY_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: getAllDeliveryBoys`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getAllDeliveryBoys
module.exports.getAllDeliveryBoys = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.getAllDeliveryBoys(
      req.query
    );
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = deliveryBoyMessage.DELIVERY_BOY_FETCHED;
    } else {
      response.message = deliveryBoyMessage.DELIVERY_BOY_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: getAllDeliveryBoys`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getAllNotAssignedDeliveryBoys
module.exports.getAllNotAssignedDeliveryBoys = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse =
      await deliveryBoyService.getAllNotAssignedDeliveryBoys(req.query);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = deliveryBoyMessage.DELIVERY_BOY_FETCHED;
    } else {
      response.message = deliveryBoyMessage.DELIVERY_BOY_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: getAllNotAssignedDeliveryBoys`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// updateDeliveryBoy
module.exports.updateDeliveryBoy = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.updateDeliveryBoy({
      id: req.params.id,
      body: req.body,
    });
    if (serviceResponse) {
      response.body = { name: serviceResponse.name, _id: serviceResponse._id };
      response.status = 200;
      response.message = deliveryBoyMessage.DELIVERY_BOY_UPDATED;
    } else {
      response.message = deliveryBoyMessage.DELIVERY_BOY_NOT_UPDATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: updateDeliveryBoy`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// assignPincodes
module.exports.assignPincodes = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await deliveryBoyService.updateDeliveryBoy({
      id: req.params.id,
      body: req.body,
    });
    if (serviceResponse) {
      response.body = { name: serviceResponse.name, _id: serviceResponse._id };
      response.status = 200;
      response.message = deliveryBoyMessage.PINCODE_UPDATED;
    } else {
      response.message = deliveryBoyMessage.PINCODE_NOT_UPDATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: deliveryBoyController: assignPincodes`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};
