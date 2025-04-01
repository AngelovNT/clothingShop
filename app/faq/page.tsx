"use client";

import React, { useState } from 'react';
import Navbar from '../components/Navbar';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const faqItems: FAQItem[] = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by visiting the "Track Order" page and entering your order number. The order number can be found in your order confirmation email.',
      category: 'orders'
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase. Items must be unworn, unwashed, and with all original tags attached. Please visit our Returns page for more information.',
      category: 'returns'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business day delivery. International shipping may take 7-14 business days depending on the destination.',
      category: 'shipping'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Please note that international orders may be subject to customs fees and import duties.',
      category: 'shipping'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay.',
      category: 'payment'
    },
    {
      question: 'How do I find my size?',
      answer: 'You can refer to our size guide on each product page. We provide detailed measurements to help you find the perfect fit. If you\'re between sizes, we generally recommend sizing up.',
      category: 'products'
    },
    {
      question: 'Are your products sustainable?',
      answer: 'We are committed to sustainability and ethical manufacturing. Many of our products are made from organic or recycled materials, and we work with suppliers who adhere to fair labor practices.',
      category: 'products'
    },
    {
      question: 'How can I contact customer service?',
      answer: 'You can reach our customer service team through the Contact page on our website, by email at support@clothingshop.com, or by phone at +1 (555) 123-4567 during business hours (Monday-Friday, 9am-5pm EST).',
      category: 'support'
    },
    {
      question: 'Do you offer gift wrapping?',
      answer: 'Yes, we offer gift wrapping for a small additional fee. You can select this option during checkout and include a personalized message for the recipient.',
      category: 'orders'
    },
    {
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it. Please contact our customer service team immediately if you need to make changes to your order.',
      category: 'orders'
    },
    {
      question: 'Do you have physical stores?',
      answer: 'Currently, we operate exclusively online. This allows us to offer better prices and reach customers worldwide.',
      category: 'company'
    },
    {
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking on the "Register" link in the top navigation bar. You\'ll need to provide your email address and create a password. You can also create an account during checkout.',
      category: 'account'
    }
  ];
  
  const categories = ['all', ...Array.from(new Set(faqItems.map(item => item.category)))].sort();
  
  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        
        <div className="max-w-3xl mx-auto">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <FAQAccordion key={index} faq={faq} />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No FAQs found matching your criteria.</p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 text-indigo-600 hover:text-indigo-800"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
          
          {/* Contact Section */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-gray-600 mb-4">
              If you couldn't find the answer to your question, our customer support team is here to help.
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const FAQAccordion: React.FC<{ faq: FAQItem }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 focus:outline-none"
      >
        <span className="font-medium text-gray-900">{faq.question}</span>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700">{faq.answer}</p>
          <div className="mt-2 text-xs text-gray-500">
            Category: <span className="capitalize">{faq.category}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQPage; 