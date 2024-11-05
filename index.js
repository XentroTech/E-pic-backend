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
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json");
const imageSpaceRoute = require("./Routes/imageSpaceRoutes");
const coinRoutes = require("./Routes/coinRoutes");
const prizeRoutes = require("./Routes/prizeRoutes");

// Initialize dotenv before using any environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// initialize firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());
app.use("/uploads", express.static(uploadPath));

// Middlewares
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use("/api/v1/", imageSpaceRoute);
app.use("/api/v1/", coinRoutes);
app.use("/api/v1/", prizeRoutes);

// Error middleware
app.use(errorMiddleware);

// Listening to port
app.listen(PORT, () => {
  console.log(`Listening from port: ${PORT}`);
});
