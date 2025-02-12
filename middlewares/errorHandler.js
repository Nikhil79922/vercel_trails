const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  let statusCode = 400;
  let message = "An error occurred";

  switch (err.message) {
    case "EMAIL_EXISTS":
      message = "Email already registered";
      break;
    case "USER_NOT_FOUND":
      message = "User does not exist";
      break;
    case "INVALID_PASSWORD":
      message = "Invalid password";
      break;
    case "TokenExpiredError":
      message = "Token has expired";
      break;
    default:
      statusCode = 500;
      message = "Internal Server Error";
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
