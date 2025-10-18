import React from 'react';

export default function CountdownTimer({ timeRemaining }) {
  // Format time remaining as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 mb-6 text-white text-center">
      <p className="text-lg font-medium mb-2">Thời Gian Còn Lại</p>
      <div className="text-5xl font-bold font-mono mb-2">
        {formatTime(timeRemaining)}
      </div>
      <p className="text-sm opacity-90">
        Vui lòng đến trạm trong thời gian quy định
      </p>
    </div>
  );
}
