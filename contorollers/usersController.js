const { logControllerError } = require("../lib/utils");
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
async function getAllUsersController(req, res) {
  try {
    const users = await UserModel.find({});
    if (!users) return res.status(404).json({ message: "No user found" });

    return res.status(200).json({ message: "Users sent successfully", users });
  } catch (err) {
    logControllerError("getAllUsersController", err);
    return res.status(500).json({ message: "server error" });
  }
}

async function createUserController(req, res) {
  const { name, email, password, role } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) return res.status(409).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      role,
      password,
    });
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    logControllerError("createUser", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// update user
async function updateUserController(req, res) {
  const { name, email, role } = req.body;
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    logControllerError("updateUser", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// delete user
async function deleteUserController(req, res) {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    return res.status(200).json({ message: "User delete successfully", user });
  } catch (err) {
    logControllerError("deleteUser", err);
    return res.status(500).json({ message: "Server error" });
  }
}
module.exports = {
  createUserController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
};
