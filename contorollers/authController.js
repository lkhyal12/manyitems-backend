const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const { logControllerError } = require("../lib/utils");
const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "all fields are required" });

  try {
    let user = await UserModel.findOne({ email });
    if (user) return res.status(409).json({ message: "Email alrady taken" });
    user = new UserModel({ name, email, password });
    await user.save();
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_RFERSH_SECRET_KEY,
      { expiresIn: "7d" },
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        _id: user._id,
      },
      accessToken,
    });
  } catch (err) {
    logControllerError("register", err);
    return res.status(500).json({ message: "server error" });
  }
};

async function loginController(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_RFERSH_SECRET_KEY,
      { expiresIn: "7d" },
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "You logged in successfully",
      user: {
        name: user.name,
        email: user.email,
        userId: user._id,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    logControllerError("loogincontroller", err);
    return res.status(500).json({ message: "Srevre error" });
  }
}

async function logoutController(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({
    message: "Logged out successfully",
  });
}
function getProfile(req, res) {
  const user = {
    name: req.user.name,
    email: req.user.email,
    _id: req.user._id,
    role: req.user.role,
  };
  return res.status(200).json({ message: "user sent successfully", user });
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  getProfile,
};
