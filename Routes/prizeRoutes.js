const express = require('express');
const { getPrizes, updatePrize } = require('../Controllers/prizeController');

const router = express.Router();


router.get("/getAllPrizes", isAuthenticated, getPrizes)
router.patch("/updatePrize", isAuthenticated, updatePrize)
router.delete("/deletePrize", isAuthenticated, deletePrize)