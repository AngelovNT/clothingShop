"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';

import SizeGuide from '../../components/SizeGuide';

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistUpdated, setWishlistUpdated] = useState(false);
  
  // Related products
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  
  // Use a ref to track if we've already added to recently viewed
  const addedToRecentlyViewedRef = useRef(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/products/${params.id}`);
        setProduct(response.data);
        
        // Add to recently viewed only once
        if (!addedToRecentlyViewedRef.current && response.data) {
          addToRecentlyViewed(response.data);
          addedToRecentlyViewedRef.current = true;
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Reset the ref when the product ID changes
    addedToRecentlyViewedRef.current = false;
    
    if (params.id) {
      fetchProduct();
    }
  }, [params.id, addToRecentlyViewed]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;
      
      try {
        setRelatedLoading(true);
        const response = await axios.get(`http://localhost:5000/products?category=${product.category}&limit=4`);
        // Filter out the current product
        const filtered = response.data.filter((p: Product) => p._id !== product._id);
        setRelatedProducts(filtered.slice(0, 4)); // Limit to 4 products
      } catch (err) {
        console.error('Error fetching related products:', err);
      } finally {
        setRelatedLoading(false);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      addItem(product, quantity);
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    
    try {
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
      } else {
        addToWishlist(product);
      }
      
      setWishlistUpdated(true);
      setTimeout(() => setWishlistUpdated(false), 3000);
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error || 'Product not found'}
          </div>
          <div className="mt-6">
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-700">
                Home
              </button>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <button onClick={() => router.push('/products')} className="text-gray-500 hover:text-gray-700">
                Products
              </button>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-700 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>
        
        {/* Success Messages */}
        {addedToCart && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">Product added to cart successfully!</span>
          </div>
        )}
        
        {wishlistUpdated && (
          <div className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">
              {isInWishlist(product._id) 
                ? 'Product added to wishlist successfully!' 
                : 'Product removed from wishlist successfully!'}
            </span>
          </div>
        )}
        
        {/* Product Details */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product Image */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
            </div>
            
            {/* Stock Status */}
            <div className="mt-3">
              {product.stock > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
            </div>
            
            {/* Category */}
            <div className="mt-3">
              <span className="text-sm text-gray-500">Category: </span>
              <span className="text-sm font-medium text-gray-900">{product.category}</span>
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="mt-2 prose prose-sm text-gray-500">
                <p>{product.description}</p>
              </div>
            </div>
            
            {/* Size Guide */}
            <SizeGuide category={product.category} />
            
            {/* Add to Cart */}
            <div className="mt-8">
              {product.stock > 0 ? (
                <>
                  <div className="flex items-center">
                    <span className="mr-3 text-sm font-medium text-gray-700">Quantity</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        type="button"
                        onClick={decrementQuantity}
                        className="p-2 text-gray-500 hover:text-gray-600"
                        disabled={quantity <= 1}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-12 text-center border-0 focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={incrementQuantity}
                        className="p-2 text-gray-500 hover:text-gray-600"
                        disabled={quantity >= product.stock}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={addToCart}
                      disabled={addingToCart}
                      className="flex-1 bg-black border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={toggleWishlist}
                      className={`flex items-center justify-center rounded-md py-3 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                        isInWishlist(product._id) 
                          ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill={isInWishlist(product._id) ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={isInWishlist(product._id) ? "0" : "2"} 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full bg-gray-300 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-500 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Related Products</h2>
            
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="group relative">
                  <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <button onClick={() => router.push(`/products/${relatedProduct._id}`)}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {relatedProduct.name}
                        </button>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{relatedProduct.category}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage; 