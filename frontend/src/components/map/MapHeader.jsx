import React from 'react';
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MapHeader() {
  return (
      
        <div className="bg-blue-800 text-white px-4 py-3  flex items-center gap-3">
         <Link to="/driver">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
         </Link>
          <h1 className="text-lg font-semibold">Find Stations</h1>
        </div>
  );
}