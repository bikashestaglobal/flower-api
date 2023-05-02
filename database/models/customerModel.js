const mongoose = require("mongoose");
// const orderModel = require("./orderModel");

const modelSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, required: true, unique: true },
    mobile: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    shippingAddresses: [
      {
        name: String,
        mobile: String,
        alternateMobile: String,
        city: String,
        email: String,
        address: String,
        pincode: Number,
        additionalInfo: String,
        landmark: String,
        addressType: {
          type: String,
          enum: ["HOME", "OFFICE"],
        },
        defaultAddress: {
          type: Boolean,
          default: false,
        },
      },
    ],
    otp: { type: String, trim: true },
    otpExpiredAt: { type: Date, trim: true },
    status: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.password;
        delete ret.__v;
        delete ret.otp;
        delete ret.otpExpiredAt;
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

// Delete all orders related to this Customer
// modelSchema.pre(
//   "remove",
//   { document: true, query: false },
//   async function (next) {
//     await orderModel.deleteMany({ customerId: this._id });
//     next();
//   }
// );

module.exports = mongoose.model("customer", modelSchema);
