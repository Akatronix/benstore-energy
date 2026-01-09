const express = require("express");
const verifyToken = require("../../middlewares/VerifyToken");
const verifyUser = require("../../middlewares/VerifyUser");
const updateUserProfile = require("../../controllers/updateUser.controller");

const router = express.Router();

router.put("/update", verifyToken, verifyUser, updateUserProfile);

module.exports = router;
