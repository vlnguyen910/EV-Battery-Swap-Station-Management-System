// import React from 'react';
// import { Battery } from 'lucide-react';

// export default function AvailableSlotsCard({ availableSlots, totalSlots }) {
//   return (
//     <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center">
//           <Battery className="text-green-600 mr-2" size={20} />
//           <span className="font-medium text-green-800">Available Batteries</span>
//         </div>
//         <span className="text-lg font-bold text-green-800">
//           {availableSlots}/{totalSlots}
//         </span>
//       </div>
//       <div className="text-sm text-green-700">
//         <div className="flex items-center justify-between">
//           <span>Ready for swap: {availableSlots}</span>
//           <span>Currently charging: {totalSlots - availableSlots}</span>
//         </div>
//       </div>
//     </div>
//   );
// }