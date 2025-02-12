const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function DBconnection() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to MSSQL Database!");
  } catch (error) {
    console.error("❌ Error during DB connection:", error);
  }
}

module.exports = DBconnection;
