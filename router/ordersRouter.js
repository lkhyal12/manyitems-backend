const express = require("express");
const { protectedRoute } = require("../middleware/protectedRoute");
const {
  myOrdersController,
  getSingleOrderController,
} = require("../contorollers/ordersController");
const ordersRouter = express.Router();

ordersRouter.get("/my-orders", protectedRoute, myOrdersController);
ordersRouter.get("/:id", protectedRoute, getSingleOrderController);
module.exports = { ordersRouter };
