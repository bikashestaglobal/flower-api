const express = require("express");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const dbConnection = require("./database/connection");
const cors = require("cors");
dotEnv.config();
// Connect to the database
dbConnection();

// Create a app
const app = express();

app.use(cors());
app.use(bodyParser.json());

// router middleware
app.use("/api/v1/admins", require("./routes/adminRouter"));
app.use("/api/v1/pincodes", require("./routes/pincodeRouter"));
app.use("/api/v1/categories", require("./routes/categoryRouter"));
app.use("/api/v1/occasions", require("./routes/occasionRouter"));
app.use("/api/v1/products", require("./routes/productRouter"));
app.use("/api/v1/buckets", require("./routes/bucketRouter"));
app.use("/api/v1/deliveryBoys", require("./routes/deliveryBoyRouter"));
app.use("/api/v1/supervisors", require("./routes/supervisorRouter"));
app.use("/api/v1/newsletters", require("./routes/newsletterRouter"));
app.use("/api/v1/customers", require("./routes/customerRouter"));
app.use(
  "/api/v1/customerSubscriptions",
  require("./routes/customerSubscriptionRouter")
);
app.use(
  "/api/v1/adminSubscriptions",
  require("./routes/adminSubscriptionRouter")
);
app.use(
  "/api/v1/customerDeliveryDetails",
  require("./routes/customerDeliveryDetailsRouter")
);
app.use(
  "/api/v1/adminDeliveryDetails",
  require("./routes/adminDeliveryDetailsRouter")
);
app.use("/api/v1/coupons", require("./routes/couponRouter"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start listening the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is Running at ${PORT}`);
});
