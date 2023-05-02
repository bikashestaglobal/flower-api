const deliveryDetailsModal = require("../database/models/deliveryDetailsModal");
const subscriptionModel = require("../database/models/subscriptionModel");
const subscriptionService = require("./subscriptionService");
const subscriptionHistoryService = require("./subscriptionHistoryService");
const constants = require("../constants");
const dbHelpers = require("../helpers/dbHelper");

/*
 ******************************
 ******* COMMON FOR ALL *******
 ******************************
 */

// createDeliveryDetails
module.exports.createDeliveryDetails = async (serviceData) => {
  try {
    // if deliveryStatus is SKIPPED
    if (serviceData.deliveryStatus == "SKIPPED") {
      const customerDeliveryDetails =
        await this.getAllDeliveryDetailsByCustomer({
          deliveryStatus: serviceData.deliveryStatus,
          subscriptionId: serviceData.subscription,
          customerId: serviceData.customer,
        });

      if (customerDeliveryDetails.length >= 2) {
        throw new Error("Sorry customer already skipped two delivery days");
      }

      let currentDateTime = new Date();
      let deliveryDateTime = new Date(serviceData.deliveryDate);
      var timeDifference =
        (deliveryDateTime.getTime() - currentDateTime.getTime()) /
        1000 /
        60 /
        60;

      if (timeDifference <= 24) {
        throw new Error(
          "Sorry you can skip the delivery before 24 hours of the delivery"
        );
      }
      // Get Subscription Details
      const subscriptionData = await subscriptionService.getSubscriptionById({
        id: serviceData.subscription,
      });

      // Get subscription expiry date
      let subscriptionNewExpiryDate = new Date(
        subscriptionData.subscriptionExpiryDate
      );
      subscriptionNewExpiryDate.setDate(
        subscriptionNewExpiryDate.getDate() + 1
      );

      // Update the Subscription
      const updateSubscription = await subscriptionModel.findOneAndUpdate(
        {
          _id: serviceData.subscription,
        },
        {
          subscriptionExpiryDate: subscriptionNewExpiryDate,
          numberOfSkipDays: Number(subscriptionData.numberOfSkipDays) + 1,
        }
      );

      // create subscription history
      const createSubscription =
        await subscriptionHistoryService.createSubscriptionHistory({
          customer: serviceData.customer,
          subscription: serviceData.subscription,
          subscriptionStatus: "EXTEND",
          subscriptionStartDate: updateSubscription.subscriptionStartDate,
          subscriptionExpiryDate: updateSubscription.subscriptionExpiryDate,
          subscriptionNewExpiryDate: subscriptionNewExpiryDate,
          message: "Subscription Extended",
          createdBy: serviceData.createdBy,
        });
    } else if (serviceData.deliveryStatus == "CANCELLED") {
    }

    // Check given date is exist or not
    const checkDeliveryDetails = await deliveryDetailsModal.findOne({
      deliveryDate: {
        $eq: new Date(serviceData.deliveryDate),
      },
    });
    if (checkDeliveryDetails) {
      throw new Error("Sorry delivery details already updated");
    }

    const newData = new deliveryDetailsModal(serviceData);
    const result = await newData.save();
    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(
        constants.deliveryDetailsMessage.DELIVERY_DETAILS_NOT_CREATED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryDetailsService:  createDeliveryDetails`,
      error.message
    );
    throw new Error(error);
  }
};

/*
 ******************************
 ********** END BLOCK *********
 ******************************
 */

/*
 ******************************
 ********CUSTOMER BLOCK********
 ******************************
 */

// createDeliveryDetailsByCustomer
module.exports.createDeliveryDetailsByCustomer = async (serviceData) => {
  try {
    // if deliveryStatus is SKIPPED
    if (serviceData.deliveryStatus == "SKIPPED") {
      const customerDeliveryDetails =
        await this.getAllDeliveryDetailsByCustomer({
          deliveryStatus: serviceData.deliveryStatus,
          subscriptionId: serviceData.subscription,
          customerId: serviceData.customer,
        });

      if (customerDeliveryDetails.length >= 2) {
        throw new Error("Sorry you already skipped two delivery days");
      }

      let currentDateTime = new Date();
      let deliveryDateTime = new Date(serviceData.deliveryDate);
      var timeDifference =
        (deliveryDateTime.getTime() - currentDateTime.getTime()) /
        1000 /
        60 /
        60;

      if (timeDifference <= 24) {
        throw new Error(
          "Sorry you can skip the delivery before 24 hours of the delivery"
        );
      }
      // Get Subscription Details
      const subscriptionData = await subscriptionService.getSubscriptionById({
        id: serviceData.subscription,
      });

      // Get subscription expiry date
      let subscriptionNewExpiryDate = new Date(
        subscriptionData.subscriptionExpiryDate
      );
      subscriptionNewExpiryDate.setDate(
        subscriptionNewExpiryDate.getDate() + 1
      );

      // Update the Subscription
      const updateSubscription = await subscriptionModel.findOneAndUpdate(
        {
          _id: serviceData.subscription,
        },
        {
          subscriptionExpiryDate: subscriptionNewExpiryDate,
          numberOfSkipDays: Number(subscriptionData.numberOfSkipDays) + 1,
        }
      );

      // create subscription history
      const createSubscription =
        await subscriptionHistoryService.createSubscriptionHistory({
          customer: serviceData.customer,
          subscription: serviceData.subscription,
          subscriptionStatus: "EXTEND",
          subscriptionStartDate: updateSubscription.subscriptionStartDate,
          subscriptionExpiryDate: updateSubscription.subscriptionExpiryDate,
          subscriptionNewExpiryDate: subscriptionNewExpiryDate,
          message: "Subscription Extended",
          createdBy: "USER",
        });
    } else if (serviceData.deliveryStatus == "CANCELLED") {
    }

    // Check given date is exist or not
    const checkDeliveryDetails = await deliveryDetailsModal.findOne({
      deliveryDate: {
        $eq: new Date(serviceData.deliveryDate),
      },
    });
    if (checkDeliveryDetails) {
      throw new Error("Sorry delivery details already updated");
    }

    // Save delivery details
    const newData = new deliveryDetailsModal(serviceData);
    const result = await newData.save();
    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(
        constants.deliveryDetailsMessage.DELIVERY_DETAILS_NOT_CREATED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryDetailsService:  createDeliveryDetailsByCustomer`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllDeliveryDetailsByCustomer
module.exports.getAllDeliveryDetailsByCustomer = async (serviceData) => {
  try {
    const {
      limit = 10,
      skip = 0,
      deliveryStatus,
      subscriptionId,
      customerId,
    } = serviceData;

    let conditions = {
      status: true,
      isDeleted: false,
      customer: customerId,
    };

    // Check Deivery Status
    if (deliveryStatus) conditions.deliveryStatus = deliveryStatus;
    if (deliveryStatus == "All") delete conditions.deliveryStatus;

    // Check subscription Id
    if (subscriptionId) conditions.subscription = subscriptionId;

    const result = await deliveryDetailsModal
      .find(conditions)
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "subscription" })
      .populate({ path: "deliveryBoy", select: "name" })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(
        constants.deliveryDetailsMessage.DELIVERY_DETAILS_NOT_FETCHED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryDetailsService: getAllDeliveryDetailsByCustomer`,
      error.message
    );
    throw new Error(error);
  }
};

// getDeliveryDetailsByIdByCustomer
module.exports.getDeliveryDetailsByIdByCustomer = async (serviceData) => {
  try {
    const { id, customerId } = serviceData;
    let conditions = {
      status: true,
      isDeleted: false,
      customer: customerId,
      _id: id,
    };

    const result = await deliveryDetailsModal
      .findOne(conditions)
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "subscription" })
      .populate({ path: "deliveryBoy", select: "name" });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(
        constants.deliveryDetailsMessage.DELIVERY_DETAILS_NOT_FETCHED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryDetailsService: getDeliveryDetailsByIdByCustomer`,
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
 COMMON For ADMIN & SUPERVISOR
 ******************************
 */

// getDeliveryDetailsById
module.exports.getDeliveryDetailsById = async (serviceData) => {
  try {
    const { id } = serviceData;
    let conditions = {
      status: true,
      isDeleted: false,
      _id: id,
    };

    const result = await deliveryDetailsModal
      .findOne(conditions)
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "subscription" })
      .populate({ path: "deliveryBoy", select: "name" });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(
        constants.deliveryDetailsMessage.DELIVERY_DETAILS_NOT_FETCHED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryDetailsService: getDeliveryDetailsById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllDeliveryDetails
module.exports.getAllDeliveryDetails = async (serviceData) => {
  try {
    const {
      limit = 10,
      skip = 0,
      deliveryStatus,
      subscriptionId,
      customerId,
      deliveryBoyId,
    } = serviceData;

    let conditions = {
      status: true,
      isDeleted: false,
    };

    // Check Deivery Status
    if (deliveryStatus) conditions.deliveryStatus = deliveryStatus;
    if (deliveryStatus == "All") delete conditions.deliveryStatus;

    // Check subscription Id
    if (subscriptionId) conditions.subscription = subscriptionId;

    // Check customer Id
    if (customerId) conditions.customer = customerId;

    // Check delivery boy
    if (deliveryBoyId) conditions.deliveryBoy = deliveryBoyId;

    console.log(conditions);

    const result = await deliveryDetailsModal
      .find(conditions)
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "subscription" })
      .populate({ path: "deliveryBoy", select: "name" })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(
        constants.deliveryDetailsMessage.DELIVERY_DETAILS_NOT_FETCHED
      );
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: deliveryDetailsService: getAllDeliveryDetails`,
      error.message
    );
    throw new Error(error);
  }
};

/*
 ******************************
 ********* END BLOCK **********
 ******************************
 */

/*
 ******************************
 **********ADMIN BLOCK*********
 ******************************
 */

// getSubscriptionById
// module.exports.getSubscriptionById = async (serviceData) => {
//   try {
//     const result = await deliveryDetailsModal
//       .findOne({ _id: serviceData.id })
//       .populate({ path: "customer", select: "firstName" })
//       .populate({ path: "bucketDetails.monday", select: "name defaultImage" })
//       .populate({ path: "bucketDetails.tuesday", select: "name defaultImage" })
//       .populate({
//         path: "bucketDetails.wednesday",
//         select: "name defaultImage",
//       })
//       .populate({ path: "bucketDetails.thursday", select: "name defaultImage" })
//       .populate({ path: "bucketDetails.friday", select: "name defaultImage" })
//       .populate({ path: "bucketDetails.friday", select: "name defaultImage" })
//       .populate({ path: "bucketDetails.saturday", select: "name defaultImage" })
//       .populate({ path: "bucketDetails.sunday", select: "name defaultImage" });

//     if (result) {
//       return dbHelpers.formatMongoData(result);
//     } else {
//       throw new Error(
//         constants.deliveryDetailsMessage.DELIVERY_DETAILS_NOT_FETCHED
//       );
//     }
//   } catch (error) {
//     console.log(
//       `Somthing Went Wrong Service: deliveryDetailsService: getSubscriptionById`,
//       error.message
//     );
//     throw new Error(error);
//   }
// };

// updateSubscriptionByAdmin
// module.exports.updateSubscriptionByAdmin = async (serviceData) => {
//   try {
//     const { id, body } = serviceData;

//     const result = await deliveryDetailsModal.findByIdAndUpdate(id, body, {
//       new: true,
//     });
//     if (result) {
//       return dbHelpers.formatMongoData(result);
//     } else {
//       throw new Error(
//         constants.deliveryDetailsMessage.DELIVERY_DETAILS_NOT_UPDATED
//       );
//     }
//   } catch (error) {
//     console.log(
//       `Somthing Went Wrong Service: deliveryDetailsService:  updateSubscriptionByAdmin`,
//       error.message
//     );
//     throw new Error(error);
//   }
// };

// deleteSubscription
// module.exports.deleteSubscription = async ({ id }) => {
//   try {
//     const result = await deliveryDetailsModal.findOneAndUpdate(
//       { _id: id },
//       {
//         isDeleted: true,
//         status: false,
//       },
//       { new: true }
//     );

//     if (result) {
//       return dbHelpers.formatMongoData(result);
//     } else {
//       throw new Error(
//         constants.deliveryDetailsMessage.DELIVERY_DETAILS_NOT_DELETED
//       );
//     }
//   } catch (error) {
//     console.log(
//       `Somthing Went Wrong Service: deliveryDetailsService: deleteSubscription`,
//       error.message
//     );
//     throw new Error(error);
//   }
// };

/*
 ******************************
 *******END ADMIN BLOCK********
 ******************************
 */
