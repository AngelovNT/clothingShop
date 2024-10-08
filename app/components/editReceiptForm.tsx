import React from 'react';
import { Receipt } from '../types';

interface EditReceiptFormProps {
  receipt: Receipt;
  onSubmit: (receipt: Receipt) => void;
}

const EditReceiptForm: React.FC<EditReceiptFormProps> = ({ receipt, onSubmit }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onSubmit({ ...receipt, [name]: name === 'amount' ? Number(value) : value });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Edit Receipt</h3>
      <div className="mb-2">
        <label>Client Name</label>
        <input
          type="text"
          name="clientName"
          className="border p-2 w-full"
          value={receipt.clientName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-2">
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          className="border p-2 w-full"
          value={receipt.amount}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default EditReceiptForm;
