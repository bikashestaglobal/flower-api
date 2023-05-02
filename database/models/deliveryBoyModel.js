const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, trim: true, required: true },
    pincodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pincode",
      },
    ],
    otp: { type: String, trim: true },
    otpExpiredAt: { type: Date, trim: true },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiredAt;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("deliveryBoy", modelSchema);
