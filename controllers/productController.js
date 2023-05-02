const productService = require("../services/productService");
const constants = require("../constants");

// createProduct
module.exports.createProduct = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await productService.createProduct(req.body);

    response.status = 200;
    response.message = constants.productMessage.PRODUCT_CREATED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : productController: createProduct`
    );
  }
  res.status(response.status).send(response);
};

// updateProduct
module.exports.updateProduct = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await productService.updateProduct({
      id: req.params.id,
      body: req.body,
    });

    response.status = 200;
    response.message = constants.productMessage.PRODUCT_UPDATED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : productController:  updateProduct`
    );
  }
  res.status(response.status).send(response);
};

// getAllProducts
module.exports.getAllProducts = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await productService.getAllProducts(req.query);
    response.status = 200;
    response.message = constants.productMessage.PRODUCT_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : productController: getAllProducts`
    );
  }
  res.status(response.status).send(response);
};

// getProductById
module.exports.getProductById = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await productService.getProductById(req.params);

    response.status = 200;
    response.message = constants.productMessage.PRODUCT_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : productController : getProductById`
    );
  }
  res.status(response.status).send(response);
};

// deleteProduct
module.exports.deleteProduct = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await productService.deleteProduct(req.params);
    response.status = 200;
    response.message = constants.productMessage.PRODUCT_DELETED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : productController:  deleteProduct`
    );
  }
  res.status(response.status).send(response);
};
