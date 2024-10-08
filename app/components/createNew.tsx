import React, { useState } from 'react';
import axios from 'axios';

interface Receipt {
    _id: string;
    clientName: string;
    amount: number;
    isPaid: boolean;
}

const CreateReceipt = ({ onReceiptCreated }: { onReceiptCreated: (receipt: Receipt) => void }) => {
    const [clientName, setClientName] = useState('');
    const [amount, setAmount] = useState(0);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const newReceipt = { clientName, amount };
        const response = await axios.post('http://localhost:5000/create-receipt', newReceipt);
  
        if (response.status === 201) {
          onReceiptCreated(response.data.newReceipt); // Pass the newly created receipt to parent component
          alert('Receipt created successfully!');
        }
  
        setClientName('');
        setAmount(0);
      } catch (error) {
        console.error('Error creating receipt:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Create Receipt</button>
      </form>
    );
  };
  
  export default CreateReceipt;
  
