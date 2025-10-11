import { getChargePercentage, getBatteryStatusInfo } from '../../data/mockBatteryData';

export default function BatteryCard({ battery }) {
  if (!battery) return null;

  const percentage = getChargePercentage(battery);
  const statusInfo = getBatteryStatusInfo(battery);

  const getStatusBadgeColor = (status) => {
    const colors = {
      charging: 'bg-yellow-500 text-black',
      full: 'bg-green-500 text-white',
      taken: 'bg-blue-500 text-white',
      booked: 'bg-orange-500 text-white',
      defective: 'bg-red-500 text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const getChargeBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSOHBarColor = (soh) => {
    if (soh >= 90) return 'bg-green-600';
    if (soh >= 80) return 'bg-yellow-600';
    if (soh >= 60) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <div className="bg-[#0f172a] text-white p-4 rounded-lg w-full max-w-[280px] shadow-md border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">BAT{String(battery.battery_id).padStart(3, '0')}</h2>
        <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusBadgeColor(battery.status)}`}>
          {statusInfo.label}
        </span>
      </div>

      <p className="text-gray-300 text-sm mb-1">Slot {battery.slot_number}</p>
      <p className="text-gray-300 text-sm">
        Model: <span className="font-semibold text-white">{battery.model}</span>
      </p>

      {/* State of Charge */}
      <div className="mt-3">
        <p className="text-gray-300 text-sm mb-1">State of Charge:</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full ${getChargeBarColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-right text-sm font-semibold">{percentage}%</p>
      </div>

      {/* State of Health */}
      <div className="mt-3">
        <p className="text-gray-300 text-sm mb-1">State of Health:</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full ${getSOHBarColor(battery.soh)}`}
            style={{ width: `${battery.soh}%` }}
          ></div>
        </div>
        <p className="text-right text-sm font-semibold">{battery.soh}%</p>
      </div>

      {/* Alerts */}
      {statusInfo.alerts.length > 0 && (
        <div className="mt-3 space-y-2">
          {statusInfo.alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm border ${alert.type === 'warning'
                ? 'bg-yellow-900/40 border-yellow-600 text-yellow-400'
                : 'bg-red-900/40 border-red-700 text-red-400'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {alert.type === 'warning' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-3L13.73 5a2 2 0 00-3.46 0L3.33 16a2 2 0 001.74 3z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}