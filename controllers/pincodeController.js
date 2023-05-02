const pincodeService = require("../services/pincodeService");
const { defaultServerResponse, pincodeMessage } = require("../constants");

// createPincode
module.exports.createPincode = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await pincodeService.createPincode(req.body);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = pincodeMessage.PINCODE_CREATED;
    } else {
      response.message = pincodeMessage.PINCODE_NOT_CREATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: pincodeController: createPincode`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getPincodeById
module.exports.getPincodeById = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await pincodeService.getPincodeById(req.params);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = pincodeMessage.PINCODE_FETCHED;
    } else {
      response.message = pincodeMessage.PINCODE_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: pincodeController: getPincodeById`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getAllPincodes
module.exports.getAllPincodes = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await pincodeService.getAllPincodes(req.query);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = pincodeMessage.PINCODE_FETCHED;
    } else {
      response.message = pincodeMessage.PINCODE_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: pincodeController: getAllPincodes`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getAllNotAssignedPincodes
module.exports.getAllNotAssignedPincodes = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await pincodeService.getAllNotAssignedPincodes(
      req.query
    );
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = pincodeMessage.PINCODE_FETCHED;
    } else {
      response.message = pincodeMessage.PINCODE_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: pincodeController: getAllNotAssignedPincodes`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// updatePincode
module.exports.updatePincode = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await pincodeService.updatePincode({
      id: req.params.id,
      body: req.body,
    });
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = pincodeMessage.PINCODE_UPDATED;
    } else {
      response.message = pincodeMessage.PINCODE_NOT_UPDATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: pincodeController: updatePincode`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// deletePincode
module.exports.deletePincode = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await pincodeService.deletePincode(req.params);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = pincodeMessage.PINCODE_DELETED;
    } else {
      response.message = pincodeMessage.PINCODE_NOT_DELETED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: pincodeController: deletePincode`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};
