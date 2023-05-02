const categoryService = require("../services/categoryService");
const { defaultServerResponse, categoryMessage } = require("../constants");

// createCategory
module.exports.createCategory = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await categoryService.createCategory(req.body);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = categoryMessage.CATEGORY_CREATED;
    } else {
      response.message = categoryMessage.CATEGORY_NOT_CREATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: categoryController: createCategory`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getCategoryById
module.exports.getCategoryById = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await categoryService.getCategoryById(req.params);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = categoryMessage.CATEGORY_FETCHED;
    } else {
      response.message = categoryMessage.CATEGORY_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: categoryController: getCategoryById`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getAllCategories
module.exports.getAllCategories = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await categoryService.getAllCategories(req.query);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = categoryMessage.CATEGORY_FETCHED;
    } else {
      response.message = categoryMessage.CATEGORY_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: categoryController: getAllCategories`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// updateCategory
module.exports.updateCategory = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await categoryService.updateCategory({
      id: req.params.id,
      body: req.body,
    });
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = categoryMessage.CATEGORY_UPDATED;
    } else {
      response.message = categoryMessage.CATEGORY_NOT_UPDATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: categoryController: updateCategory`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// deleteCategory
module.exports.deleteCategory = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await categoryService.deleteCategory(req.params);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = categoryMessage.CATEGORY_DELETED;
    } else {
      response.message = categoryMessage.CATEGORY_NOT_DELETED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: categoryController: deleteCategory`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};
