import jwt from "jsonwebtoken";
import { properties } from "../../../config/properties.js";
import { handleError } from "../../../util/handleError.js";

export const protectTenantRoute = async (req, res, next) => {
  const secret_key = properties?.JWT_SECERT_KEY;
  const token = req.header('Authorization')?.split(" ")[1];

  // Check if token is provided
  if (!token) {
    return handleError(
      { message: "JWT must be provided", status: 400 },
      res
    );
  }

  try {
    // Verify the token
    const decode = jwt.verify(token, secret_key);
    req.owner = decode;

    // Check if the user is an owner and their email is verified
    const { role, isEmailVerified } = req.owner; // Use req.owner instead of req.user
    if (!(role === "tenant") || !isEmailVerified) {
      return handleError(
        { message: "You are not authorized to perform this action", status: 401 },
        res
      );
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token-related errors
    if (error.name === 'TokenExpiredError') {
      return handleError(
        { message: "Token has expired", status: 401 },
        res
      );
    }

    // Handle other JWT errors (e.g., invalid token)
    return handleError(
      { message: "Invalid token. Please check the provided token.", status: 401 },
      res
    );
  }
};