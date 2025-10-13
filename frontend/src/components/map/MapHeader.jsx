import React from 'react';
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MapHeader() {
  const navigate = useNavigate();

  return (
      
        <div className="bg-blue-800 text-white px-4 py-3  flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Find Stations</h1>
        </div>
  );
}