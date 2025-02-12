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
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
          <div class="bg-white shadow-lg rounded-lg max-w-md w-full p-6 text-center">
            <h1 class="text-2xl font-bold text-gray-800">Reset Your Password</h1>
            <p class="text-gray-600 mt-4">
              You requested to reset your password. Please click the button below to proceed with resetting your password.
            </p>
            <div class="mt-6">
              <a href="${link}" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full text-lg">
                Reset Password
              </a>
            </div>
            <hr class="my-6 border-gray-300">
            <p class="text-sm text-gray-500">
              If you did not request a password reset, please ignore this email or contact support.
            </p>
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
