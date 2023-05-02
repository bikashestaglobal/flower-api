const bucketService = require("../services/bucketService");
const constants = require("../constants");

// createBucket
module.exports.createBucket = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await bucketService.createBucket(req.body);

    response.status = 200;
    response.message = constants.bucketMessage.BUCKET_CREATED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : productController: createBucket`
    );
  }
  res.status(response.status).send(response);
};

// updateBucket
module.exports.updateBucket = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await bucketService.updateBucket({
      id: req.params.id,
      body: req.body,
    });

    response.status = 200;
    response.message = constants.bucketMessage.BUCKET_UPDATED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : productController:  updateBucket`
    );
  }
  res.status(response.status).send(response);
};

// getAllBuckets
module.exports.getAllBuckets = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await bucketService.getAllBuckets(req.query);
    response.status = 200;
    response.message = constants.bucketMessage.BUCKET_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : productController: getAllBuckets`
    );
  }
  res.status(response.status).send(response);
};

// getBucketById
module.exports.getBucketById = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await bucketService.getBucketById(req.params);

    response.status = 200;
    response.message = constants.bucketMessage.BUCKET_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : productController : getBucketById`
    );
  }
  res.status(response.status).send(response);
};

// deleteBucket
module.exports.deleteBucket = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await bucketService.deleteBucket(req.params);
    response.status = 200;
    response.message = constants.bucketMessage.BUCKET_DELETED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : productController:  deleteBucket`
    );
  }
  res.status(response.status).send(response);
};
