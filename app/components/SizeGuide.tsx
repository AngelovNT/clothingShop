"use client";

import React, { useState } from 'react';

interface SizeGuideProps {
  category?: string;
}

const SizeGuide: React.FC<SizeGuideProps> = ({ category = 'general' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Size guide data based on category
  const getSizeGuideData = () => {
    switch (category.toLowerCase()) {
      case 'tops':
      case 'shirts':
      case 't-shirts':
        return {
          title: 'Tops Size Guide',
          headers: ['Size', 'Chest (in)', 'Waist (in)', 'Length (in)'],
          rows: [
            ['XS', '34-36', '28-30', '26-27'],
            ['S', '36-38', '30-32', '27-28'],
            ['M', '38-40', '32-34', '28-29'],
            ['L', '40-42', '34-36', '29-30'],
            ['XL', '42-44', '36-38', '30-31'],
            ['XXL', '44-46', '38-40', '31-32']
          ]
        };
      case 'bottoms':
      case 'pants':
      case 'jeans':
        return {
          title: 'Bottoms Size Guide',
          headers: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)'],
          rows: [
            ['XS', '28-30', '34-36', '30-31'],
            ['S', '30-32', '36-38', '31-32'],
            ['M', '32-34', '38-40', '32-33'],
            ['L', '34-36', '40-42', '33-34'],
            ['XL', '36-38', '42-44', '34-35'],
            ['XXL', '38-40', '44-46', '35-36']
          ]
        };
      case 'shoes':
      case 'footwear':
        return {
          title: 'Footwear Size Guide',
          headers: ['US Size', 'EU Size', 'UK Size', 'Foot Length (in)'],
          rows: [
            ['7', '40', '6', '9.6'],
            ['8', '41', '7', '9.9'],
            ['9', '42', '8', '10.2'],
            ['10', '43', '9', '10.5'],
            ['11', '44', '10', '10.8'],
            ['12', '45', '11', '11.1']
          ]
        };
      default:
        return {
          title: 'General Size Guide',
          headers: ['Size', 'US', 'EU', 'UK'],
          rows: [
            ['XS', '0-2', '32-34', '4-6'],
            ['S', '4-6', '36-38', '8-10'],
            ['M', '8-10', '40-42', '12-14'],
            ['L', '12-14', '44-46', '16-18'],
            ['XL', '16-18', '48-50', '20-22'],
            ['XXL', '20-22', '52-54', '24-26']
          ]
        };
    }
  };
  
  const sizeData = getSizeGuideData();
  
  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm text-gray-600 hover:text-black focus:outline-none"
      >
        <svg
          className={`mr-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
        Size Guide
      </button>
      
      {isOpen && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-4 animate-fadeIn">
          <h3 className="text-lg font-semibold mb-3">{sizeData.title}</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {sizeData.headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sizeData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          cellIndex === 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p className="mb-2">How to measure:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
              <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
              <li><strong>Hip:</strong> Measure around the fullest part of your hips.</li>
              <li><strong>Inseam:</strong> Measure from the crotch to the bottom of the leg.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeGuide; 