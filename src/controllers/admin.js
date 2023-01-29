const { Op } = require("sequelize");

const getBestProfession = async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { start, end } = req.query;
  const startDate = new Date(start + "T00:00:00.000Z")
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const endDate = new Date(end + "T23:59:59.000Z")
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const [results] = await sequelize.query(
    `SELECT SUM(Jobs.price) as total_earning, profession FROM Jobs
    JOIN Contracts ON Jobs.ContractId=Contracts.id
    JOIN Profiles ON Profiles.id=Contracts.ContractorId
    WHERE Jobs.paid=1 AND Jobs.paymentDate >= '${startDate}' AND  Jobs.paymentDate <= '${endDate}'
    GROUP BY Profiles.profession
    ORDER BY total_earning DESC`
  );

  const bestProfession = results.shift();
  res.json(bestProfession);
};

const getBestClients = async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { start, end, limit=2 } = req.query;
  const startDate = new Date(start + "T00:00:00.000Z")
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const endDate = new Date(end + "T23:59:59.000Z")
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const [results] = await sequelize.query(
    `SELECT Contracts.ClientId as id, Profiles.firstName || ' ' || Profiles.lastName as fullName, SUM(Jobs.price) as paid FROM Jobs
    JOIN Contracts ON Jobs.ContractId=Contracts.id
    JOIN Profiles ON Profiles.id=Contracts.ClientId
    WHERE Jobs.paid=1 AND Jobs.paymentDate >= '${startDate}' AND  Jobs.paymentDate <= '${endDate}'
    GROUP BY ClientId
    ORDER BY paid DESC
    LIMIT ${limit};`
  );

  res.json(results);
};

module.exports = {
  getBestProfession,
  getBestClients,
};
