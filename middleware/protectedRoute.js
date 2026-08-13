const { logControllerError } = require("../lib/utils");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
async function protectedRoute(req, res, next) {
  const bearer = req.headers?.authorization;
  if (!bearer) return res.status(401).json({ message: "Missing Access Token" });
  const accessToken = bearer.split(" ")[1];
  if (!accessToken)
    return res.status(401).json({ message: "Missing Access Token" });
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    logControllerError("protctected route", err);
    res.status(401).json({ message: "Invalid access token" });
  }
}

module.exports = protectedRoute;
