const express = require('express');
const { createSponsorship, getActiveSponsorships } = require('../Controllers/sponsorshipController');
const router = express.Router();


router.post('/createSponsor', createSponsorship)
router.get('/getSponsor', getActiveSponsorships);


module.exports = router;