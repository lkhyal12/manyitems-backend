const express = require("express");
const { protectedRoute, isAdmin } = require("../middleware/protectedRoute");
const {
  getAllAdminOrdersController,
  updateOrderController,
  deleteOrderController,
} = require("../contorollers/adminOrdersController");
const adminOrdersRouter = express.Router();

adminOrdersRouter.get(
  "/",
  protectedRoute,
  isAdmin,
  getAllAdminOrdersController,
);
adminOrdersRouter.put("/:id", protectedRoute, isAdmin, updateOrderController);
adminOrdersRouter.delete(
  "/:id",
  protectedRoute,
  isAdmin,
  deleteOrderController,
);

module.exports = { adminOrdersRouter };
