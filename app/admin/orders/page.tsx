"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Order } from '../../types';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // In a real app, you would include authentication token in the headers
        const response = await axios.get('http://localhost:5000/orders', {
          params: {
            page: currentPage,
            limit: 10,
            status: statusFilter || undefined
          }
        });
        
        setOrders(response.data.orders || response.data);
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
        console.error(err);
      }
    };

    fetchOrders();
  }, [currentPage, statusFilter]);

  // Handle order status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}/status`, {
        status: newStatus
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus as any } : order
      ));
      
      // Close modal if open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        
        {/* Status Filter */}
        <div className="w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border">Order ID</th>
                  <th className="py-2 px-4 border">Customer</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Total</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Payment</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="border-t">
                      <td className="py-2 px-4 border">{order._id.substring(0, 8)}...</td>
                      <td className="py-2 px-4 border">{order.user.name}</td>
                      <td className="py-2 px-4 border">{formatDate(order.createdAt)}</td>
                      <td className="py-2 px-4 border">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-2 px-4 border">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-2 px-4 border">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="py-2 px-4 border">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 px-4 text-center border">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <p><span className="font-medium">Order ID:</span> {selectedOrder._id}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                  <p><span className="font-medium">Status:</span> {selectedOrder.status}</p>
                  <p><span className="font-medium">Payment Status:</span> {selectedOrder.paymentStatus}</p>
                  <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                  {selectedOrder.trackingNumber && (
                    <p><span className="font-medium">Tracking Number:</span> {selectedOrder.trackingNumber}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p><span className="font-medium">Name:</span> {selectedOrder.user.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                  
                  <h3 className="font-semibold mt-4 mb-2">Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
              
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Product</th>
                      <th className="py-2 px-4 border">Price</th>
                      <th className="py-2 px-4 border">Quantity</th>
                      <th className="py-2 px-4 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4 border flex items-center">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-12 h-12 object-cover mr-2"
                          />
                          <span>{item.product.name}</span>
                        </td>
                        <td className="py-2 px-4 border">${item.price.toFixed(2)}</td>
                        <td className="py-2 px-4 border">{item.quantity}</td>
                        <td className="py-2 px-4 border">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-t font-semibold">
                      <td colSpan={3} className="py-2 px-4 border text-right">Total:</td>
                      <td className="py-2 px-4 border">${selectedOrder.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold mb-2">Update Order Status</h3>
                  <div className="flex gap-2">
                    <select
                      className="p-2 border rounded"
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement; 