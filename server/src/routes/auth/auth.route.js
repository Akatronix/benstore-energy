const express = require("express");
const loginController = require("../../controllers/auth/login.controller");
const Signup = require("../../controllers/auth/signup.controller");

const router = express.Router();

// Create a new socket
router.post("/login", loginController);
router.post("/signup", Signup);

module.exports = router;
