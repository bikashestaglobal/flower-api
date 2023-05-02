const newsLetterService = require("../services/newsLetterService");
const { defaultServerResponse, newsletterMessage } = require("../constants");

// createNewsletter
module.exports.createNewsletter = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await newsLetterService.createNewsletter(req.body);
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = newsletterMessage.NEWSLETTER_CREATED;
    } else {
      response.message = newsletterMessage.NEWSLETTER_NOT_CREATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: occasionController: createNewsletter`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getNewsletterById
module.exports.getNewsletterById = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await newsLetterService.getNewsletterById(
      req.params
    );
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = newsletterMessage.NEWSLETTER_FETCHED;
    } else {
      response.message = newsletterMessage.NEWSLETTER_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: occasionController: getNewsletterById`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// getAllNewsletters
module.exports.getAllNewsletters = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await newsLetterService.getAllNewsletters(
      req.query
    );
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = newsletterMessage.NEWSLETTER_FETCHED;
    } else {
      response.message = newsletterMessage.NEWSLETTER_NOT_FETCHED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: occasionController: getAllNewsletters`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// updateNewsletter
module.exports.updateNewsletter = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await newsLetterService.updateNewsletter({
      id: req.params.id,
      body: req.body,
    });
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = newsletterMessage.NEWSLETTER_UPDATED;
    } else {
      response.message = newsletterMessage.NEWSLETTER_NOT_UPDATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: occasionController: updateNewsletter`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// deleteNewsletter
module.exports.deleteNewsletter = async (req, res) => {
  const response = { ...defaultServerResponse };
  try {
    const serviceResponse = await newsLetterService.deleteNewsletter(
      req.params
    );
    if (serviceResponse) {
      response.body = serviceResponse;
      response.status = 200;
      response.message = newsletterMessage.NEWSLETTER_DELETED;
    } else {
      response.message = newsletterMessage.NEWSLETTER_NOT_DELETED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: occasionController: deleteNewsletter`,
      error.message
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};
