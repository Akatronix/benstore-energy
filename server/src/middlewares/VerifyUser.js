const User = require("../models/User.model");

async function verifyUser(req, res, next) {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  next();
}

module.exports = verifyUser;
