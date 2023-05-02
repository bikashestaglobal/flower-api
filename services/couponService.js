const couponModel = require("../database/models/couponModel");
const subscriptionModel = require("../database/models/subscriptionModel");
const constants = require("../constants");
const dbHelper = require("../helpers/dbHelper");
const date = require("date-and-time");

// createCoupon
module.exports.createCoupon = async (serviceData) => {
  try {
    const { couponCode } = serviceData;
    // get coupon details
    const checkCoupon = await couponModel.findOne({ couponCode });

    if (checkCoupon) throw new Error(constants.couponMessage.COUPON_EXISTS);

    // Save to the database
    const coupon = new couponModel(serviceData);
    const result = await coupon.save();
    if (result) {
      return dbHelper.formatMongoData(result);
    } else {
      throw new Error(constants.couponMessage.COUPON_NOT_CREATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: couponService: createCoupon`,
      error.message
    );
    throw new Error(error);
  }
};

// updateCoupon
module.exports.updateCoupon = async (serviceData) => {
  try {
    const { id, body } = serviceData;
    // Check id is valid or not
    if (!dbHelper.checkMongoObject(id)) {
      throw new Error(constants.databaseMessage.INVALID_OBJECTID);
    }

    const result = await couponModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (result) {
      return dbHelper.formatMongoData(result);
    } else {
      throw new Error(constants.couponMessage.COUPON_NOT_UPDATED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: couponService:  updateCoupon`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllCoupons
module.exports.getAllCoupons = async ({
  limit = 10,
  skip = 0,
  status = true,
  searchQuery,
  applyFor,
  discountType,
}) => {
  let condition = {
    isDeleted: false,
  };

  if (searchQuery) {
    condition = {
      $or: [
        { couponCode: { $regex: searchQuery, $options: "i" } },
        { applyFor: { $regex: searchQuery, $options: "i" } },
        { discountType: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }

  if (status == "All") {
    delete condition.status;
  } else {
    condition.status = status;
  }

  if (applyFor) condition.applyFor = applyFor;
  if (discountType) condition.discountType = discountType;

  try {
    const result = await couponModel
      .find(condition)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    if (result) {
      return dbHelper.formatMongoData(result);
    } else {
      throw new Error(constants.couponMessage.COUPON_NOT_FETCHED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: couponService: getAllCoupons`,
      error.message
    );
    throw new Error(error);
  }
};

// validateCoupon
module.exports.validateCoupon = async (serviceData) => {
  try {
    const { couponCode, customerId } = serviceData;

    // Get All Sunscription
    const subscriptionDetails = await subscriptionModel.find({
      customer: customerId,
    });

    const today = date.format(new Date(), "YYYY-MM-DD");

    condition = {
      $and: [
        { expiryDate: { $gte: today } },
        {
          startDate: { $lte: today },
        },
        { couponCode: couponCode },
        { status: true },
        { isDeleted: false },
      ],
    };

    console.log(condition);

    // Get Coupon
    const coupon = await couponModel.findOne(condition);

    if (coupon) {
      // For New User
      if (coupon.applyFor == "NEW_USER") {
        if (subscriptionDetails.length) {
          throw new Error("Coupon is Valid for Only New User");
        } else {
          return dbHelper.formatMongoData(coupon);
        }
      }

      if (coupon.applyFor == "EXISTING_USER" || coupon.applyFor == "ALL_USER") {
        const filterSubscription = subscriptionDetails.filter((subs) => {
          if (subs.coupon) {
            return subs.coupon.couponCode == couponCode;
          }
        });

        if (filterSubscription.length >= coupon.numberOfUsesTimes) {
          throw new Error("Sorry You already used this coupon code");
        } else {
          return dbHelper.formatMongoData(coupon);
        }
      }

      // console.log("coupon", coupon);
      return dbHelper.formatMongoData(coupon);
    } else {
      throw new Error(constants.couponMessage.COUPON_NOT_FOUND);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: couponService: validateCoupon`,
      error.message
    );
    throw new Error(error);
  }
};

// getCouponById
module.exports.getCouponById = async (serviceData) => {
  try {
    const { id } = serviceData;

    const result = await couponModel.findOne({ _id: id });
    if (result) {
      return dbHelper.formatMongoData(result);
    } else {
      throw new Error(constants.couponMessage.COUPON_NOT_FOUND);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: couuponService: getCouponById`,
      error.message
    );
    throw new Error(error);
  }
};

// deleteCoupon
module.exports.deleteCoupon = async ({ id }) => {
  try {
    const result = await couponModel.findOneAndUpdate(
      { _id: id },
      {
        status: false,
        isDeleted: true,
      },
      {
        new: true,
      }
    );
    if (result) {
      return dbHelper.formatMongoData(result);
    } else {
      throw new Error(constants.couponMessage.COUPON_NOT_DELETED);
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: couponService: deleteCoupon`,
      error.message
    );
    throw new Error(error);
  }
};
