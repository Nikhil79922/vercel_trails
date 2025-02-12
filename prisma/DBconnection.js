const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sql = require("mssql");

// Create the connection pool for MSSQL
const poolPromise = sql.connect(process.env.DATABASE_URL);

async function DBconnection() {
  try {
    // Connecting Prisma to the database
    await prisma.$connect();
    console.log("✅ Connected to MSSQL Database via Prisma!");

    // Connecting via the mssql package (pooling)
    const pool = await poolPromise;
    console.log("✅ Connected to MSSQL Database via mssql pooling!");

    // Example query using the mssql pool
    const result = await pool.request().query("SELECT * FROM your_table");
    console.log("Query result:", result);

  } catch (error) {
    console.error("❌ Error during DB connection:", error);
  }
}

module.exports = DBconnection;
