const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Receipt = require('../models/receipt'); // Ensure you have your Receipt model imported

const createStripePayment = async (req, res) => {
    const { amount, currency, receiptId } = req.body;

    try {
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            capture_method: 'manual', // If you want to capture manually
        });

        // Save initial payment status to the database
        await Receipt.findByIdAndUpdate(receiptId, {
            status: 'awaiting confirmation',
            paymentIntentId: paymentIntent.id,
        });

        res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
    } catch (error) {
        console.error('Failed to create payment:', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
};

const confirmStripePayment = async (req, res) => {
    const { paymentIntentId, receiptId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
        const isPaid = paymentIntent.status === 'succeeded';

        await Receipt.findByIdAndUpdate(receiptId, {
            isPaid,
            status: isPaid ? 'paid' : 'awaiting confirmation',
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Payment confirmation failed:', error);
        res.status(500).json({ success: false, message: 'Payment confirmation failed' });
    }
};

const captureStripePayment = async (req, res) => {
    const { paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            res.json({ success: true, message: 'Payment captured successfully!' });
        } else {
            res.status(400).json({ success: false, message: 'Payment capture failed.' });
        }
    } catch (error) {
        console.error('Failed to capture payment:', error);
        res.status(500).json({ error: 'Failed to capture payment' });
    }
};

module.exports = { createStripePayment, captureStripePayment, confirmStripePayment };
