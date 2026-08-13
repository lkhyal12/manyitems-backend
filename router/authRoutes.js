const express = require("express");
const UserModel = require("../models/User");
const { logControllerError } = require("../lib/utils");
const {
  registerController,
  loginController,
  getProfile,
  logoutController,
} = require("../contorollers/authController");
const protectedRoute = require("../middleware/protectedRoute");
const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/profile", protectedRoute, getProfile);

module.exports = authRouter;
