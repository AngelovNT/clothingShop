"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/searchBar';
import CreateReceiptForm from './components/createReceiptForm';
import EditReceiptForm from './components/editReceiptForm';
import ReceiptTable from './components/receiptTable';
import Pagination from './components/pagination';
import LoadingIndicator from './components/loadingIndicator';
import { Receipt } from './types';
axios.defaults.baseURL = 'http://localhost:5000'; // Set this at the start of your application

const AdminDashboard: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      const response = await axios.get('/receipts', {
        params: { page: currentPage, limit: itemsPerPage, search: searchQuery },
      });
      setReceipts(response.data.receipts);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      setLoading(false);
    };

    fetchReceipts();
  }, [currentPage, searchQuery]);

  const handleCreateReceipt = async (clientName: string, amount: number) => {
    const response = await axios.post('/receipts', { clientName, amount });
    // Add the newly created receipt to the local state
    setReceipts((prev) => [...prev, response.data.newReceipt]);
    setCurrentPage(1); // Reset to the first page if needed
  };

  const handleEditReceipt = (receipt: Receipt) => {
    setEditingReceipt(receipt);
  };

  const handleDeleteReceipt = async (id: string) => {
    await axios.delete(`/receipts/${id}`);
    setReceipts((prev) => prev.filter((receipt) => receipt._id !== id));
  };

  const handleTogglePaid = async (id: string) => {
    await axios.patch(`/receipts/${id}/toggle-paid`);
    setCurrentPage(1); // Reset to the first page
  };

  const handleCapturePayment = async (paymentIntentId: string | undefined, receiptId: string) => {
    await axios.post('/receipts/capture-payment', { paymentIntentId, receiptId });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CreateReceiptForm onSubmit={handleCreateReceipt} />
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <ReceiptTable
            receipts={receipts}
            onEdit={handleEditReceipt}
            onDelete={handleDeleteReceipt}
            onTogglePaid={handleTogglePaid}
            onCapturePayment={handleCapturePayment}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
      {editingReceipt && (
        <EditReceiptForm
          receipt={editingReceipt}
          onSubmit={(updatedReceipt) => {
            setReceipts((prev) => prev.map((r) => (r._id === updatedReceipt._id ? updatedReceipt : r)));
            setEditingReceipt(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
