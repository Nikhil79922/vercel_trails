const { PrismaClient } = require("@prisma/client");

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Use a cached client instance for development environments
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

async function DBconnection() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to MSSQL Database!");
  } catch (error) {
    console.error("❌ Error during DB connection:", error);
  }
}

module.exports = DBconnection;
