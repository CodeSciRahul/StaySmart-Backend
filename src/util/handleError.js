export const handleError = (error, res) => {
  // Handle Mongoose ValidationError
  if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).send({ message: validationErrors[0], errors: "Validation error" });
  }

  // Handle MongoDB duplicate key error (unique constraint violation)
  if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // Get the field causing the duplication
      return res.status(400).send({ message: `${field} must be unique.`, errors: "Duplicate entry" });
  }

  // Handle CastError (invalid ObjectId or data type mismatch)
  if (error.name === "CastError") {
      return res.status(400).send({ message: `Invalid ${error.path}: ${error.value}`, errors: "Invalid data type" });
  }

  // Handle UnauthorizedError (e.g., authentication or permission issues)
  if (error.name === "UnauthorizedError" || error.status === 401) {
      return res.status(401).send({ message: error.message || "Unauthorized access", errors: "Unauthorized" });
  }

  // Handle NotFoundError (e.g., document not found in the database)
  if (error.name === "NotFoundError" || error.status === 404) {
      return res.status(404).send({ message: error.message || "Resource not found", errors: "Not found" });
  }

  // Handle custom errors (e.g., errors thrown manually with specific messages)
  if (error.isCustomError) {
      return res.status(error.status || 400).send({ message: error.message, errors: error.errorType || "Custom error" });
  }

  // Handle all other errors (generic server error)
  return res.status(500).send({ message: "Server error", error: error.message });
};