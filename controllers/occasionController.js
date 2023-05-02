const occasionService = require("../services/occasionService");
const { defaultServerResponse, occasionMessage } = require("../constants");

// createOccasion
module.exports.createOccasion = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await occasionService.createOccasion(req.body);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = occasionMessage.OCCASION_CREATED;
    } else {
      response.message = occasionMessage.OCCASION_NOT_CREATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: occasionController: createOccasion`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getOccasionById
module.exports.getOccasionById = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await occasionService.getOccasionById(req.params);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = occasionMessage.OCCASION_FETCHED;
    } else {
      response.message = occasionMessage.OCCASION_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: occasionController: getOccasionById`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getAllOccasions
module.exports.getAllOccasions = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await occasionService.getAllOccasions(req.query);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = occasionMessage.OCCASION_FETCHED;
    } else {
      response.message = occasionMessage.OCCASION_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: occasionController: getAllOccasions`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// updateOccasion
module.exports.updateOccasion = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await occasionService.updateOccasion({
      id: req.params.id,
      body: req.body,
    });
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = occasionMessage.OCCASION_UPDATED;
    } else {
      response.message = occasionMessage.OCCASION_NOT_UPDATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: occasionController: updateOccasion`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// deleteOccasion
module.exports.deleteOccasion = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await occasionService.deleteOccasion(req.params);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = occasionMessage.OCCASION_DELETED;
    } else {
      response.message = occasionMessage.OCCASION_NOT_DELETED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: occasionController: deleteOccasion`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};
