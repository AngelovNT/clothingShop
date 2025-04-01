"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { Product } from './types';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/products', {
          params: { limit: 4 }
        });
        setFeaturedProducts(response.data.products || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Welcome to Clothing Shop
            </h1>
            <p className="mt-4 text-xl text-gray-300">
              Discover the latest fashion trends and styles
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/products"
                className="inline-block bg-indigo-600 px-5 py-3 rounded-md font-semibold text-white hover:bg-indigo-700"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-500 mt-1">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-gray-900 font-bold">${product.price.toFixed(2)}</span>
                    <Link
                      href={`/products/${product._id}`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-block text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View All Products →
          </Link>
        </div>
      </div>
      
      {/* Categories Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Shop by Category</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-40 bg-indigo-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-800">Men</span>
              </div>
              <div className="p-4 text-center">
                <Link
                  href="/products?category=men"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Shop Men's Collection
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-40 bg-pink-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-pink-800">Women</span>
              </div>
              <div className="p-4 text-center">
                <Link
                  href="/products?category=women"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Shop Women's Collection
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-40 bg-yellow-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-800">Accessories</span>
              </div>
              <div className="p-4 text-center">
                <Link
                  href="/products?category=accessories"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Shop Accessories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Clothing Shop</h3>
              <p className="text-gray-300">
                Your one-stop shop for the latest fashion trends and styles.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-300 hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-gray-300 hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-gray-300 hover:text-white">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-300">
                Email: info@clothingshop.com<br />
                Phone: (123) 456-7890<br />
                Address: 123 Fashion St, Style City
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-300">
              &copy; {new Date().getFullYear()} Clothing Shop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
