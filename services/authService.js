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
        <body class="bg-gradient-to-r from-blue-100 to-indigo-200 flex items-center justify-center min-h-screen">
          <div class="bg-white shadow-lg rounded-lg max-w-lg w-full p-8 text-center space-y-6">
            <h1 class="text-3xl font-semibold text-gray-900">Reset Your Password</h1>
            <p class="text-gray-700 font-medium">You requested to reset your password. Click the button below to proceed.</p>
            <div class="mt-8">
              <a href="${link}" class="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-200">
                Reset Password
              </a>
            </div>
            <hr class="my-6 border-gray-200">
            <p class="text-sm text-gray-500">If you didn’t request a password reset, please ignore this email or contact support.</p>
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
