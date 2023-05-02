const newsletterModel = require("../database/models/newsletterModel");
const { formatMongoData } = require("../helpers/dbHelper");
const { newsletterMessage } = require("../constants");

// createNewsletter
module.exports.createNewsletter = async (serviceData) => {
  try {
    // find first
    const newsletter = await newsletterModel.findOne({
      email: serviceData.email,
    });

    if (newsletter) {
      throw new Error(newsletterMessage.NEWSLETTER_ALREADY_EXIST);
    }

    const newData = new newsletterModel(serviceData);
    const result = await newData.save();
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: newsletterService: createNewsletter`,
      error.message
    );
    throw new Error(error);
  }
};

// getNewsletterById
module.exports.getNewsletterById = async (serviceData) => {
  try {
    const id = serviceData?.id;
    const result = await newsletterModel.findOne({ _id: id });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: newsletterService: getNewsletterById`,
      error.message
    );
    throw new Error(error);
  }
};

// getAllNewsletters
module.exports.getAllNewsletters = async (serviceData) => {
  try {
    let conditions = {};
    const {
      limit = 10,
      skip = 0,
      searchQuery,
      status = true,
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [{ email: { $regex: searchQuery, $options: "i" } }],
      };
    }

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;
    const result = await newsletterModel
      .find(conditions)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: newsletterService: getAllNewsletters`,
      error.message
    );
    throw new Error(error);
  }
};

// updateNewsletter
module.exports.updateNewsletter = async (serviceData) => {
  try {
    const { id, body } = serviceData;
    const result = await newsletterModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: newsletterService: updateNewsletter`,
      error.message
    );
    throw new Error(error);
  }
};

// deleteNewsletter
module.exports.deleteNewsletter = async (serviceData) => {
  try {
    const { id } = serviceData;
    const result = await newsletterModel.findByIdAndUpdate(id, {
      isDeleted: true,
      status: false,
    });
    return formatMongoData(result);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: newsletterService: deleteNewsletter`,
      error.message
    );
    throw new Error(error);
  }
};
