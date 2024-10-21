const express = require('express');
const { createSponsorship, getActiveSponsorships } = require('../Controllers/sponsorshipController');
const { isAuthenticated } = require('../middlewares/Auth');
const router = express.Router();


router.post('/createSponsor', isAuthenticated, createSponsorship)
router.get('/getSponsor', isAuthenticated, getActiveSponsorships);


module.exports = router;