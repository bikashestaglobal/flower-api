const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    shippingAddress: {
      name: String,
      mobile: String,
      email: String,
      alternateMobile: String,
      city: String,
      address: String,
      pincode: Number,
      landmark: String,
      additionalInfo: String,
    },
    bucketDetails: {
      bucket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bucket",
      },
      name: { type: String, required: true, trim: true },
      slug: { type: String, required: true, trim: true },
      image: { type: String },
      monday: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
      tuesday: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
      wednesday: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
      thursday: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
      friday: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
      saturday: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
      sunday: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    },
    coupon: {
      type: Object,
    },
    discountWithCoupon: Number,
    specialDiscount: {
      type: Object,
    },
    specialDiscountAmount: Number,
    deliveryAmount: Number,
    subtotalAmount: Number,
    totalAmount: Number,

    paymentMethod: String,
    paymentStatus: { type: Boolean, default: false },
    paymentId: String,
    razorpayPaymentId: String,
    razorpayOrderId: String,

    subscriptionStatus: {
      type: String,
      enum: ["ORDERPLACED", "RENEWAL", "RUNNING", "EXPIRED", "CANCELLED"],
      default: "ORDERPLACED",
    },
    subscriptionStartDate: {
      type: Date,
      required: true,
    },
    subscriptionExpiryDate: {
      type: Date,
      required: true,
    },
    cancelledBy: {
      type: String,
      enum: ["USER", "ADMIN", "SUPERVISOR"],
    },
    cancelMessage: String,
    numberOfSkipDays: {
      type: Number,
      default: 0,
    },

    status: { type: Boolean, default: true },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("subscription", subscriptionSchema);
