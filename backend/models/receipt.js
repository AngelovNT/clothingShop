const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
});

const Receipt = mongoose.model('Receipt', receiptSchema);
module.exports = Receipt;
