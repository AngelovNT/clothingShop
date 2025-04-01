"use client";

import React from 'react';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface RecentlyViewedProps {
  className?: string;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ className = '' }) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, isInWishlist } = useWishlist();
  
  if (recentlyViewed.length === 0) {
    return null;
  }
  
  return (
    <div className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recently Viewed</h2>
          <button
            onClick={clearRecentlyViewed}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recentlyViewed.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <Link href={`/products/${product._id}`} className="block">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform hover:scale-105"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                </div>
              </Link>
              
              <div className="px-4 pb-4 flex space-x-2">
                <button
                  onClick={() => addToCart(product, 1)}
                  className="flex-1 bg-black text-white text-xs py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => addToWishlist(product)}
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                  aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill={isInWishlist(product._id) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed; 