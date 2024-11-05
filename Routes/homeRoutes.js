const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const { getTopSellers } = require("../Controllers/homeController");

const router = express.Router();

router.get("/topSeller", isAuthenticated, getTopSellers);

module.exports = router;
