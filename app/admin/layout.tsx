"use client";

import React from 'react';
import AdminRoute from '../components/AdminRoute';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white">
          <div className="p-4">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          </div>
          <nav className="mt-4">
            <ul>
              <li>
                <Link 
                  href="/admin" 
                  className="block py-2 px-4 hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/products" 
                  className="block py-2 px-4 hover:bg-gray-700"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/orders" 
                  className="block py-2 px-4 hover:bg-gray-700"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/users" 
                  className="block py-2 px-4 hover:bg-gray-700"
                >
                  Users
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="block py-2 px-4 text-gray-400 hover:bg-gray-700"
                >
                  Back to Store
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </AdminRoute>
  );
} 