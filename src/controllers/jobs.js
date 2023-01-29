const { Op } = require("sequelize");
const { exceptionTypes } = require("../exceptions/exceptions.js");
const payForJob = async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { job_id } = req.params;
  const profileId = req.profile.get("id");

  // Find the job
  const clientJob = await Job.findOne({
    where: {
      id: job_id,
    },
    include: [
      {
        model: Contract,
        where: {
          ClientId: profileId,
          status: {
            [Op.not]: "terminated",
          },
        },
      },
    ],
  });

  if (!clientJob) {
    return res.status(404).send({
      errorType: exceptionTypes.JobException,
      reason: "Job not found",
    });
  }
  // check job is paid
  if (clientJob.get("paid")) {
    return res.status(422).send({
      errorType: exceptionTypes.PaymentException,
      reason: "Job is paid.",
    });
  }

  const jobContract = clientJob.get("Contract");

  // Get client and contractor
  const profiles = await Profile.findAll({
    where: {
      id: {
        [Op.in]: [jobContract.get("ContractorId"), jobContract.get("ClientId")],
      },
    },
  });
  const client = profiles.find((p) => p.get("type") === "client");
  const contractor = profiles.find((p) => p.get("type") === "contractor");

  // Balance check for payment
  if (client.get("balance") < clientJob.get("price")) {
    res.status(422).send({ message: "Insufficient balance for payment" });
  }

  await sequelize.transaction(async (t) => {
    // update client balance
    await Profile.update(
      { balance: client.get("balance") - clientJob.get("price") },
      { where: { id: client.get("id") } },
      { transaction: t }
    );

    // update contractor balance
    await Profile.update(
      { balance: contractor.get("balance") + clientJob.get("price") },
      { where: { id: contractor.get("id") } },
      { transaction: t }
    );

    await Job.update(
      {
        paid: true,
        paymentDate: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      { where: { id: job_id } },
      { transaction: t }
    );
  });

  // TODO: Payment table needed for tracking payments.
  // This endpoint should return payment id
  res.json({
    message: "Payment successful",
  });
};

const getUnpaidJobs = async (req, res) => {
  const { Job, Contract } = req.app.get("models");
  const profileId = req.profile.get("id");
  const jobs = await Job.findAll({
    where: {
      paid: {
        [Op.not]: true,
      },
    },
    include: [
      {
        model: Contract,
        where: {
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
          status: {
            [Op.not]: "terminated",
          },
        },
      },
    ],
  });
  res.json(jobs);
};

module.exports = {
  payForJob,
  getUnpaidJobs,
};
