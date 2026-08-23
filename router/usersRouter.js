const express = require("express");
const usersRouter = express.Router();
const { protectedRoute, isAdmin } = require("../middleware/protectedRoute");

const {
  createUserController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
} = require("../contorollers/usersController");
usersRouter.get("/", protectedRoute, getAllUsersController);
usersRouter.post("/", protectedRoute, isAdmin, createUserController);
usersRouter.put("/:id", protectedRoute, isAdmin, updateUserController);
usersRouter.delete("/:id", protectedRoute, isAdmin, deleteUserController);
module.exports = { usersRouter };
