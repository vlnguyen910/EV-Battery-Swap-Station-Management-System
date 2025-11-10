import { MoreVertical } from 'lucide-react';

export default function BatteryCard({ battery }) {
  if (!battery) return null;

  // Calculate percentage from database values
  const percentage = battery.capacity && battery.current_charge
    ? Math.max(0, Math.min(100, Math.round((battery.current_charge / battery.capacity) * 100)))
    : 0;

  // Format status label and get badge color
  const getStatusInfo = (status) => {
    const statusMap = {
      full: { label: 'Available', color: 'bg-green-100 text-green-800' },
      charging: { label: 'Charging', color: 'bg-yellow-100 text-yellow-800' },
      in_use: { label: 'In Use', color: 'bg-blue-100 text-blue-800' },
      booked: { label: 'Booked', color: 'bg-orange-100 text-orange-800' },
      defective: { label: 'Maintenance', color: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const getChargeBarColor = (percent) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSOHColor = (soh) => {
    if (soh >= 80) return { bar: 'bg-green-500', text: 'text-gray-800' };
    return { bar: 'bg-red-500', text: 'text-red-600' };
  };

  const statusInfo = getStatusInfo(battery.status);
  const sohColor = getSOHColor(battery.soh);
  const borderClass = battery.status === 'defective' ? 'border-red-300' : 'border-gray-200';

  return (
    <div className={`flex flex-col rounded-xl border ${borderClass} bg-white p-5 shadow-sm transition-shadow hover:shadow-lg`}>
      {/* Header with battery name and status badge */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold text-gray-900">
          Battery #{battery.battery_id}
        </p>
        <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color}`}>
          {statusInfo.label}
        </div>
      </div>

      {/* Model and Slot info */}
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>Model: <span className="font-medium text-gray-700">{battery.model || 'Unknown'}</span></span>
        <span>Slot: <span className="font-medium text-gray-700">{battery.slot_number || 'N/A'}</span></span>
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        {/* State of Charge */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-600">State of Charge</span>
            <span className="font-semibold text-gray-800">{percentage}%</span>
          </div>
          <div className="w-full overflow-hidden rounded-full bg-gray-200 h-2">
            <div
              className={`h-2 rounded-full ${getChargeBarColor(percentage)}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* State of Health */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-600">State of Health</span>
            <span className={`font-semibold ${sohColor.text}`}>{battery.soh}%</span>
          </div>
          <div className="w-full overflow-hidden rounded-full bg-gray-200 h-2">
            <div
              className={`h-2 rounded-full ${sohColor.bar}`}
              style={{ width: `${battery.soh}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* More options button */}
      <div className="mt-auto pt-4 text-right">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}