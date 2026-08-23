const express = require("express");
const { protectedRoute, isAdmin } = require("../middleware/protectedRoute");
const {
  getAdminProductsController,
} = require("../contorollers/adminProductsController");
const adminProductsRouter = express.Router();
adminProductsRouter.get(
  "/",
  protectedRoute,
  isAdmin,
  getAdminProductsController,
);
module.exports = { adminProductsRouter };
