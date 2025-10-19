import React from 'react';

export default function InstructionsCard() {
  const instructions = [
    'Đến trạm pin trong thời gian quy định',
    'Xuất trình mã đặt lịch tại trạm',
    'Thực hiện thay pin theo hướng dẫn'
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-5">
      <h3 className="font-bold text-gray-900 mb-4 text-lg">Hướng Dẫn</h3>
      
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
