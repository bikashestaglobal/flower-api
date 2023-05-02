const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    slug: {
      type: String,
      default: "",
      trim: true,
      unique: true,
    },
    mrp: {
      type: Number,
      default: 0,
      required: true,
    },
    sellingPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    sku: {
      type: String,
      default: "",
      unique: true,
      trim: true,
    },
    maximumOrderQuantity: {
      type: Number,
      default: 2,
    },

    defaultImage: {
      type: String,
      default: "",
      trim: true,
    },
    images: [
      {
        type: String,
        default: "",
        trim: true,
      },
    ],
    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    occasion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "occasion",
    },
    tagLine: {
      type: String,
      enum: ["HOT", "SALE", "BESTSELLER"],
    },

    // SEO Details
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
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("product", modelSchema);
