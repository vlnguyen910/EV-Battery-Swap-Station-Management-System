import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"

export default function MapSearchBar({ searchQuery, onSearch }) {
  return (
    <div className="bg-white-800">
    <div className="bg-blue-800 px-4 py-3 rounded-lg shadow-md">
      <div className="flex items-center relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text"
          placeholder="Search stations..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-16 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 placeholder-gray-500 text-sm"
        />
      </div>
    </div>
    </div>
  );
}