const mongoose = require("mongoose");
const date = require("date-and-time");
const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    occasion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "occasion",
    },
    image: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },
    seoTitle: {
      type: String,
      default: "",
      trim: true,
    },
    seoDescription: {
      type: String,
      default: "",
      trim: true,
    },
    seoTags: {
      type: String,
      default: "",
      trim: true,
    },
    monday: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    tuesday: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    wednesday: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    thursday: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    friday: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    saturday: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    sunday: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    sellingPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    mrp: {
      type: Number,
      default: 0,
      required: true,
    },
    validity: {
      type: Number,
      default: 7,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        ret.createdAt = date.format(new Date(ret.createdAt), "DD-MM-YYYY");
        ret.updatedAt = date.format(new Date(ret.updatedAt), "DD-MM-YYYY");
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("bucket", modelSchema);
