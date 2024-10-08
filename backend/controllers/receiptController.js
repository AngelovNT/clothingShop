const Receipt = require('../models/receipt');

const getReceipts = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'clientName', sortOrder = 'asc' } = req.query;

  console.log('Fetching receipts:', { page, limit, sortBy, sortOrder }); // Log incoming requests

  try {
    const receipts = await Receipt.find()
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const totalReceipts = await Receipt.countDocuments();

    res.status(200).json({
      receipts,
      totalPages: Math.ceil(totalReceipts / Number(limit)),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error('Error fetching receipts:', err); // Log errors
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
};

const createReceipt = async (req, res) => {
  const { clientName, amount } = req.body;
  if (!clientName || !amount) {
    return res.status(400).json({ error: 'Client name and amount are required' });
  }

  try {
    const newReceipt = new Receipt({ clientName, amount, isPaid: false });
    await newReceipt.save();
    res.status(201).json({ message: 'Receipt created successfully', newReceipt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create receipt' });
  }
};

const updateReceipt = async (req, res) => {
  const { id } = req.params;
  const { clientName, amount, isPaid } = req.body;

  try {
    const updatedReceipt = await Receipt.findByIdAndUpdate(
      id,
      { clientName, amount, isPaid },
      { new: true }
    );

    if (!updatedReceipt) return res.status(404).json({ error: 'Receipt not found' });
    res.status(200).json({ message: 'Receipt updated successfully', updatedReceipt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update receipt' });
  }
};

const togglePaidStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const receipt = await Receipt.findById(id);
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });

    receipt.isPaid = !receipt.isPaid;
    await receipt.save();

    res.status(200).json({ message: 'Receipt payment status updated', receipt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update receipt payment status' });
  }
};

const updateReceiptStatus = async (req, res) => {
  const { receiptId, status } = req.body;

  try {
    await Receipt.updateOne({ _id: receiptId }, { isPaid: status === 'paid', status });
    return res.status(200).json({ message: 'Status updated' });
  } catch (error) {
    console.error('Error updating receipt status:', error);
    return res.status(500).json({ error: 'Failed to update receipt status' });
  }
};

const deleteReceipt = async (req, res) => {
  const { id } = req.params;
  console.log('Received request to delete receipt with ID:', id); // Log the ID

  try {
    const deletedReceipt = await Receipt.findByIdAndDelete(id);
    if (!deletedReceipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    res.status(200).json({ message: 'Receipt deleted successfully' });
  } catch (err) {
    console.error('Error deleting receipt:', err); // Log any errors
    res.status(500).json({ error: 'Failed to delete receipt' });
  }
};
module.exports = { getReceipts, createReceipt, updateReceipt, togglePaidStatus, updateReceiptStatus, deleteReceipt};
