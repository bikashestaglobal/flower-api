const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscription",
      required: true,
    },
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "deliveryBoy",
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["DELIVERED", "SKIPPED", "CANCELLED"],
    },
    createdBy: {
      type: String,
      enum: ["USER", "ADMIN", "SUPERVISOR", "DELIVERY_BOY"],
    },
    deliveryNotes: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("deliveryDetails", modelSchema);
