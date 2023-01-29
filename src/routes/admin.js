const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/admin");
const {
  getBestProfession,
  getBestClients,
} = require("../controllers/admin.js");
const { validate, Joi } = require("express-validation");

const getBestProfessionValidation = {
  query: Joi.object({
    start: Joi.date().required(),
    end: Joi.date().greater(Joi.ref("start")).required(),
  }),
};

router.get(
  "/best-profession",
  isAdmin,
  validate(getBestProfessionValidation, {}, {}),
  getBestProfession
);

const getBestClientsValidation = {
  query: Joi.object({
    start: Joi.date().required(),
    end: Joi.date().greater(Joi.ref("start")).required(),
    limit: Joi.number().integer().default(2),
  }),
};

router.get(
  "/best-clients",
  isAdmin,
  validate(getBestClientsValidation, {}, {}),
  getBestClients
);

module.exports = router;
