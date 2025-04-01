"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const CartPage = () => {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setIsUpdating(true);
    updateQuantity(productId, newQuantity);
    setTimeout(() => setIsUpdating(false), 500);
  };

  const handleRemoveItem = (productId: string) => {
    setIsUpdating(true);
    removeItem(productId);
    setTimeout(() => setIsUpdating(false), 500);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        {totalItems === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              href="/products" 
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Cart Items ({totalItems})</h2>
                  
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={item.product._id} className="py-6 flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 relative w-full sm:w-24 h-24 mb-4 sm:mb-0">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        
                        <div className="flex-1 sm:ml-6">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium">
                                <Link href={`/products/${item.product._id}`} className="hover:underline">
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">${item.product.price.toFixed(2)}</p>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                disabled={isUpdating}
                                className="px-3 py-1 border-r hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="px-4 py-1">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                disabled={isUpdating || item.quantity >= item.product.stock}
                                className="px-3 py-1 border-l hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.product._id)}
                              disabled={isUpdating}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-4 text-center">
                  <Link href="/products" className="text-sm text-gray-600 hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage; 