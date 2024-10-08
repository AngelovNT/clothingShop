const express = require('express');
const router = express.Router();
const {
  getReceipts,
  createReceipt,
  updateReceipt,
  togglePaidStatus,
  updateReceiptStatus,
  deleteReceipt,
} = require('../controllers/receiptController');

// Define your routes here
router.get('/', getReceipts); // Make sure this is the correct endpoint
router.post('/', createReceipt);
router.put('/:id', updateReceipt);
router.post('/update-receipt-status', updateReceiptStatus);
router.delete('/:id', deleteReceipt); 
router.patch('/:id/toggle-paid', togglePaidStatus);

module.exports = router;
