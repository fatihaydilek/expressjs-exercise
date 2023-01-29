const { Op } = require("sequelize");
const { exceptionTypes } = require("../exceptions/exceptions.js");

const DEPOSIT_PERCENT_HARD_LIMIT = 0.25;

const depositMoney = async (req, res) => {

  const sequelize = req.app.get("sequelize");
  const { Profile, Job, Contract } = req.app.get("models");
  const { userId } = req.params;
  const profileId = req.profile.get("id");
  const { amount } = req.body;

  console.log(userId, profileId);
  if (userId != profileId) {
    return res.status(401).send({
      errorType: exceptionTypes.BalanceException,
      reason:
        "Deposit operation is not allowed for given userId profileId pair.",
    });
  }

  const priceSumToPay = await Job.sum("price", {
    where: {
      paid: {
        [Op.not]: true,
      },
    },
    include: [
      {
        model: Contract,
        where: {
          ClientId: userId,
          status: {
            [Op.not]: "terminated",
          },
        },
      },
    ],
  });

  if (!priceSumToPay) {
    return res.status(422).send({
      errorType: exceptionTypes.BalanceException,
      reason: "Insufficient job price.",
    });
  }

  if (amount > priceSumToPay * DEPOSIT_PERCENT_HARD_LIMIT) {
    return res.status(422).send({
      errorType: exceptionTypes.BalanceException,
      reason: "Given amount more than 25% total jobs to pay",
    });
  }

  const client = await Profile.findOne({ where: { id: userId } });
  client.balance += amount;
  client.save();

  res.json(client);
};

module.exports = {
  depositMoney,
};
