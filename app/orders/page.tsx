"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const OrdersPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearingOrders, setClearingOrders] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        
        // For development/testing: get orders from localStorage
        console.log('Fetching orders for user:', user?.email);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get orders from localStorage
        const storedOrders = localStorage.getItem('orders');
        let userOrders: Order[] = [];
        
        if (storedOrders) {
          // Parse stored orders and filter for current user if needed
          userOrders = JSON.parse(storedOrders);
          
          // If you need to filter by user, uncomment this:
          // userOrders = userOrders.filter(order => order.user.email === user?.email);
        }
        
        setOrders(userOrders);
        setError(null);
        
        // Uncomment this when the backend endpoint is ready
        // Make sure to include the token in the Authorization header
        // const token = localStorage.getItem('token');
        // const response = await axios.get('http://localhost:5000/orders', {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // });
        // setOrders(response.data);
        // setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  // Clear all orders (for testing purposes)
  const handleClearAllOrders = () => {
    if (window.confirm('Are you sure you want to clear all orders? This is for testing purposes only.')) {
      setClearingOrders(true);
      
      // Simulate API call
      setTimeout(() => {
        try {
          localStorage.removeItem('orders');
          setOrders([]);
          setStatusMessage('All orders have been cleared');
          
          // Clear message after 3 seconds
          setTimeout(() => {
            setStatusMessage(null);
          }, 3000);
        } catch (err) {
          console.error('Error clearing orders:', err);
          setError('Failed to clear orders');
        } finally {
          setClearingOrders(false);
        }
      }, 1000);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          
          {/* Test Controls */}
          <div>
            <button
              onClick={handleClearAllOrders}
              disabled={clearingOrders || orders.length === 0}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {clearingOrders ? 'Clearing...' : 'Clear All Orders (Testing)'}
            </button>
          </div>
        </div>
        
        {/* Status Message */}
        {statusMessage && (
          <div className="mb-6 rounded-md bg-green-100 p-4 text-green-800">
            {statusMessage}
          </div>
        )}
        
        {/* Development Mode Notice */}
        <div className="mb-6 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Development Mode</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This is showing your actual orders stored locally. In a production environment, these would be fetched from the server.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">No Orders Found</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.substring(order._id.length - 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/orders/${order._id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage; 