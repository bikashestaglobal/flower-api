const subscriptionModel = require("../database/models/subscriptionModel");
const constants = require("../constants");
const dbHelpers = require("../helpers/dbHelper");
const subscriptionHistoryModel = require("../database/models/subscriptionHistoryModel");
/*
 ******************************
 ********CUSTOMER BLOCK********
 ******************************
 */

// createSubscription
module.exports.createSubscription = async (serviceData) => {
  try {
    serviceData.paymentStatus =
      serviceData.paymentMethod == "COD" ? false : true;

    const newData = new subscriptionModel(serviceData);
    const result = await newData.save();
    if (result) {
      // Push to subscription history
      const history = new subscriptionHistoryModel({
        customer: result.customer,
        subscription: result._id,
        subscriptionStatus: "ORDERPLACED",
        subscriptionExpiryDate: result.subscriptionExpiryDate,
        subscriptionStartDate: result.subscriptionStartDate,
        message: "Subscription Purchased",
        createdBy: "USER",
      });
      const historyResponse = await history.save();

      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.subscriptionMessage.SUBSCRIPTION_NOT_CREATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionService:  createSubscription`,
      error.message
    );
    throw new Error(error);
  }
};

// getCustomersAllSubscriptions
module.exports.getCustomersAllSubscriptions = async (serviceData) => {
  try {
    const { limit = 10, skip = 0, subscriptionStatus } = serviceData;
    let conditions = {
      status: true,
      isDeleted: false,
      customer: serviceData.customerId,
    };

    // Check Subscription Status
    if (subscriptionStatus) conditions.subscriptionStatus = subscriptionStatus;
    if (subscriptionStatus == "All") delete conditions.subscriptionStatus;

    const result = await subscriptionModel
      .find(conditions)
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "bucketDetails.monday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.tuesday", select: "name defaultImage" })
      .populate({
        path: "bucketDetails.wednesday",
        select: "name defaultImage",
      })
      .populate({ path: "bucketDetails.thursday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.friday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.friday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.saturday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.sunday", select: "name defaultImage" })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.subscriptionMessage.SUBSCRIPTION_NOT_FETCHED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionService: getCustomersAllSubscriptions`,
      error.message
    );
    throw new Error(error);
  }
};

// getCustomersSubscriptionDetails
module.exports.getCustomersSubscriptionDetails = async (serviceData) => {
  try {
    const { id, customerId } = serviceData;
    let conditions = {
      status: true,
      isDeleted: false,
      customer: customerId,
      _id: id,
    };

    const result = await subscriptionModel
      .find(conditions)
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "bucketDetails.monday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.tuesday", select: "name defaultImage" })
      .populate({
        path: "bucketDetails.wednesday",
        select: "name defaultImage",
      })
      .populate({ path: "bucketDetails.thursday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.friday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.friday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.saturday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.sunday", select: "name defaultImage" });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.subscriptionMessage.SUBSCRIPTION_NOT_FETCHED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionService: getCustomersSubscriptionDetails`,
      error.message
    );
    throw new Error(error);
  }
};

// cancelCustomerSubscription
module.exports.cancelCustomerSubscription = async (serviceData) => {
  try {
    const { id, customerId, cancelMessage } = serviceData;

    const data = {
      cancelMessage,
      cancelledBy: "USER",
      subscriptionStatus: "CANCELLED",
    };

    const result = await subscriptionModel.findOneAndUpdate(
      {
        _id: id,
        customer: customerId,
      },
      data,
      { new: true }
    );

    if (result) {
      // Push to subscription history
      const history = new subscriptionHistoryModel({
        customer: result.customer,
        subscription: result._id,
        subscriptionStatus: "CANCELLED",
        message: "Subscription Cancelled",
        cancelledBy: "USER",
        createdBy: "USER",
      });
      const historyResponse = await history.save();

      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.subscriptionMessage.SUBSCRIPTION_NOT_CANCELLED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionService: cancelCustomerSubscription`,
      error.message
    );
    throw new Error(error);
  }
};

// renewalSubscription
module.exports.renewalSubscription = async (serviceData) => {
  try {
    // get old subscription details
    const { id, customer } = serviceData;

    const oldSubscription = await subscriptionModel.findOne({
      _id: id,
      customer,
    });

    if (!oldSubscription) {
      // Throw an error
      throw new Error(constants.subscriptionMessage.SUBSCRIPTION_NOT_FOUND);
    }

    let subscriptionStartDate = new Date(
      oldSubscription.subscriptionExpiryDate
    );
    subscriptionStartDate.setDate(subscriptionStartDate.getDate() + 1);

    const newServiceData = {
      customer,
      shippingAddress: oldSubscription.shippingAddress,
      bucketDetails: oldSubscription.bucketDetails,
      coupon: serviceData.coupon,
      discountWithCoupon: serviceData.discountWithCoupon,
      specialDiscount: serviceData.specialDiscount,
      specialDiscountAmount: serviceData.specialDiscountAmount,
      deliveryAmount: serviceData.deliveryAmount,
      subtotalAmount: serviceData.subtotalAmount,
      totalAmount: serviceData.totalAmount,
      paymentMethod: serviceData.paymentMethod,
      paymentId: serviceData.paymentId,
      razorpayPaymentId: serviceData.razorpayPaymentId,
      razorpayOrderId: serviceData.razorpayOrderId,
      subscriptionStatus: "RENEWAL",
      subscriptionStartDate: subscriptionStartDate,
      subscriptionExpiryDate: serviceData.subscriptionExpiryDate,
      paymentStatus: serviceData.paymentMethod == "COD" ? false : true,
    };

    const newData = new subscriptionModel(newServiceData);
    const result = await newData.save();
    if (result) {
      // Push to subscription history
      const history = new subscriptionHistoryModel({
        customer: result.customer,
        subscription: result._id,
        subscriptionStatus: "RENEWAL",
        subscriptionStartDate: result.subscriptionStartDate,
        subscriptionExpiryDate: result.subscriptionExpiryDate,
        message: "Subscription Renewal",
        createdBy: "USER",
      });
      const historyResponse = await history.save();

      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.subscriptionMessage.SUBSCRIPTION_NOT_RENEWAL);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionService:  renewalSubscription`,
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

// getSubscriptionById
module.exports.getSubscriptionById = async (serviceData) => {
  try {
    const result = await subscriptionModel
      .findOne({ _id: serviceData.id })
      .populate({ path: "customer", select: "firstName" })
      .populate({ path: "bucketDetails.monday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.tuesday", select: "name defaultImage" })
      .populate({
        path: "bucketDetails.wednesday",
        select: "name defaultImage",
      })
      .populate({ path: "bucketDetails.thursday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.friday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.friday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.saturday", select: "name defaultImage" })
      .populate({ path: "bucketDetails.sunday", select: "name defaultImage" });

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.subscriptionMessage.SUBSCRIPTION_NOT_FETCHED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionService: getSubscriptionById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllSubscriptions
module.exports.getAllSubscriptions = async (serviceData) => {
  let conditions = {};
  const {
    limit = 10,
    skip = 0,
    searchQuery,
    status = true,
    subscriptionStatus,
  } = serviceData;
  // Search query is available
  //   if (searchQuery) {
  //     conditions = {
  //       $or: [
  //         { name: { $regex: searchQuery, $options: "i" } },
  //         { slug: { $regex: searchQuery, $options: "i" } },
  //         { description: { $regex: searchQuery, $options: "i" } },
  //       ],
  //     };
  //   }

  // Check status
  if (status == "All") {
    delete conditions.status;
  } else {
    conditions.status = status;
  }

  // Check Subscription Status
  if (subscriptionStatus) conditions.subscriptionStatus = subscriptionStatus;
  if (subscriptionStatus == "All") delete conditions.subscriptionStatus;

  // If slug is available
  //   if (slug) {
  //     conditions.slug = slug;
  //   }

  // If category is available
  //   if (category) {
  //     conditions.category = category;
  //   }

  // If occasion is available
  //   if (occasion) {
  //     conditions.occasion = occasion;
  //   }

  try {
    const result = await subscriptionModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate({ path: "customer", select: "firstName" })
      .sort({ createdAt: -1 });

    if (result) {
      let formatedData = dbHelpers.formatMongoData(result);
      return formatedData;
    } else {
      throw new Error(constants.subscriptionMessage.SUBSCRIPTION_NOT_FETCHED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionService: getAllSubscriptions`,
      error.message
    );
    throw new Error(error);
  }
};

// updateSubscriptionByAdmin
module.exports.updateSubscriptionByAdmin = async (serviceData) => {
  try {
    const { id, body } = serviceData;

    const result = await subscriptionModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (result) {
      // Push to subscription history
      const history = new subscriptionHistoryModel({
        customer: result.customer,
        subscription: result._id,
        subscriptionStatus: body.subscriptionStatus,
        createdBy: "ADMIN",
      });

      // Add message
      if (body.subscriptionStatus == "CONFIRMED")
        history.message = "Subscription Confirmed";
      if (body.subscriptionStatus == "RUNNING")
        history.message = "Subscription Runnig";
      if (body.subscriptionStatus == "EXPIRED")
        history.message = "Subscription Expired";
      if (body.subscriptionStatus == "CANCELLED") {
        history.message = "Subscription Cancelled";
        history.cancelledBy = "ADMIN";
      }
      if (body.subscriptionStatus == "EXTENDED") {
        history.message = "Subscription Extended";
        history.subscriptionExpiryDate = body.subscriptionExpiryDate;
      }
      // if (body.subscriptionStatus == "RENEWAL") {
      //   history.message = "Subscription Renewal";
      //   history.subscriptionExpiryDate = body.subscriptionExpiryDate;
      // }
      const historyResponse = await history.save();

      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.subscriptionMessage.SUBSCRIPTION_NOT_UPDATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionService:  updateSubscriptionByAdmin`,
      error.message
    );
    throw new Error(error);
  }
};

// deleteSubscription
module.exports.deleteSubscription = async ({ id }) => {
  try {
    const result = await subscriptionModel.findOneAndUpdate(
      { _id: id },
      {
        isDeleted: true,
        status: false,
      },
      { new: true }
    );

    if (result) {
      return dbHelpers.formatMongoData(result);
    } else {
      throw new Error(constants.subscriptionMessage.SUBSCRIPTION_NOT_DELETED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: subscriptionService: deleteSubscription`,
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
