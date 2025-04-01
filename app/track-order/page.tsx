"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

const TrackOrderPage = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Check if order exists in localStorage
      const storedOrders = localStorage.getItem('orders');
      
      if (storedOrders) {
        const orders = JSON.parse(storedOrders);
        const foundOrder = orders.find((order: any) => 
          order._id === orderId || order._id.substring(order._id.length - 8) === orderId
        );
        
        if (foundOrder) {
          // Navigate to order details page
          router.push(`/orders/${foundOrder._id}`);
          return;
        }
      }
      
      // If we get here, order was not found
      setError('Order not found. Please check the order ID and try again.');
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('An error occurred while tracking your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Track Your Order</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-6">
              Enter your order ID to track the status of your order. You can find your order ID in the confirmation email you received after placing your order.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold mb-3">Need Help?</h2>
              <p className="text-gray-600 mb-4">
                If you're having trouble tracking your order or have any questions, please contact our customer support.
              </p>
              <button
                onClick={() => router.push('/contact')}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackOrderPage; 