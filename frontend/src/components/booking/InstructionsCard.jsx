import React from 'react';
import { ListOrdered } from 'lucide-react';

export default function InstructionsCard() {
  const instructions = [
    'Arrive at the station within the specified time',
    'Present your booking code at the station',
    'Follow the instructions to complete the battery swap'
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <ListOrdered className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-900 text-lg">Instructions</h3>
      </div>
      
      <div className="space-y-3">
        {instructions.map((instruction, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            <p className="text-sm text-gray-700 pt-1">
              {instruction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
