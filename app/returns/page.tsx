"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const ReturnsPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Returns & Exchanges Policy</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Our Promise</h2>
            <p className="text-gray-700 mb-4">
              We want you to be completely satisfied with your purchase. If you're not happy with your order for any reason, we're here to help.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Return Eligibility</h3>
                <p className="text-gray-700">
                  You may return most new, unopened items within 30 days of delivery for a full refund. We'll also pay the return shipping costs if the return is a result of our error (you received an incorrect or defective item, etc.).
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Return Process</h3>
                <p className="text-gray-700">
                  To start a return, please contact us at returns@clothingshop.com or through our <Link href="/contact" className="text-indigo-600 hover:text-indigo-800">Contact Page</Link>. Please include your order number and the reason for your return.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Return Conditions</h3>
                <p className="text-gray-700">
                  To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Non-Returnable Items</h3>
                <p className="text-gray-700">
                  Some items cannot be returned, including:
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-700">
                  <li>Gift cards</li>
                  <li>Downloadable products</li>
                  <li>Personalized items</li>
                  <li>Intimate items (for health and hygiene reasons)</li>
                  <li>Sale items (unless defective)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Exchange Policy</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Exchange Eligibility</h3>
                <p className="text-gray-700">
                  If you need to exchange an item for the same item in a different size or color, we're happy to help. Exchanges are subject to the same conditions as returns.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Exchange Process</h3>
                <p className="text-gray-700">
                  To start an exchange, please contact us at returns@clothingshop.com or through our <Link href="/contact" className="text-indigo-600 hover:text-indigo-800">Contact Page</Link>. Please include your order number, the item you wish to exchange, and the size/color you'd like instead.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Refunds</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Refund Processing</h3>
                <p className="text-gray-700">
                  Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                </p>
                <p className="text-gray-700 mt-2">
                  If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Late or Missing Refunds</h3>
                <p className="text-gray-700">
                  If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted. If you've done all of this and you still have not received your refund yet, please contact us.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our returns and exchanges policy, please don't hesitate to contact us.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="/contact" 
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Contact Us
              </Link>
              <Link 
                href="/faq" 
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-200 transition"
              >
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnsPage; 