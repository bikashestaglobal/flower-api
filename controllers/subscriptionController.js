const subscriptionService = require("../services/subscriptionService");
const constants = require("../constants");

/*
 ******************************
 ********CUSTOMER BLOCK********
 ******************************
 */

// createSubscription
module.exports.createSubscription = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await subscriptionService.createSubscription({
      ...req.body,
      customer: req.params.customerId,
    });

    response.status = 200;
    response.message = constants.subscriptionMessage.SUBSCRIPTION_CREATED;
    response.body = { id: serviceResponse._id };
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : subscriptionController: createSubscription`
    );
  }
  res.status(response.status).send(response);
};

// getCustomersAllSubscriptions
module.exports.getCustomersAllSubscriptions = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse =
      await subscriptionService.getCustomersAllSubscriptions({
        customerId: req.params.customerId,
        ...req.query,
      });

    response.status = 200;
    response.message = constants.subscriptionMessage.SUBSCRIPTION_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : subscriptionController: getCustomersAllSubscriptions`
    );
  }
  res.status(response.status).send(response);
};

// getCustomersSubscriptionDetails
module.exports.getCustomersSubscriptionDetails = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse =
      await subscriptionService.getCustomersSubscriptionDetails(req.params);

    response.status = 200;
    response.message = constants.subscriptionMessage.SUBSCRIPTION_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : subscriptionController: getCustomersSubscriptionDetails`
    );
  }
  res.status(response.status).send(response);
};

// cancelCustomerSubscription
module.exports.cancelCustomerSubscription = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse =
      await subscriptionService.cancelCustomerSubscription({
        ...req.params,
        ...req.body,
      });

    response.status = 200;
    response.message = constants.subscriptionMessage.SUBSCRIPTION_CANCELLED;
    response.body = { id: serviceResponse._id };
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : subscriptionController: cancelCustomerSubscription`
    );
  }
  res.status(response.status).send(response);
};

// renewalSubscription
module.exports.renewalSubscription = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await subscriptionService.renewalSubscription({
      ...req.body,
      customer: req.params.customerId,
      id: req.params.id,
    });

    response.status = 200;
    response.message = constants.subscriptionMessage.SUBSCRIPTION_RENEWAL;
    response.body = { id: serviceResponse._id };
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : subscriptionController: renewalSubscription`
    );
  }
  res.status(response.status).send(response);
};

/*
 ******************************
 *****END CUSTOMER BLOCK*******
 ******************************
 */

/*
 ******************************
 ********ADMIN BLOCK********
 ******************************
 */

// updateSubscriptionByAdmin
module.exports.updateSubscriptionByAdmin = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await subscriptionService.updateSubscriptionByAdmin(
      {
        id: req.params.id,
        body: req.body,
      }
    );

    response.status = 200;
    response.message = constants.subscriptionMessage.SUBSCRIPTION_UPDATED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : subscriptionController:  updateSubscriptionByAdmin`
    );
  }
  res.status(response.status).send(response);
};

// getAllSubscriptions
module.exports.getAllSubscriptions = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await subscriptionService.getAllSubscriptions(
      req.query
    );
    response.status = 200;
    response.message = constants.subscriptionMessage.SUBSCRIPTION_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : subscriptionController: getAllSubscriptions`
    );
  }
  res.status(response.status).send(response);
};

// getSubscriptionById
module.exports.getSubscriptionById = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await subscriptionService.getSubscriptionById(
      req.params
    );

    response.status = 200;
    response.message = constants.subscriptionMessage.SUBSCRIPTION_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : subscriptionController : getSubscriptionById`
    );
  }
  res.status(response.status).send(response);
};

// deleteSubscription
module.exports.deleteSubscription = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await subscriptionService.deleteSubscription(
      req.params
    );
    response.status = 200;
    response.message = constants.subscriptionMessage.SUBSCRIPTION_DELETED;
    response.body = {};
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : subscriptionController:  deleteSubscription`
    );
  }
  res.status(response.status).send(response);
};

/*
 ******************************
 *******END ADMIN BLOCK********
 ******************************
 */
