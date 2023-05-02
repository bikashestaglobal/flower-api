const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    minimumOrderAmount: {
      type: Number,
      default: 500,
    },
    deliveryCharge: [
      {
        charge: Number,
        maxAmount: Number,
      },
    ],

    slider: [
      {
        title: String,
        subTitle: String,
        btnText: String,
        textColor: String,
        btnBgColor: String,
        btnTextColor: String,
        text: String,
        image: String,
        position: Number,
        url: String,
        status: {
          type: Boolean,
          default: true,
        },
      },
    ],

    nextToSlider: {
      title: String,
      image: String,
      webpageUrl: String,
    },

    bestSaleBanner: {
      title: String,
      image: String,
      webpageUrl: String,
    },

    categoryBanner: [
      {
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "parentCategory",
        },
        image: String,
        webpageUrl: String,
      },
    ],

    offerBanner: [
      {
        title: String,
        subTitle: String,
        btnText: String,
        textColor: String,
        btnTextColor: String,
        image: String,
        position: Number,
        webpageUrl: String,
        status: {
          type: Boolean,
          default: true,
        },
      },
    ],
    breadcrumbBanner: [
      {
        textColor: String,
        image: String,
        webpageUrl: String,
      },
    ],
    contactUs: {
      mobile: {
        type: String,
        default: "",
        trim: true,
      },
      customerCareNumber: {
        type: String,
        default: "",
        trim: true,
      },
      whatsappNumber: {
        type: String,
        default: "",
        trim: true,
      },
      email: {
        type: String,
        default: "",
        trim: true,
      },
      supportEmail: {
        type: String,
        default: "",
        trim: true,
      },
      address: {
        type: String,
        default: "",
        trim: true,
      },
      googleMapUrl: {
        type: String,
        default: "",
        trim: true,
      },
    },
    socialMedia: {
      facebook: {
        type: String,
        default: "",
        trim: true,
      },
      twitter: {
        type: String,
        default: "",
        trim: true,
      },
      instagram: {
        type: String,
        default: "",
        trim: true,
      },
      youtube: {
        type: String,
        default: "",
        trim: true,
      },
      youtube: {
        type: String,
        default: "",
        trim: true,
      },
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

module.exports = mongoose.model("setting", modelSchema);
