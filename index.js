const express = require("express");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth");
const errorHandler = require("./middlewares/errorHandler");
const DBconnection = require("./prisma/DBconnection");

const app = express();
const port = process.env.PORT || 8000;

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
