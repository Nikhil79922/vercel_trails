const { signUp, login, forgotPassword, resetPassword } = require("../services/authService");

const handleSignUp = async (req, res, next) => {
  try {
    await signUp(req.body);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

const handleLogin = async (req, res, next) => {
  try {
    const data = await login(req.body);
    res.status(200).json({ message: "Logged in successfully", ...data });
  } catch (error) {
    next(error);
  }
};

const handleForgetPassword = async (req, res, next) => {
  try {
    const data = await forgotPassword(req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const handleResetPassword = async (req, res, next) => {
  try {
    const data = await resetPassword({ token: req.query.token, password: req.body.password });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { handleSignUp, handleLogin, handleForgetPassword, handleResetPassword };
