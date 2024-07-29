import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) throw new ApiError(401, "Auauthrization")();

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) throw new ApiError(401, "User in not Found");

    req.user = user;
    next();
  } catch (error) {
    console.log("Auauthrization", error);
    throw new ApiError(401, "Auauthrization ", error);
  }
});

export default isAuthenticated;
