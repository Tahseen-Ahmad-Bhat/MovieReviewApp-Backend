const jwt = require("jsonwebtoken");
const { sendError } = require("../util/helper");
const User = require("../models/user");

exports.isAuth = async (req, res, next) => {
  const token = req.headers?.authorization;

  // console.log(token);

  if (!token) return sendError(res, "Invalid token!");
  const jwtToken = token.split(" ")[1];

  // console.log(jwtToken);

  if (!jwtToken) return sendError(res, "Invalid token!");
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const { userId } = decoded;

  const user = await User.findById(userId);
  if (!user) return sendError(res, "Invalid token user not found!", 404);

  req.user = user;

  next();
};

exports.isAdmin = (req, res, next) => {
  const { user } = req;

  if (user.role !== "admin") return sendError(res, "Unauthorized access!");

  next();
};
