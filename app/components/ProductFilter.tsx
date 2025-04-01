"use client";

import React, { useState } from 'react';

interface FilterOptions {
  categories: string[];
  priceRanges: { min: number; max: number; label: string }[];
  sizes: string[];
  colors: string[];
}

interface ProductFilterProps {
  options: FilterOptions;
  onFilterChange: (filters: {
    categories: string[];
    priceRange: { min: number; max: number } | null;
    sizes: string[];
    colors: string[];
    sortBy: string;
  }) => void;
  className?: string;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  options,
  onFilterChange,
  className = '',
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      const updated = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      updateFilters({ categories: updated });
      return updated;
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setSelectedPriceRange({ min, max });
    updateFilters({ priceRange: { min, max } });
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => {
      const updated = prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size];
      
      updateFilters({ sizes: updated });
      return updated;
    });
  };

  const handleColorChange = (color: string) => {
    setSelectedColors(prev => {
      const updated = prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color];
      
      updateFilters({ colors: updated });
      return updated;
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sortBy: value });
  };

  const updateFilters = (updates: Partial<{
    categories: string[];
    priceRange: { min: number; max: number } | null;
    sizes: string[];
    colors: string[];
    sortBy: string;
  }>) => {
    onFilterChange({
      categories: updates.categories ?? selectedCategories,
      priceRange: updates.priceRange ?? selectedPriceRange,
      sizes: updates.sizes ?? selectedSizes,
      colors: updates.colors ?? selectedColors,
      sortBy: updates.sortBy ?? sortBy,
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortBy('newest');
    
    onFilterChange({
      categories: [],
      priceRange: null,
      sizes: [],
      colors: [],
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = () => {
    return (
      selectedCategories.length > 0 ||
      selectedPriceRange !== null ||
      selectedSizes.length > 0 ||
      selectedColors.length > 0 ||
      sortBy !== 'newest'
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4 border-b">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-between w-full"
        >
          <span className="font-medium">Filters</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${isFilterOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
        {/* Sort By */}
        <div className="p-4 border-b">
          <h3 className="font-medium mb-3">Sort By</h3>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="newest">Newest</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="name_a_z">Name: A to Z</option>
            <option value="name_z_a">Name: Z to A</option>
          </select>
        </div>

        {/* Categories */}
        <div className="p-4 border-b">
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            {options.categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-2"
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="p-4 border-b">
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-2">
            {options.priceRanges.map((range) => (
              <label key={range.label} className="flex items-center">
                <input
                  type="radio"
                  checked={selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max}
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                  className="mr-2"
                  name="priceRange"
                />
                <span className="text-sm">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sizes */}
        {options.sizes.length > 0 && (
          <div className="p-4 border-b">
            <h3 className="font-medium mb-3">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {options.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    selectedSizes.includes(size)
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {options.colors.length > 0 && (
          <div className="p-4 border-b">
            <h3 className="font-medium mb-3">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {options.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColors.includes(color)
                      ? 'border-black'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <div className="p-4">
            <button
              onClick={clearFilters}
              className="w-full py-2 text-sm text-red-600 hover:text-red-800"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilter; 