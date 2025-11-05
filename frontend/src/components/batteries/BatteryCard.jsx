import { getStatusBadgeColor, getChargeBarColor, getSOHBarColor } from '../../hooks/useBatteryHandler';

export default function BatteryCard({ battery }) {
  if (!battery) return null;

  // Calculate percentage from database values
  const percentage = battery.capacity && battery.current_charge
    ? Math.max(0, Math.min(100, Math.round((battery.current_charge / battery.capacity) * 100)))
    : 0;

  // Format status label for display
  const formatStatus = (status) => {
    const statusMap = {
      full: 'Available',
      charging: 'Charging',
      in_use: 'In Use',
      booked: 'Booked',
      defective: 'Defective'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="bg-white text-gray-900 p-3 rounded-lg w-[355px] shadow-sm border border-gray-200 flex-shrink-0">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {battery.name || `Battery ${battery.battery_id}`}
        </h2>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadgeColor(battery.status)}`}>
          {formatStatus(battery.status)}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-1">Slot {battery.slot_number || 'N/A'}</p>
      <p className="text-gray-600 text-sm">
        Model: <span className="font-semibold text-gray-900">{battery.model || 'Unknown'}</span>
      </p>

      {/* State of Charge */}
      <div className="mt-3">
        <p className="text-gray-500 text-sm mb-1">State of Charge:</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full ${getChargeBarColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-right text-sm font-semibold">{percentage}%</p>
      </div>

      {/* State of Health */}
      <div className="mt-3">
        <p className="text-gray-500 text-sm mb-1">State of Health:</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full ${getSOHBarColor(battery.soh)}`}
            style={{ width: `${battery.soh}%` }}
          ></div>
        </div>
        <p className="text-right text-sm font-semibold">{battery.soh}%</p>
      </div>
    </div>
  );
}