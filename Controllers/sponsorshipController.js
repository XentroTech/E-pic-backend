// controllers/sponsorshipController.js
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Sponsorship = require('../models/Sponsorship');

exports.createSponsorship = catchAsyncErrors( async (req, res) => {
    const { brandName, image, adLocation, startDate, endDate } = req.body;

    const sponsorship = new Sponsorship({
        brandName,
        image,
        adLocation,
        startDate,
        endDate
    });

    await sponsorship.save();
    res.status(201).json({ message: 'Sponsorship created successfully!', sponsorship });
});

exports.getActiveSponsorships = catchAsyncErrors( async (req, res) => {
    const currentDate = new Date();

    const sponsorships = await Sponsorship.find({
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
    });

    res.status(200).json(sponsorships);
});


