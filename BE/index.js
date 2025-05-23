const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3001;
app.use(express.json());
const cors = require("cors");

// Configure CORS to allow requests from frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

const initConnection = require("./DB/config");
initConnection();

const { userRoutes, workdayRoutes } = require("./routes/routes");

// Use /api prefix for all routes
app.use("/api/user", userRoutes);
app.use("/api/workday", workdayRoutes);

app.get("/", (req, res) => {
  res.send("Staff App");
});

app.listen(port, () => {
  console.log(`Staff App is running on port ${port}`);
});
