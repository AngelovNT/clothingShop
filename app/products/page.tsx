// pages/ProductPage.tsx

"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../types';

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Function to handle JSON file upload
// Function to handle JSON file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const fileContent = e.target?.result as string;
        console.log('File content:', fileContent); // Debugging line to check file content
        const json = JSON.parse(fileContent);

        if (Array.isArray(json)) {
          console.log('Parsed JSON:', json); // Check the parsed JSON format in the console
          const response = await axios.post('http://localhost:5000/products/add-products', { products: json });
          console.log('Response from server:', response.data); // Log the server response
          setProducts((prevProducts) => [...prevProducts, ...response.data]);
        } else {
          console.error('Invalid JSON format:', json);
          alert('Invalid JSON format');
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error reading JSON file');
      }
    };

    reader.onerror = () => {
      console.error('FileReader encountered an error while reading the file.');
      alert('Error reading the file');
    };

    reader.readAsText(file);
  };



  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Page</h1>

      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="mb-4"
      />

      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-800 text-white">Product Name</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product,id) => (
              <tr key={id + "-p"} className="text-center border-t">
                <td className="px-4 py-2">{product.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={1} className="px-4 py-2 text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPage;
