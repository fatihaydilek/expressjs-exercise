const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const app = express();
const { ValidationError } = require("express-validation");
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

const contractsRoutes = require("./routes/contracts.js");
const jobsRoutes = require("./routes/jobs.js");
const balancesRoutes = require("./routes/balances.js");
const adminRoutes = require("./routes/admin.js");
app.use("/contracts", contractsRoutes);
app.use("/jobs", jobsRoutes);
app.use("/balances", balancesRoutes);
app.use("/admin", adminRoutes);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});
module.exports = app;
