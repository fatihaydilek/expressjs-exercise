const express = require("express");
const router = express.Router();
const { getProfile, isClient } = require("../middleware/profile");
const { depositMoney } = require("../controllers/balances.js");
const { validate, Joi } = require("express-validation");

const depositMoneyValidation = {
  body: Joi.object({
    amount: Joi.number().required().integer().strict(),
  }),
};

router.post(
  "/deposit/:userId",
  validate(depositMoneyValidation, {}, {}),
  getProfile,
  isClient,
  depositMoney
);

module.exports = router;
