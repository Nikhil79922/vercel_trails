const express = require("express");
const path=require("path")
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth");
const errorHandler = require("./middlewares/errorHandler");
const DBconnection = require("./prisma/DBconnection");

const app = express();
const port = process.env.PORT || 3000;

// Serve favicon.ico from the public folder
app.use("/favicon.ico", express.static(path.join(__dirname, "public", "favicon.ico")));

DBconnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/auth", authRoutes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
