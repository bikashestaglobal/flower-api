const deliveryDetailsService = require("../services/deliveryDetailsService");
const constants = require("../constants");

/*
 ******************************
 ********CUSTOMER BLOCK********
 ******************************
 */

// createDeliveryDetailsByCustomer
module.exports.createDeliveryDetailsByCustomer = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse =
      await deliveryDetailsService.createDeliveryDetailsByCustomer({
        ...req.body,
        createdBy: "USER",
        customer: req.params.customerId,
      });

    response.status = 200;
    response.message =
      constants.deliveryDetailsMessage.DELIVERY_DETAILS_CREATED;
    response.body = { id: serviceResponse._id };
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : deliveryDetailsController: createDeliveryDetailsByCustomer`
    );
  }
  res.status(response.status).send(response);
};

// getAllDeliveryDetailsByCustomer
module.exports.getAllDeliveryDetailsByCustomer = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse =
      await deliveryDetailsService.getAllDeliveryDetailsByCustomer({
        customerId: req.params.customerId,
        ...req.query,
      });

    response.status = 200;
    response.message =
      constants.deliveryDetailsMessage.DELIVERY_DETAILS_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : deliveryDetailsController: getAllDeliveryDetailsByCustomer`
    );
  }
  res.status(response.status).send(response);
};

// getDeliveryDetailsByIdByCustomer
module.exports.getDeliveryDetailsByIdByCustomer = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse =
      await deliveryDetailsService.getDeliveryDetailsByIdByCustomer(req.params);
    response.status = 200;
    response.message =
      constants.deliveryDetailsMessage.DELIVERY_DETAILS_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : deliveryDetailsController: getDeliveryDetailsByIdByCustomer`
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
 COMMON FOR ADMIN & SUPERVISOR
 ******************************
 */

// createDeliveryDetails
module.exports.createDeliveryDetails = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await deliveryDetailsService.createDeliveryDetails(
      req.body
    );
    response.status = 200;
    response.message =
      constants.deliveryDetailsMessage.DELIVERY_DETAILS_CREATED;
    response.body = { id: serviceResponse._id };
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : deliveryDetailsController: createDeliveryDetails`
    );
  }
  res.status(response.status).send(response);
};

// getDeliveryDetailsById
module.exports.getDeliveryDetailsById = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await deliveryDetailsService.getDeliveryDetailsById(
      req.params
    );

    response.status = 200;
    response.message =
      constants.deliveryDetailsMessage.DELIVERY_DETAILS_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : sdeliveryDetailsontroller : getDeliveryDetailsById`
    );
  }
  res.status(response.status).send(response);
};

// getAllDeliveryDetails
module.exports.getAllDeliveryDetails = async (req, res) => {
  const response = { ...constants.defaultServerResponse };
  try {
    const serviceResponse = await deliveryDetailsService.getAllDeliveryDetails(
      req.query
    );
    response.status = 200;
    response.message =
      constants.deliveryDetailsMessage.DELIVERY_DETAILS_FETCHED;
    response.body = serviceResponse;
  } catch (error) {
    response.message = error.message;
    console.log(
      `Something went Wrong Controller : deliveryDetailsController: getAllDeliveryDetails`
    );
  }
  res.status(response.status).send(response);
};

// deleteSubscription
// module.exports.deleteSubscription = async (req, res) => {
//   const response = { ...constants.defaultServerResponse };
//   try {
//     const serviceResponse = await deliveryDetailsService.deleteSubscription(
//       req.params
//     );
//     response.status = 200;
//     response.message =
//       constants.deliveryDetailsMessage.DELIVERY_DETAILS_DELETED;
//     response.body = {};
//   } catch (error) {
//     response.message = error.message;
//     console.log(
//       `Something went Wrong Controller : deliveryDetailsController:  deleteSubscription`
//     );
//   }
//   res.status(response.status).send(response);
// };

/*
 ******************************
 *******END ADMIN BLOCK********
 ******************************
 */
