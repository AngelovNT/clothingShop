"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  expiryDate: string;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
  applicableProducts: string[];
  applicableCategories: string[];
}

const CouponsPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [userCoupons, setUserCoupons] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Sample coupons for demonstration
  const sampleCoupons: Coupon[] = [
    {
      code: 'WELCOME10',
      description: 'Get 10% off your first order',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      isActive: true,
      usageLimit: 1,
      usageCount: 0,
      applicableProducts: [],
      applicableCategories: []
    },
    {
      code: 'SUMMER25',
      description: '25% off summer collection',
      discountType: 'percentage',
      discountValue: 25,
      minPurchase: 50,
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
      isActive: true,
      usageLimit: 1,
      usageCount: 0,
      applicableProducts: [],
      applicableCategories: ['summer']
    },
    {
      code: 'FREESHIP',
      description: 'Free shipping on all orders',
      discountType: 'fixed',
      discountValue: 5.99,
      minPurchase: 35,
      expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      isActive: true,
      usageLimit: 1,
      usageCount: 0,
      applicableProducts: [],
      applicableCategories: []
    },
    {
      code: 'SAVE20',
      description: '$20 off orders over $100',
      discountType: 'fixed',
      discountValue: 20,
      minPurchase: 100,
      expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
      isActive: true,
      usageLimit: 1,
      usageCount: 0,
      applicableProducts: [],
      applicableCategories: []
    }
  ];
  
  // Load coupons on initial render
  useEffect(() => {
    // In a real application, you would fetch coupons from your backend
    // For now, we'll use the sample coupons and filter based on active status
    const activeCoupons = sampleCoupons.filter(coupon => {
      const isExpired = new Date(coupon.expiryDate) < new Date();
      return coupon.isActive && !isExpired;
    });
    
    setAvailableCoupons(activeCoupons);
    
    // Load user's saved coupons from localStorage
    const savedCoupons = localStorage.getItem('user_coupons');
    if (savedCoupons) {
      try {
        setUserCoupons(JSON.parse(savedCoupons));
      } catch (error) {
        console.error('Failed to parse user coupons from localStorage:', error);
      }
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if coupon exists and is valid
      const coupon = sampleCoupons.find(c => c.code === couponCode.toUpperCase());
      
      if (!coupon) {
        setError('Invalid coupon code. Please check and try again.');
        return;
      }
      
      if (!coupon.isActive) {
        setError('This coupon is no longer active.');
        return;
      }
      
      if (new Date(coupon.expiryDate) < new Date()) {
        setError('This coupon has expired.');
        return;
      }
      
      if (userCoupons.includes(coupon.code)) {
        setError('You have already added this coupon to your account.');
        return;
      }
      
      // Add coupon to user's account
      const updatedUserCoupons = [...userCoupons, coupon.code];
      setUserCoupons(updatedUserCoupons);
      
      // Save to localStorage
      localStorage.setItem('user_coupons', JSON.stringify(updatedUserCoupons));
      
      // Show success message
      setSuccess(`Coupon "${coupon.code}" has been added to your account!`);
      setCouponCode('');
    } catch (err) {
      console.error('Error applying coupon:', err);
      setError('Failed to apply coupon. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% off`;
    } else {
      return `$${coupon.discountValue.toFixed(2)} off`;
    }
  };
  
  const formatExpiry = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const calculateDaysRemaining = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const removeCoupon = (code: string) => {
    const updatedUserCoupons = userCoupons.filter(c => c !== code);
    setUserCoupons(updatedUserCoupons);
    localStorage.setItem('user_coupons', JSON.stringify(updatedUserCoupons));
    setSuccess(`Coupon "${code}" has been removed from your account.`);
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Coupons & Discounts</h1>
        
        <div className="max-w-4xl mx-auto">
          {!isAuthenticated ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center mb-8">
              <h2 className="text-xl font-semibold mb-4">Please Log In</h2>
              <p className="text-gray-700 mb-6">
                You need to be logged in to view and apply coupons. Please log in or create an account to continue.
              </p>
              <button
                onClick={() => router.push('/login?redirect=/coupons')}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Log In
              </button>
            </div>
          ) : (
            <>
              {/* Apply Coupon Form */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Apply a Coupon</h2>
                
                {error && (
                  <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    {success}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <label htmlFor="couponCode" className="sr-only">Coupon Code</label>
                    <input
                      type="text"
                      id="couponCode"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Applying...' : 'Apply Coupon'}
                  </button>
                </form>
              </div>
              
              {/* Your Coupons */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Coupons</h2>
                
                {userCoupons.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">You don't have any coupons yet.</p>
                    <p className="text-gray-600 mt-2">Apply a coupon code above or browse available coupons below.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userCoupons.map(code => {
                      const coupon = availableCoupons.find(c => c.code === code);
                      if (!coupon) return null;
                      
                      const daysRemaining = calculateDaysRemaining(coupon.expiryDate);
                      
                      return (
                        <div key={code} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div>
                            <div className="flex items-center">
                              <span className="font-bold text-lg">{coupon.code}</span>
                              <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {formatDiscount(coupon)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{coupon.description}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              Expires: {formatExpiry(coupon.expiryDate)} ({daysRemaining} days remaining)
                            </p>
                            {coupon.minPurchase > 0 && (
                              <p className="text-gray-500 text-xs mt-1">
                                Minimum purchase: ${coupon.minPurchase.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeCoupon(code)}
                            className="mt-3 sm:mt-0 text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Available Coupons */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Available Coupons</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableCoupons.map(coupon => (
                <div key={coupon.code} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{coupon.code}</h3>
                        <p className="text-sm opacity-90">{coupon.description}</p>
                      </div>
                      <span className="text-xl font-bold">
                        {formatDiscount(coupon)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Minimum Purchase:</span>
                      <span>${coupon.minPurchase.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Expires:</span>
                      <span>{formatExpiry(coupon.expiryDate)}</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setCouponCode(coupon.code);
                        document.getElementById('couponCode')?.focus();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="mt-4 w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition text-sm"
                    >
                      Use This Coupon
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* How Coupons Work */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">How Coupons Work</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Find a Coupon</h3>
                <p className="text-gray-600 text-sm">
                  Browse available coupons or enter a coupon code you received via email or promotion.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Apply to Your Account</h3>
                <p className="text-gray-600 text-sm">
                  Add the coupon to your account to make it available during checkout.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Save at Checkout</h3>
                <p className="text-gray-600 text-sm">
                  Your available coupons will appear at checkout. Select one to apply the discount to your order.
                </p>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h3 className="font-medium mb-2">Coupon Terms & Conditions</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Coupons cannot be combined with other offers or discounts unless specifically stated.</li>
                <li>Some coupons may have minimum purchase requirements or may only apply to specific products or categories.</li>
                <li>Coupons must be applied before completing your purchase and cannot be applied retroactively.</li>
                <li>We reserve the right to modify or cancel any coupon at any time.</li>
                <li>Coupons have no cash value and cannot be transferred or sold.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponsPage; 