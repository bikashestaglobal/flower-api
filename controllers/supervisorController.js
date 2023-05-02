const supervisorService = require("../services/supervisorService");
const {
  defaultServerResponse,
  authMessage,
  supervisorMessage,
} = require("../constants");

// createSupervisor
module.exports.createSupervisor = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await supervisorService.createSupervisor(req.body);
    if (serviceResponse.body) {
      response.body = serviceResponse.body;
      response.status = 200;
      response.message = supervisorMessage.SUPERVISOR_CREATED;
    } else {
      response.errors = serviceResponse.errors;
      response.message = supervisorMessage.SUPERVISOR_NOT_CREATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: supervisorController: createSupervisor`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// loginSupervisor
module.exports.loginSupervisor = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await supervisorService.loginSupervisor(req.body);
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
      `Somthing Went Wrong Controller: supervisorController: loginSupervisor`,
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
    const serviceResponse = await supervisorService.getProfile(req.params);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = supervisorMessage.PROFILE_FETCHED;
    } else {
      response.message = supervisorMessage.PROFILE_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: supervisorController: getProfile`,
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
    const serviceResponse = await supervisorService.updateProfile({
      supervisorId: req?.params?.supervisorId,
      body: req.body,
    });

    if (serviceResponse.body) {
      response.body = serviceResponse.body;
      response.status = 200;
      response.message = supervisorMessage.PROFILE_UPDATED;
    } else {
      response.message = supervisorMessage.PROFILE_NOT_UPDATED;
      response.errors = serviceResponse.errors;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: supervisorController: updateProfile`,
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
    const serviceResponse = await supervisorService.findAccount(req.body);
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
      `Somthing Went Wrong Controller: supervisorController: findAccount`,
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
    const serviceResponse = await supervisorService.verifyOTP(req.body);
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
      `Somthing Went Wrong Controller: supervisorController: verifyOTP`,
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
    const serviceResponse = await supervisorService.createNewPassword({
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
      `Somthing Went Wrong Controller: supervisorController: createNewPassword`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getSupervisorById
module.exports.getSupervisorById = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await supervisorService.getSupervisorById(
      req.params
    );
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = supervisorMessage.SUPERVISOR_FETCHED;
    } else {
      response.message = supervisorMessage.SUPERVISOR_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: supervisorController: getSupervisorById`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getAllSupervisors
module.exports.getAllSupervisors = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await supervisorService.getAllSupervisors(
      req.query
    );
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = supervisorMessage.SUPERVISOR_FETCHED;
    } else {
      response.message = supervisorMessage.SUPERVISOR_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: supervisorController: getAllSupervisors`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// updateSupervisor
module.exports.updateSupervisor = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await supervisorService.updateSupervisor({
      id: req.params.id,
      body: req.body,
    });
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = supervisorMessage.SUPERVISOR_UPDATED;
    } else {
      response.message = supervisorMessage.SUPERVISOR_NOT_UPDATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: supervisorController: updateSupervisor`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// deleteSupervisor
module.exports.deleteSupervisor = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await supervisorService.deleteSupervisor(
      req.params
    );
    if (serviceResponse) {
      response.body = { name: serviceResponse.name, _id: serviceResponse._id };
      response.status = 200;
      response.message = supervisorMessage.SUPERVISOR_DELETED;
    } else {
      response.message = supervisorMessage.SUPERVISOR_NOT_DELETED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: supervisorController: deleteSupervisor`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};
