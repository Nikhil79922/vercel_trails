const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { getResetPasswordEmail } = require("../utils/emailTemplates");

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
    html: getResetPasswordEmail(link),
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
