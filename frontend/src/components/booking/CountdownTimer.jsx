import React from 'react';
import { Timer } from 'lucide-react';

export default function CountdownTimer({ timeRemaining }) {
  // Format time remaining as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-blue-800 rounded-xl p-6 mb-6 text-white text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Timer className="w-6 h-6" />
        <p className="text-lg font-medium">Time Remaining</p>
      </div>
      <div className="text-5xl font-bold font-mono mb-2">
        {formatTime(timeRemaining)}
      </div>
      <p className="text-sm opacity-90">
        Please arrive at the station within the specified time
      </p>
    </div>
  );
}
