const isAdmin = async (req, res, next) => {
  // validate request against admin profile

  next();
};

module.exports = { isAdmin };
