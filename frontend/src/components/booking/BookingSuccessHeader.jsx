import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function BookingSuccessHeader() {
  return (
    <>
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={3} />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        Booking Successful!
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Your battery swap has been successfully scheduled
      </p>
    </>
  );
}
