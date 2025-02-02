import jwt from "jsonwebtoken";
import { properties } from "../../../config/properties.js";

export const protectOwnerRoute = async (req, res, next) => {
  const secret_key = properties?.JWT_SECERT_KEY;
  const token = req.header('Authorization')?.split(" ")[1];

  if (!token) {
    return res.status(400).send({
      message: "JWT must be provided",
    });
  }

  try {
    const decode = jwt.verify(token, secret_key);
    req.user = decode;
    const {role, isEmailVerified} = req.user
    if (!(role === "owner") || !(isEmailVerified)) {
        return res.status(400).send({
            message: "You are not authorized to perform this action"
        });
    }
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired.',
        error: error.message
      });
    }
      return res.status(401).json({
        message: 'Invalid token. Please check the provided token.',
        error: error.message
      });
  }
};
