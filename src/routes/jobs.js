const express = require("express");
const router = express.Router();
const { getProfile, isClient } = require("../middleware/profile");
const { payForJob, getUnpaidJobs } = require("../controllers/jobs.js");

router.post("/:job_id/pay", getProfile, isClient, payForJob);
router.get("/unpaid", getProfile, getUnpaidJobs);

module.exports = router;
