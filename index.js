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
// const serviceAccount = require("./firebase-service-account.json");
const imageSpaceRoute = require("./Routes/imageSpaceRoutes");
const coinRoutes = require("./Routes/coinRoutes");
const prizeRoutes = require("./Routes/prizeRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const homeRoutes = require("./Routes/homeRoutes");
const sponsorRoutes = require("./Routes/sponsorRoutes");
const deleteAccountRoutes = require("./Routes/deleteAccountRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const gameLeaderBoard = require("./Routes/gameLeaderBoardRoute");
const gameResult = require("./Routes/gameResultRoutes");
const competition = require("./Routes/competitionRoutes");
const game = require("./Routes/gameRoutes");
const appNotification = require("./Routes/appNotificationRoutes");
const contactMessage = require("./Routes/contactMessageRoutes");
const statistics = require("./Routes/statisticsRoutes");
const dashboardStatistics = require("./Routes/dashboardRoutes");
const transaction = require("./Routes/transactionRoutes");
const conConversion = require("./Routes/coinConversionRoutes");
const searchbarTitle = require("./Routes/searchbarTitleRoutes");
const pushNotification = require("./Routes/pushNotificaitonRoutes");
const adReward = require("./Routes/adRoutes");
const welcomeScreen = require("./Routes/welcomeScreenRoutes");

// const swaggerUi = require("swagger-ui-express");
// const swaggerDocs = require("./swagger");

// Initialize dotenv before using any environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

const serviceAccount = require("./config/service-account-file.json");
// initialize firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());
app.use("/uploads", express.static(uploadPath));

app.use(
  "/api/v1/.well-known",
  express.static(path.join(__dirname, ".well-known"))
);
// Middlewares
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://167.71.218.23",
    "https://167.71.218.23",
    "http://dev.e-pic.co/",
  ],
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
//setup swagger ui
// app.use("/api/v1/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// app.use("/api/v1/", (res) => {
//   res.send(" Welcome to E-pic");
// });

app.use("/api/v1/", user);
app.use("/api/v1/", otp);
app.use("/api/v1/", imageRoutes);
app.use("/api/v1/", imageSpaceRoute);
app.use("/api/v1/", coinRoutes);
app.use("/api/v1/", prizeRoutes);
app.use("/api/v1/", categoryRoutes);
app.use("/api/v1/", homeRoutes);
app.use("/api/v1/", sponsorRoutes);
app.use("/api/v1/", deleteAccountRoutes);
app.use("/api/v1/", cartRoutes);
app.use("/api/v1/", gameLeaderBoard);
app.use("/api/v1/", gameResult);
app.use("/api/v1/", game);
app.use("/api/v1/", competition);
app.use("/api/v1/", appNotification);
app.use("/api/v1/", contactMessage);
app.use("/api/v1/", statistics);
app.use("/api/v1/", dashboardStatistics);
app.use("/api/v1/", transaction);
app.use("/api/v1/", conConversion);
app.use("/api/v1/", searchbarTitle);
app.use("/api/v1/", pushNotification);
app.use("/api/v1/", adReward);
app.use("/api/v1/", welcomeScreen);

// Error middleware
app.use(errorMiddleware);

// Listening to port
app.listen(PORT, () => {
  console.log(`Listening from port: ${PORT}`);
});
