"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useCart } from '../context/CartContext';
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

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'paypal';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  [key: string]: any; // Add index signature to allow dynamic access
}

const CheckoutPage = () => {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, loading, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !loading) {
      router.push('/cart');
    }
  }, [items, loading, router]);

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: {
          street: user.address?.street || prev.address.street,
          city: user.address?.city || prev.address.city,
          state: user.address?.state || prev.address.state,
          zipCode: user.address?.zipCode || prev.address.zipCode,
          country: user.address?.country || prev.address.country,
        }
      }));
    }
  }, [user]);

  // Load user's coupons
  useEffect(() => {
    if (isAuthenticated) {
      // Load user's saved coupons from localStorage
      const savedCoupons = localStorage.getItem('user_coupons');
      if (savedCoupons) {
        try {
          const userCouponCodes = JSON.parse(savedCoupons);
          
          // Get all available coupons
          const allCoupons: Coupon[] = [
            {
              code: 'WELCOME10',
              description: 'Get 10% off your first order',
              discountType: 'percentage',
              discountValue: 10,
              minPurchase: 0,
              expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
              expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
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
              expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
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
              expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              usageLimit: 1,
              usageCount: 0,
              applicableProducts: [],
              applicableCategories: []
            }
          ];
          
          // Filter coupons that the user has saved and are valid
          const userCoupons = allCoupons.filter(coupon => {
            const isExpired = new Date(coupon.expiryDate) < new Date();
            const isUserCoupon = userCouponCodes.includes(coupon.code);
            const meetsMinPurchase = totalPrice >= coupon.minPurchase;
            
            return isUserCoupon && coupon.isActive && !isExpired && meetsMinPurchase;
          });
          
          setAvailableCoupons(userCoupons);
        } catch (error) {
          console.error('Failed to parse user coupons from localStorage:', error);
        }
      }
    }
  }, [isAuthenticated, totalPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CheckoutFormData] as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCouponSelect = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
    setCouponCode(coupon.code);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    setIsApplyingCoupon(true);
    setCouponError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if coupon exists and is valid
      const allCoupons: Coupon[] = [
        {
          code: 'WELCOME10',
          description: 'Get 10% off your first order',
          discountType: 'percentage',
          discountValue: 10,
          minPurchase: 0,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
          expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
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
          expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
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
          expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          usageLimit: 1,
          usageCount: 0,
          applicableProducts: [],
          applicableCategories: []
        }
      ];
      
      const coupon = allCoupons.find(c => c.code === couponCode.toUpperCase());
      
      if (!coupon) {
        setCouponError('Invalid coupon code. Please check and try again.');
        setAppliedCoupon(null);
        return;
      }
      
      if (!coupon.isActive) {
        setCouponError('This coupon is no longer active.');
        setAppliedCoupon(null);
        return;
      }
      
      if (new Date(coupon.expiryDate) < new Date()) {
        setCouponError('This coupon has expired.');
        setAppliedCoupon(null);
        return;
      }
      
      if (totalPrice < coupon.minPurchase) {
        setCouponError(`This coupon requires a minimum purchase of $${coupon.minPurchase.toFixed(2)}.`);
        setAppliedCoupon(null);
        return;
      }
      
      // Apply the coupon
      setAppliedCoupon(coupon);
      
      // Add to user's coupons if not already there
      const savedCoupons = JSON.parse(localStorage.getItem('user_coupons') || '[]');
      if (!savedCoupons.includes(coupon.code)) {
        const updatedCoupons = [...savedCoupons, coupon.code];
        localStorage.setItem('user_coupons', JSON.stringify(updatedCoupons));
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      setCouponError('Failed to apply coupon. Please try again later.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.discountType === 'percentage') {
      return (totalPrice * appliedCoupon.discountValue) / 100;
    } else {
      return appliedCoupon.discountValue;
    }
  };

  const finalTotal = () => {
    const discount = calculateDiscount();
    return Math.max(0, totalPrice - discount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!formData.address.street || !formData.address.city || !formData.address.zipCode || !formData.address.country) {
      setError('Please fill in all address fields');
      return;
    }
    
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        setError('Please fill in all payment details');
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      // Create order
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: finalTotal(), // Use final total with discount applied
        discount: calculateDiscount(),
        couponCode: appliedCoupon?.code || null,
        shippingAddress: formData.address,
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentMethod === 'credit_card' ? {
          cardNumber: formData.cardNumber,
          cardExpiry: formData.cardExpiry,
          cardCvc: formData.cardCvc
        } : undefined
      };
      
      const response = await axios.post('http://localhost:5000/orders', orderData);
      
      // Store order in localStorage for mock implementation
      const completedOrder = {
        _id: response.data?._id || Date.now().toString(), // Use response ID or timestamp if not available
        user: user!,
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: totalPrice,
        shippingAddress: formData.address,
        status: 'processing',
        paymentMethod: formData.paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Get existing orders or initialize empty array
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      // Add new order to the beginning of the array
      localStorage.setItem('orders', JSON.stringify([completedOrder, ...existingOrders]));
      
      // Clear cart and show success message
      clearCart();
      setSuccess(true);
      
      // Redirect to order confirmation page
      setTimeout(() => {
        router.push(`/orders/${response.data._id}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to process your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-8">
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p>Thank you for your purchase. You will be redirected to your order details.</p>
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Address</h3>
              
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="address.state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      id="address.zipCode"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      id="address.country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="credit_card"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <label htmlFor="credit_card" className="ml-2 block text-sm font-medium text-gray-700">
                    Credit Card
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <label htmlFor="paypal" className="ml-2 block text-sm font-medium text-gray-700">
                    PayPal
                  </label>
                </div>
              </div>
              
              {formData.paymentMethod === 'credit_card' && (
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required={formData.paymentMethod === 'credit_card'}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date *
                      </label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        required={formData.paymentMethod === 'credit_card'}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                        CVC/CVV *
                      </label>
                      <input
                        type="text"
                        id="cardCvc"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        required={formData.paymentMethod === 'credit_card'}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.product._id} className="py-4 flex">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Coupon Section */}
              <div className="mt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Apply Coupon</h3>
                  {availableCoupons.length > 0 && !appliedCoupon && (
                    <button
                      type="button"
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                      onClick={() => document.getElementById('couponDropdown')?.classList.toggle('hidden')}
                    >
                      View available coupons
                    </button>
                  )}
                </div>
                
                {availableCoupons.length > 0 && !appliedCoupon && (
                  <div id="couponDropdown" className="hidden mb-3 bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-600 mb-2">Select a coupon to apply:</p>
                    <div className="space-y-2">
                      {availableCoupons.map(coupon => (
                        <div 
                          key={coupon.code} 
                          className="flex justify-between items-center p-2 bg-white rounded border border-gray-200 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleCouponSelect(coupon)}
                        >
                          <div>
                            <p className="text-sm font-medium">{coupon.code}</p>
                            <p className="text-xs text-gray-500">{coupon.description}</p>
                          </div>
                          <div className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {coupon.discountType === 'percentage' 
                              ? `${coupon.discountValue}% off` 
                              : `$${coupon.discountValue.toFixed(2)} off`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                    <div>
                      <p className="text-sm font-medium text-green-800">{appliedCoupon.code} applied</p>
                      <p className="text-xs text-green-700">
                        {appliedCoupon.discountType === 'percentage' 
                          ? `${appliedCoupon.discountValue}% off` 
                          : `$${appliedCoupon.discountValue.toFixed(2)} off`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                )}
                
                {couponError && (
                  <p className="mt-2 text-xs text-red-600">{couponError}</p>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between py-2">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between py-2 text-green-700">
                    <span>Discount</span>
                    <span>-${calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax</span>
                  <span>Calculated at next step</span>
                </div>
                
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${finalTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage; 