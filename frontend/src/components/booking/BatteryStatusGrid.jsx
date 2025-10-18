// import React from 'react';
// import BatteryCard from './BatteryCard';

// export default function BatteryStatusGrid({ batteries }) {
//   return (
//     <div className="space-y-3 mb-8">
//       <div className="flex items-center justify-between">
//         <h4 className="text-sm font-medium text-gray-700">Battery Status</h4>
//         <div className="flex items-center space-x-4 text-xs">
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
//             <span className="text-gray-600">Ready</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
//             <span className="text-gray-600">Charging</span>
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-3">
//         {batteries.map((battery) => (
//           <BatteryCard key={battery.id} battery={battery} />
//         ))}
//       </div>
//     </div>
//   );
// }