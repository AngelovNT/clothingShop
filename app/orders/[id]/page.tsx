"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Order } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        
        // For development/testing: get order from localStorage
        console.log('Fetching order details for ID:', params.id);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get orders from localStorage
        const storedOrders = localStorage.getItem('orders');
        let foundOrder: Order | null = null;
        
        if (storedOrders) {
          const orders: Order[] = JSON.parse(storedOrders);
          foundOrder = orders.find(order => order._id === params.id) || null;
        }
        
        if (foundOrder) {
          setOrder(foundOrder);
          setError(null);
        } else {
          setError('Order not found');
        }
        
        // Uncomment this when the backend endpoint is ready
        // Make sure to include the token in the Authorization header
        // const token = localStorage.getItem('token');
        // const response = await axios.get(`http://localhost:5000/orders/${params.id}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // });
        // setOrder(response.data);
        // setError(null);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, params.id, user]);

  // Update order status (for testing purposes)
  const updateOrderStatus = (newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    if (!order) return;
    
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Get all orders
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
          const orders: Order[] = JSON.parse(storedOrders);
          
          // Find and update the specific order
          const updatedOrders = orders.map(o => {
            if (o._id === order._id) {
              return { ...o, status: newStatus, updatedAt: new Date().toISOString() };
            }
            return o;
          });
          
          // Save back to localStorage
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
          
          // Update current order
          setOrder({ ...order, status: newStatus, updatedAt: new Date().toISOString() });
          setStatusUpdateMessage(`Order status updated to ${newStatus}`);
          
          // Clear message after 3 seconds
          setTimeout(() => {
            setStatusUpdateMessage(null);
          }, 3000);
        }
      } catch (err) {
        console.error('Error updating order status:', err);
      } finally {
        setIsUpdating(false);
      }
    }, 1000);
  };

  // Handle cancel order
  const handleCancelOrder = () => {
    updateOrderStatus('cancelled');
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
          <button
            onClick={() => router.push('/orders')}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Back to Orders
          </button>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
            <button
              onClick={() => router.push('/orders')}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <button
            onClick={() => router.push('/orders')}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Back to Orders
          </button>
        </div>
        
        {/* Status Update Message */}
        {statusUpdateMessage && (
          <div className="mb-6 rounded-md bg-green-100 p-4 text-green-800">
            {statusUpdateMessage}
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
                  This is showing your actual order details stored locally. In a production environment, these would be fetched from the server.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Order ID</p>
                <p className="font-medium">#{order._id.substring(order._id.length - 8)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Payment Status</p>
                <p className="font-medium capitalize">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Order Status</p>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            {/* Test Controls - Update Status */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Update Status (For Testing)</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => updateOrderStatus('pending')}
                  disabled={isUpdating || order.status === 'pending'}
                  className={`px-2 py-1 text-xs rounded-full ${order.status === 'pending' ? 'bg-gray-100 text-gray-400' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'} disabled:cursor-not-allowed`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => updateOrderStatus('processing')}
                  disabled={isUpdating || order.status === 'processing'}
                  className={`px-2 py-1 text-xs rounded-full ${order.status === 'processing' ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'} disabled:cursor-not-allowed`}
                >
                  Processing
                </button>
                <button 
                  onClick={() => updateOrderStatus('shipped')}
                  disabled={isUpdating || order.status === 'shipped'}
                  className={`px-2 py-1 text-xs rounded-full ${order.status === 'shipped' ? 'bg-gray-100 text-gray-400' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'} disabled:cursor-not-allowed`}
                >
                  Shipped
                </button>
                <button 
                  onClick={() => updateOrderStatus('delivered')}
                  disabled={isUpdating || order.status === 'delivered'}
                  className={`px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-800 hover:bg-green-200'} disabled:cursor-not-allowed`}
                >
                  Delivered
                </button>
                <button 
                  onClick={() => updateOrderStatus('cancelled')}
                  disabled={isUpdating || order.status === 'cancelled'}
                  className={`px-2 py-1 text-xs rounded-full ${order.status === 'cancelled' ? 'bg-gray-100 text-gray-400' : 'bg-red-100 text-red-800 hover:bg-red-200'} disabled:cursor-not-allowed`}
                >
                  Cancelled
                </button>
              </div>
              {isUpdating && (
                <p className="text-xs text-gray-500 mt-1">Updating status...</p>
              )}
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <address className="not-italic">
              <p>{order.user.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </address>
          </div>
          
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative">
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                            <div className="text-sm text-gray-500">{item.product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Order Summary */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-end">
                <div className="w-full md:w-1/3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="md:col-span-3 flex flex-wrap gap-4 justify-end mt-4">
            {order.status === 'delivered' && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Return Items
              </button>
            )}
            {(order.status === 'pending' || order.status === 'processing') && (
              <button 
                onClick={handleCancelOrder}
                disabled={isUpdating}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Order
              </button>
            )}
            <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage; 