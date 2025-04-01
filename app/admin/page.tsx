"use client";

import React from 'react';
import Link from 'next/link';

const AdminDashboard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Welcome to Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard Cards */}
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Products</h3>
          <p className="text-gray-600">Manage your product inventory</p>
          <Link 
            href="/admin/products" 
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Products
          </Link>
        </div>
        
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Orders</h3>
          <p className="text-gray-600">Track and manage customer orders</p>
          <Link 
            href="/admin/orders" 
            className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            View Orders
          </Link>
        </div>
        
        <div className="bg-purple-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <p className="text-gray-600">Manage user accounts</p>
          <Link 
            href="/admin/users" 
            className="mt-4 inline-block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            View Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 