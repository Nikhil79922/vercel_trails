const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const prisma = new PrismaClient();

const signUp = async ({ name, email, role, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("EMAIL_EXISTS");

  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { name, email, role, password: hashedPassword } });
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("INVALID_PASSWORD");

  const token = jwt.sign({ email: user.email, _id: user.id }, process.env.SECRET, { expiresIn: "24h" });
  return { token, role: user.role, name: user.name };
};

const forgotPassword = async ({ email }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: "10m" });
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
  });

  await transport.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="background: linear-gradient(to right, #81e6d9, #63b3ed); display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; font-family: 'Arial', sans-serif;">
          <div style="background-color: #ffffff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); text-align: center; max-width: 480px; width: 100%;">
            <h1 style="font-size: 32px; font-weight: 600; color: #2d3748; margin-bottom: 16px;">Reset Your Password</h1>
            <p style="color: #4a5568; font-size: 18px; margin-bottom: 24px;">You requested to reset your password. Click the button below to proceed.</p>
            <a href="${link}" style="display: inline-block; background: linear-gradient(to right, #4299e1, #667eea); color: white; font-weight: 600; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-size: 18px; box-shadow: 0 6px 15px rgba(66, 153, 225, 0.2); transition: all 0.3s ease;">
              Reset Password
            </a>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="color: #718096; font-size: 14px; margin-top: 24px;">If you didn’t request a password reset, please ignore this email or contact support.</p>
          </div>
        </body>
      </html>
    `,
  });
  
  

  return { message: "Email sent successfully" };
};


const resetPassword = async ({ token, password }) => {
  const decoded = jwt.verify(token, process.env.SECRET);
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({ where: { email: decoded.email }, data: { password: hashedPassword } });
  return { message: "Password updated successfully" };
};

module.exports = { signUp, login, forgotPassword, resetPassword };
