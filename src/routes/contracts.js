const express = require("express");
const router = express.Router();
const { getProfile } = require("../middleware/profile");
const {
  getContracts,
  getContractById,
} = require("../controllers/contracts.js");
const { validate, Joi } = require("express-validation");

router.get("/", getProfile, getContracts);

const getContractByIdValidation = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};
router.get(
  "/:id",
  validate(getContractByIdValidation, {}, {}),
  getProfile,
  getContractById
);

module.exports = router;
