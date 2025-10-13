import React from 'react';
import { Clock } from 'lucide-react';

export default function TimeSlotGrid({ timeSlots, selectedTimeSlot, onTimeSlotSelect }) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Select time slot</h2>
      
      {/* Time Slots Grid */}
      <div className="grid grid-cols-3 gap-4">
        {timeSlots.map((timeSlot, index) => {
          const isSelected = selectedTimeSlot === timeSlot;
          const isLastSlot = index === timeSlots.length - 1;
          
          return (
            <button
              key={timeSlot}
              onClick={() => onTimeSlotSelect(timeSlot)}
              className={`
                h-20 rounded-lg border-2 transition-all duration-200 flex items-center justify-center font-medium
                ${isSelected 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }
                ${isLastSlot && !isSelected ? 'border-green-500 text-green-700' : ''}
              `}
            >
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                {timeSlot}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Time Info */}
      {selectedTimeSlot && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center text-green-800">
            <Clock size={20} className="mr-2" />
            <span className="font-medium">Selected: {selectedTimeSlot}</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Today, {new Date().toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}