const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const database = require("./database");
const user = require("./Routes/userRoutes");
const otp = require("./Routes/otpRoutes");
const imageRoutes = require("./Routes/imageRoutes");
const errorMiddleware = require("./utils/error");
const path = require("path");
const uploadPath = path.join(__dirname, "uploads");

// Initialize dotenv before using any environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/uploads", express.static(uploadPath));

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Database connection
database();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Epic");
});
app.use("/api/v1/", user);
app.use("/api/v1/", otp);
app.use("/api/v1/", imageRoutes);

// Error middleware
app.use(errorMiddleware);

// Listening to port
app.listen(PORT, () => {
  console.log(`Listening from port: ${PORT}`);
});
