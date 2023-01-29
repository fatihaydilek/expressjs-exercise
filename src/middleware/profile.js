const { exceptionTypes } = require("../exceptions/exceptions.js");

const getProfile = async (req, res, next) => {
  const { Profile } = req.app.get("models");
  const profile = await Profile.findOne({
    where: { id: req.get("profile_id") || 0 },
  });
  if (!profile) {
    return res.status(401).send({
      errorType: exceptionTypes.ProfileException,
      reason: "Profile not found",
    });
  }
  req.profile = profile;
  next();
};

const isClient = async (req, res, next) => {
  const profile = req.profile;
  if (!profile) {
    return res.status(401).end();
  }
  // TODO: Use ENUM for profile types
  if (profile.get("type") !== "client") {
    return res.status(401).send({
      errorType: exceptionTypes.ProfileException,
      reason: "Unauthorized operation for client",
    });
  }
  next();
};
module.exports = { getProfile, isClient };
