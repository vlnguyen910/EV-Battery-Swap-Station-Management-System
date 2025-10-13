import React from 'react';
import { Search } from 'lucide-react';

export default function MapSearchBar({ searchQuery, onSearch }) {
  return (
    <div className="bg-blue-600 px-4 pb-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search stations or locations..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
    </div>
  );
}