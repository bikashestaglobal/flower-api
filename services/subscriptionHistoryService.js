const subscriptionHistoryModel = require("../database/models/subscriptionHistoryModel");
const constants = require("../constants");
const dbHelpers = require("../helpers/dbHelper");

/*
 ******************************
 ********CUSTOMER BLOCK********
 ******************************
 */

// createSubscriptionHistory
module.exports.createSubscriptionHistory = async (serviceData) => {
  try {
    const newData = new subscriptionHistoryModel(serviceData);
    const result = await newData.save();
    if (result) {
      // Push to subscription history
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(
        constants.subscriptionHistoryMessage.SUBSCRIPTION_HISTORY_NOT_CREATED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionHistoryService:  createSubscriptionHistory`,
      error.message
    );
    throw new Error(error);
  }
};

// getCustomersAllSubscriptionHistory
module.exports.getCustomersAllSubscriptionHistory = async (serviceData) => {
  try {
    const {
      limit = 10,
      skip = 0,
      subscriptionStatus,
      subscriptionId,
    } = serviceData;
    let conditions = {
      customer: serviceData.customerId,
    };

    // Check Subscription Status
    if (subscriptionStatus) conditions.subscriptionStatus = subscriptionStatus;
    if (subscriptionStatus == "All") delete conditions.subscriptionStatus;

    const result = await subscriptionHistoryModel
      .find(conditions)
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "subscription" })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(
        constants.subscriptionHistoryMessage.SUBSCRIPTION_HISTORY_NOT_FETCHED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionHistoryService: getCustomersAllSubscriptionHistory`,
      error.message
    );
    throw new Error(error);
  }
};

// getCustomersSubscriptionHistoryById
module.exports.getCustomersSubscriptionHistoryById = async (serviceData) => {
  try {
    const { id, customerId } = serviceData;
    let conditions = {
      customer: customerId,
      _id: id,
    };

    const result = await subscriptionHistoryModel
      .find(conditions)
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "subscription" });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(
        constants.subscriptionHistoryMessage.SUBSCRIPTION_HISTORY_NOT_FETCHED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionHistoryService: getCustomersSubscriptionHistoryById`,
      error.message
    );
    throw new Error(error);
  }
};

/*
 ******************************
 *****END CUSTOMER BLOCK*******
 ******************************
 */

/*
 ******************************
 **********ADMIN BLOCK*********
 ******************************
 */

// getSubscriptionHistoryById
module.exports.getSubscriptionHistoryById = async (serviceData) => {
  try {
    const result = await subscriptionHistoryModel
      .findOne({ _id: serviceData.id })
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "subscription", select: "name defaultImage" });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(
        constants.subscriptionHistoryMessage.SUBSCRIPTION_HISTORY_NOT_FETCHED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionHistoryService: getSubscriptionHistoryById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllSubscriptionHistory
module.exports.getAllSubscriptionHistory = async (serviceData) => {
  let conditions = {};
  const {
    limit = 10,
    skip = 0,
    status = true,
    subscriptionStatus,
    customerId,
    subscriptionId,
  } = serviceData;

  // Check Subscription Status
  if (subscriptionStatus) conditions.subscriptionStatus = subscriptionStatus;
  if (subscriptionStatus == "All") delete conditions.subscriptionStatus;
  if (customerId) conditions.customer = customerId;
  if (subscriptionId) conditions.subscription = subscriptionId;

  try {
    const result = await subscriptionHistoryModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "subscription" })
      .sort({ createdAt: -1 });

    if (result) {
      let formatedData = dbHelpers.formatMongoData(result);
      return formatedData;
    } else {
      throw new Error(
        constants.subscriptionHistoryMessage.SUBSCRIPTION_HISTORY_NOT_FETCHED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionHistoryService: getAllSubscriptionHistory`,
      error.message
    );
    throw new Error(error);
  }
};

/*
 ******************************
 *******END ADMIN BLOCK********
 ******************************
 */
