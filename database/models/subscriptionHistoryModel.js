const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscription",
    },

    subscriptionStatus: {
      type: String,
      enum: [
        "ORDERPLACED",
        "CONFIRMED",
        "RUNNING",
        "EXPIRED",
        "CANCELLED",
        "REFUND",
        "EXTEND",
        "RENEWAL",
      ],
      default: "ORDERPLACED",
    },

    refundAmount: { type: Number },
    subscriptionStartDate: { type: Date },
    subscriptionExpiryDate: { type: Date },
    subscriptionNewExpiryDate: { type: Date },

    message: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: String,
      enum: ["USER", "ADMIN", "SUPERVISOR"],
    },

    cancelledBy: {
      type: String,
      enum: ["USER", "ADMIN", "SUPERVISOR"],
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

module.exports = mongoose.model("subscriptionHistory", modelSchema);
