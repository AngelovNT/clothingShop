import React from 'react';
import { Receipt } from '../types';
import StripeCheckout from '../components/stripeCheckout';

interface ReceiptTableProps {
  receipts: Receipt[];
  onEdit: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string) => void;
  onCapturePayment: (paymentIntentId: string | undefined, receiptId: string) => void;
}

const ReceiptTable: React.FC<ReceiptTableProps> = ({ receipts, onEdit, onDelete, onTogglePaid, onCapturePayment }) => (
  <table className="min-w-full bg-white border-collapse">
    <thead>
      <tr>
        <th className="px-4 py-2 bg-gray-800 text-white">Client Name</th>
        <th className="px-4 py-2 bg-gray-800 text-white">Amount</th>
        <th className="px-4 py-2 bg-gray-800 text-white">Status</th>
        <th className="px-4 py-2 bg-gray-800 text-white">Actions</th>
      </tr>
    </thead>
    <tbody>
      {receipts.length > 0 ? (
        receipts.map((receipt) => (
          <tr key={receipt._id} className="text-center border-t">
            <td className="px-4 py-2">{receipt.clientName}</td>
            <td className="px-4 py-2">{receipt.amount}</td>
            <td className="px-4 py-2">
              {receipt.isPaid
                ? 'Paid'
                : receipt.status === 'awaiting confirmation'
                ? 'Awaiting Confirmation'
                : 'Unpaid'}
            </td>
            <td className="px-4 py-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                onClick={() => onEdit(receipt)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 mr-2 rounded"
                onClick={() => onDelete(receipt._id)}
              >
                Delete
              </button>
              <button
                className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                onClick={() => onTogglePaid(receipt._id)}
              >
                {receipt.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
              </button>
              {receipt.status === 'authorized' && (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => onCapturePayment(receipt.paymentIntentId, receipt._id)}
                >
                  Capture Payment
                </button>
              )}
              {/* Show Stripe Checkout only if payment is not paid or awaiting confirmation */}
              {!receipt.isPaid && receipt.status !== 'awaiting confirmation' && (
                <StripeCheckout amount={receipt.amount} receiptId={receipt._id} />
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={4} className="px-4 py-2 text-center">
            No receipts found
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default ReceiptTable;
