"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  
  // Load recently viewed products from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
      if (savedRecentlyViewed) {
        try {
          setRecentlyViewed(JSON.parse(savedRecentlyViewed));
        } catch (error) {
          console.error('Failed to parse recently viewed products from localStorage:', error);
        }
      }
    }
  }, []);
  
  // Save recently viewed products to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && recentlyViewed.length > 0) {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed]);
  
  // Memoize the addToRecentlyViewed function to prevent unnecessary re-renders
  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed(prev => {
      // Check if product is already in the list to avoid unnecessary updates
      if (prev.some(item => item._id === product._id)) {
        // If it's already the first item, don't update state at all
        if (prev[0]?._id === product._id) {
          return prev;
        }
        // Otherwise, remove it and add to beginning
        const filtered = prev.filter(item => item._id !== product._id);
        return [product, ...filtered].slice(0, 10);
      }
      
      // Add the product to the beginning of the list
      const updated = [product, ...prev];
      
      // Keep only the last 10 items
      return updated.slice(0, 10);
    });
  }, []);
  
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentlyViewed');
    }
  }, []);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed
  }), [recentlyViewed, addToRecentlyViewed, clearRecentlyViewed]);
  
  return (
    <RecentlyViewedContext.Provider value={contextValue}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}; 