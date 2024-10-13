const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.processPayment = catchAsyncErrors(async(req, res, next)=>{
    const { country, amount, paymentMethod, paymentDetails } = req.body;

    try {
        let paymentResult;

        if (country === 'Malaysia') {
            if (paymentMethod === 'stripe') {
                // Use Stripe to process payment
                paymentResult = await stripe.paymentIntents.create({
                    amount,
                    currency: 'MYR',
                    payment_method: paymentDetails, 
                });
            } else if (paymentMethod === 'ipay88') {
                // Implement iPay88 payment processing
            }
            // Add other Malaysian payment methods
        } else if (country === 'Bangladesh') {
            if (paymentMethod === 'bkash') {
                // Implement bKash payment processing
            } else if (paymentMethod === 'sslcommerz') {
                // Implement SSLCommerz payment processing
            }
            // Add other Bangladeshi payment methods
        }

        res.status(200).send(paymentResult);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})
    
