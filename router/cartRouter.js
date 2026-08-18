const express = require("express");
const {
  addToCartController,
  updateCartController,
  deleteProductController,
  getUserCartController,
  mergeController,
} = require("../contorollers/addToCartController");
const cartRouter = express.Router();
const { protectedRoute } = require("../middleware/protectedRoute");
cartRouter.post("/", addToCartController);
cartRouter.put("/", updateCartController);
cartRouter.delete("/", deleteProductController);
cartRouter.get("/", getUserCartController);
cartRouter.post("/merge", protectedRoute, mergeController);
module.exports = cartRouter;
