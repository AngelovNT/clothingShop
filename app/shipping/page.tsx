"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const ShippingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Shipping Options</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shipping Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estimated Delivery
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Standard Shipping
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      3-5 business days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $5.99 (Free on orders over $50)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Express Shipping
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      1-2 business days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $12.99
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      International Shipping
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      7-14 business days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Varies by location
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Shipping Policies</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Order Processing</h3>
                <p className="text-gray-700">
                  All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Shipping Destinations</h3>
                <p className="text-gray-700">
                  We currently ship to all 50 U.S. states and select international destinations. For international orders, please note that you may be responsible for duties, taxes, and customs clearance fees. These charges are not included in the shipping cost or product price.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Tracking Information</h3>
                <p className="text-gray-700">
                  Once your order ships, you will receive a shipping confirmation email with a tracking number. You can track your order by clicking the tracking link in the email or by visiting the <Link href="/track-order" className="text-indigo-600 hover:text-indigo-800">Track Order</Link> page on our website.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Shipping Delays</h3>
                <p className="text-gray-700">
                  While we make every effort to ship orders within the timeframes listed above, occasionally delays may occur due to unforeseen circumstances such as weather conditions, postal service issues, or high volume periods (like holidays). We appreciate your understanding if such delays occur.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">International Shipping</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Countries We Ship To</h3>
                <p className="text-gray-700">
                  We currently ship to the following countries: Canada, United Kingdom, Australia, New Zealand, Japan, South Korea, and most European Union countries. If your country is not listed, please <Link href="/contact" className="text-indigo-600 hover:text-indigo-800">contact us</Link> to inquire about shipping options.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Customs & Import Taxes</h3>
                <p className="text-gray-700">
                  International customers are responsible for all customs duties, import taxes, and any other fees that may be imposed by your country's customs authorities. These charges are not included in the shipping cost or product price and will be collected by the delivery carrier or customs office.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Delivery Timeframes</h3>
                <p className="text-gray-700">
                  International delivery times vary by destination and may take 7-14 business days or longer, depending on customs processing in your country. We are not responsible for delays due to customs processing or local delivery conditions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our shipping policies or need assistance with a specific order, please don't hesitate to contact us.
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

export default ShippingPage; 