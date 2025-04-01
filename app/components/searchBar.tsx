import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, placeholder = "Search..." }) => (
  <input
    type="text"
    placeholder={placeholder}
    className="border p-2 mb-4 w-full"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
);

export default SearchBar;
