import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  // console.log(token);

  if (!token) return next(errorHandler(401, "Unauthorized"));

  try {
    const user = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};
