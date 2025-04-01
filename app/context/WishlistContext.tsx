"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  
  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
      }
    }
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);
  
  // Add item to wishlist
  const addItem = (product: Product) => {
    setItems(prevItems => {
      // Check if product already exists in wishlist
      if (prevItems.some(item => item._id === product._id)) {
        return prevItems;
      }
      
      // Add new item
      return [...prevItems, product];
    });
  };
  
  // Remove item from wishlist
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item._id !== productId));
  };
  
  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return items.some(item => item._id === productId);
  };
  
  // Clear wishlist
  const clearWishlist = () => {
    setItems([]);
  };
  
  // Calculate total items
  const totalItems = items.length;
  
  const value = {
    items,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist,
    totalItems
  };
  
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext; 