import React, { useState } from 'react';

interface CreateReceiptFormProps {
  onSubmit: (clientName: string, amount: number) => void;
}

const CreateReceiptForm: React.FC<CreateReceiptFormProps> = ({ onSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(clientName, amount);
    setClientName('');
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Create New Receipt</h3>
      <div className="mb-2">
        <label>Client Name</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label>Amount</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Receipt
      </button>
    </form>
  );
};

export default CreateReceiptForm;
