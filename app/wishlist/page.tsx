"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const WishlistPage = () => {
  const router = useRouter();
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    // Optionally remove from wishlist after adding to cart
    // removeItem(product._id);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist();
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          {items.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8">Add items to your wishlist to save them for later.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-lg font-bold mb-4">${product.price.toFixed(2)}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="bg-red-100 text-red-600 py-2 px-3 rounded-md hover:bg-red-200 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => router.push(`/products/${product._id}`)}
                    className="mt-2 w-full text-indigo-600 text-center py-2 hover:text-indigo-800 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage; 