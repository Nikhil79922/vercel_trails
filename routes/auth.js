const express = require("express");
const { handleSignUp, handleLogin, handleForgetPassword, handleResetPassword } = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { signUpDto, loginDto, resetPasswordDto } = require("../dtos/auth.dto");

const router = express.Router();

router.post("/signup", validateRequest(signUpDto), handleSignUp);
router.post("/login", validateRequest(loginDto), handleLogin);
router.post("/forget-password", handleForgetPassword);
router.post("/reset-password", validateRequest(resetPasswordDto), handleResetPassword);

module.exports = router;
