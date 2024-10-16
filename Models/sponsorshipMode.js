const mongoose = require('mongoose')


const sponsorshipSchema = new mongoose.Schema({
    brandName: { type: String, required: true },
     // image URL for the brand's ad
    image: { type: String, required: true },
    adLocation: { type: String, enum: ['home_screen', 'competition'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
