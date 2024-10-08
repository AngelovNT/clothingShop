const express = require('express');
const { createStripePayment, captureStripePayment, confirmStripePayment } = require('../controllers/stripeController');

const router = express.Router();

router.post('/create-payment', createStripePayment);
router.post('/capture-payment', captureStripePayment);
router.post('/confirm-payment', confirmStripePayment);

module.exports = router;
