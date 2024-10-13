const express = require('express');
const { getPrizes, updatePrize } = require('../Controllers/prizeController');

const router = express.Router();


router.get("/getAllPrizes", getPrizes)
router.patch("/updatePrize", updatePrize)
router.delete("/deletePrize", deletePrize)