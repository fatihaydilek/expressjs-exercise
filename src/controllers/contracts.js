const { Op } = require("sequelize");

const getContractById = async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const profileId = req.profile.get("id");
  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
    },
  });
  if (!contract) {
    return res.status(404).end();
  }
  res.json(contract);
};

const getContracts = async (req, res) => {
  const { Contract } = req.app.get("models");
  const profileId = req.profile.get("id");
  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
      status: {
        [Op.not]: "terminated",
      },
    },
  });
  res.json(contracts);
};

module.exports = {
  getContracts,
  getContractById,
};
