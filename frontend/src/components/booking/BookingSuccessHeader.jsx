import React from 'react';
import { CheckCircle, X } from 'lucide-react';

// Reusable header for booking success / cancelled screens
export default function BookingSuccessHeader({
  title = 'Booking Successful!',
  subtitle = 'Your battery swap has been successfully scheduled',
  variant = 'success', // 'success' | 'cancel'
}) {
  const isCancel = variant === 'cancel';

  return (
    <>
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isCancel ? 'bg-red-100' : 'bg-green-100'}`}>
          {isCancel ? (
            <X className="w-12 h-12 text-red-600" strokeWidth={3} />
          ) : (
            <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={3} />
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        {title}
      </h1>
      <p className="text-gray-600 text-center mb-8">
        {subtitle}
      </p>
    </>
  );
}
