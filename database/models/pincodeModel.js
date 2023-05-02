const mongoose = require("mongoose");
const date = require("date-and-time");
const modelSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      unique: true,
    },

    state: {
      type: String,
      default: "",
      required: false,
      trim: true,
    },
    city: {
      type: String,
      default: "",
      required: false,
      trim: true,
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
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("pincode", modelSchema);
