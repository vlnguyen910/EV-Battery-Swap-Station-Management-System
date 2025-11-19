// //KHONG BIET CAI NAY DE LAM GI
// import { Card, CardContent, CardHeader } from "../ui/card"
// import { Button } from "../ui/button"
// import { Link } from "react-router-dom"
// import { Battery, X, Loader2 } from "lucide-react"
// import { useState, useEffect } from 'react'
// import { useAuth } from '../../hooks/useContext'
// import { vehicleService } from '../../services/vehicleService'
// import { batteryService } from '../../services/batteryService'
// import { parseBatteryNumber } from '../../utils/battery'
// import { toast } from 'sonner'

// export default function VehicleStatus() {
//   const { user } = useAuth();
//   const [vehicle, setVehicle] = useState(null);
//   const [battery, setBattery] = useState(null);
//   const [batteryLevelState, setBatteryLevelState] = useState(null);
//   const [sohState, setSohState] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [noBatteryAssigned, setNoBatteryAssigned] = useState(false);
  
//   // State for charge update modal
//   const [showChargeModal, setShowChargeModal] = useState(false);
//   const [chargeInput, setChargeInput] = useState('');
//   const [updatingCharge, setUpdatingCharge] = useState(false);

//   useEffect(() => {
//     let mounted = true;
//     const fetchData = async () => {
//       const userId = user?.id ?? user?.user_id;
//       if (!userId) {
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       setError(null);
//       try {
//         let vehicles = await vehicleService.getVehicleByUserId(userId);
//         // normalize common wrappers: { data: [...] } or { vehicles: [...] }
//         if (vehicles?.data) vehicles = vehicles.data;
//         else if (vehicles?.vehicles) vehicles = vehicles.vehicles;
//         const vehicleEntity = Array.isArray(vehicles) ? vehicles[0] : vehicles;

//         if (!mounted) return;
//         setVehicle(vehicleEntity || null);

//         // If vehicle payload already contains battery info, use it immediately to show values
//         const vehBatteryPreview = vehicleEntity?.battery;
//         if (vehBatteryPreview) {
//           const previewRaw = vehBatteryPreview?.current_charge ?? vehBatteryPreview?.pin_hien_tai ?? vehBatteryPreview?.charge_percent ?? vehBatteryPreview?.percentage ?? vehBatteryPreview?.level ?? null;
//           const previewSoh = vehBatteryPreview?.soh ?? vehBatteryPreview?.state_of_health ?? null;
//           const parsedPreviewLevel = parseBatteryNumber(previewRaw);
//           if (parsedPreviewLevel !== null) setBatteryLevelState(parsedPreviewLevel);
//           if (previewSoh !== undefined && previewSoh !== null) {
//             const parsedSoh = parseBatteryNumber(previewSoh);
//             if (parsedSoh !== null) setSohState(parsedSoh);
//           }
//         }

//         // Prefer to fetch battery by battery_id to get live current_charge/soh
//         let batteryData = null;
//         const bid = vehicleEntity?.battery_id ?? vehicleEntity?.battery?.battery_id ?? vehicleEntity?.battery?.id ?? null;
//         if (!bid) {
//           // no battery assigned to this vehicle
//           setNoBatteryAssigned(true);
//           batteryData = null;
//         } else {
//           setNoBatteryAssigned(false);
//           try {
//             const resp = await batteryService.getBatteryById(bid);
//             // batteryService returns response.data usually; normalize common wrappers
//             if (resp?.data) batteryData = resp.data;
//             else if (resp?.battery) batteryData = resp.battery;
//             else batteryData = resp;
//           } catch (bErr) {
//             console.warn('VehicleStatus: failed to fetch battery by id', bErr);
//             // try to use embedded battery if present
//             batteryData = vehicleEntity?.battery ?? null;
//           }
//         }
//         if (!mounted) return;
//         setBattery(batteryData || null);
//         // Update derived states immediately from batteryData so UI reflects latest values
//         if (batteryData) {
//           const raw = batteryData?.current_charge ?? batteryData?.pin_hien_tai ?? batteryData?.charge_percent ?? batteryData?.percentage ?? batteryData?.level ?? null;
//           const parsed = parseBatteryNumber(raw);
//           if (parsed !== null) setBatteryLevelState(parsed);
//           const parsedSoh = parseBatteryNumber(batteryData?.soh ?? batteryData?.state_of_health ?? null);
//           if (parsedSoh !== null) setSohState(parsedSoh);
//         }
//       } catch (err) {
//         console.error('VehicleStatus fetch error', err);
//         if (!mounted) return;
//         setError('Failed to load vehicle status');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchData();
//     return () => { mounted = false };
//   }, [user?.id, user?.user_id]);

//   // Handle update battery charge
//   const handleUpdateCharge = async () => {
//     const chargeValue = parseFloat(chargeInput);
    
//     // Validation
//     if (chargeInput.trim() === '') {
//       toast.error('Please enter a charge value');
//       return;
//     }
    
//     if (isNaN(chargeValue)) {
//       toast.error('Please enter a valid number');
//       return;
//     }
    
//     if (chargeValue < 0 || chargeValue > 100) {
//       toast.error('Charge value must be between 0 and 100');
//       return;
//     }
    
//     if (!battery?.battery_id) {
//       toast.error('No battery assigned to this vehicle');
//       return;
//     }
    
//     setUpdatingCharge(true);
//     try {
//       const updatedBattery = await batteryService.updateBattery(battery.battery_id, {
//         current_charge: chargeValue
//       });
      
//       // Update local state
//       setBattery(updatedBattery);
//       setBatteryLevelState(chargeValue);
      
//       toast.success(`Battery charge updated to ${chargeValue}%`);
//       setShowChargeModal(false);
//       setChargeInput('');
//     } catch (err) {
//       console.error('Error updating battery charge:', err);
//       toast.error(err.response?.data?.message || 'Failed to update battery charge');
//     } finally {
//       setUpdatingCharge(false);
//     }
//   };

//   // parseBatteryNumber now provided by src/utils/battery.js

//   // battery.current_charge expected from backend - compute from fetched battery if no explicit state set
//   const rawCharge = battery?.current_charge ?? battery?.current_charge_percent ?? battery?.pin_hien_tai ?? battery?.charge_percent ?? battery?.percentage ?? battery?.level ?? null;
//   let computedBatteryLevel = null;
//   if (rawCharge !== null && rawCharge !== undefined) {
//     const n = parseBatteryNumber(rawCharge);
//     if (n !== null) computedBatteryLevel = Math.max(0, Math.min(100, n));
//   }

//   // Use explicit state if we've set it from vehicle preview or battery fetch; otherwise use computedBatteryLevel or 0
//   const batteryLevel = batteryLevelState ?? (computedBatteryLevel ?? 0);

//   const soh = sohState ?? (battery?.soh ?? battery?.state_of_health ?? null);
//   const range = Math.floor((batteryLevel || 0) * 4.2);
//   // computed values used for rendering

//   const content = loading ? (
//     <div className="text-center py-12">Loading vehicle status...</div>
//   ) : error ? (
//     <div className="text-center text-red-600 py-6">{error}</div>
//   ) : !vehicle ? (
//     <div className="text-center py-6">No vehicle found for your account.</div>
//   ) : (
//     <>
//       {/* Vehicle Info */}
//       <div className="text-center space-y-2 bg-gray-200 shadow-md rounded-lg p-4">
//         <h3 className="text-2xl font-bold text-gray-800">EV Bike {vehicle.battery_model}</h3>
//         <p className="text-gray-600 font-medium">Model: {vehicle.battery_type}</p>
//         <p className="text-gray-500 text-sm">VIN: {vehicle.vin}</p>
//         <p className="text-gray-500 text-sm">Motor: {vehicle.cong_suat_dong_co} kW</p>
//       </div>

//       {/* Battery Status */}
//       <div className="space-y-4 bg-gray-200 shadow-sm rounded-lg p-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <Battery className={`w-5 h-5 ${batteryLevel > 50 ? 'text-green-600' : batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'}`} />
//             <span className="text-gray-700 font-medium">Current Battery Level</span>
//           </div>
//           <span className="text-3xl font-bold text-blue-800">{noBatteryAssigned ? 'N/A' : (batteryLevel ?? 0).toFixed(0) + '%'}</span>
//         </div>

//         {/* Battery Progress Bar */}
//         <div className="relative">
//           <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
//             <div
//               className={`h-4 rounded-full transition-all duration-300 shadow-sm ${batteryLevel > 50 ? 'bg-gradient-to-r from-green-600 to-green-400' :
//                 batteryLevel > 20 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
//                   'bg-gradient-to-r from-red-600 to-red-400'
//                 }`}
//               style={{ width: `${noBatteryAssigned ? 0 : (batteryLevel ?? 0)}%` }}
//             ></div>
//           </div>
//           <div className="flex justify-between text-sm text-gray-600 mt-2">
//             <span>0%</span>
//             <span className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-medium">
//               {noBatteryAssigned ? 'N/A' : range + ' km'}
//             </span>
//             <span>100%</span>
//           </div>
//           <p className="text-center text-sm text-gray-600 mt-2 font-medium">
//             Range: ~{noBatteryAssigned ? 'N/A' : range + ' km'} remaining
//           </p>
//           <p className="text-center text-xs text-gray-500 mt-1">
//             Battery Health (SOH): {noBatteryAssigned ? 'N/A' : (soh ?? 'N/A') + '%'}
//           </p>
//         </div>

//         {/* Update Charge Button */}
//         {!noBatteryAssigned && (
//           <div className="mt-4 pt-4 border-t border-gray-300">
//             <Button
//               onClick={() => {
//                 setChargeInput((batteryLevel ?? 0).toString());
//                 setShowChargeModal(true);
//               }}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
//             >
//               Update Battery Charge
//             </Button>
//           </div>
//         )}
//       </div>
      
//       {/* Charge Update Modal */}
//       {showChargeModal && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//               <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update Battery Charge</h3>
//               <button
//                 onClick={() => setShowChargeModal(false)}
//                 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Charge Percentage (0-100%)
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   max="100"
//                   step="1"
//                   value={chargeInput}
//                   onChange={(e) => setChargeInput(e.target.value)}
//                   placeholder="Enter charge value"
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
              
//               {/* Info Message */}
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 Current charge: {(batteryLevel ?? 0).toFixed(0)}%
//               </p>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => setShowChargeModal(false)}
//                 disabled={updatingCharge}
//                 className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdateCharge}
//                 disabled={updatingCharge}
//                 className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 flex items-center gap-2"
//               >
//                 {updatingCharge && <Loader2 className="w-4 h-4 animate-spin" />}
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {noBatteryAssigned && (
//         <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm rounded">
//           This vehicle has no battery assigned yet (battery_id is null). Please swap/assign a battery to see live current charge and SOH.
//         </div>
//       )}
//       {/* Dev-only debug dump when running on localhost to help diagnose missing fields */}
//       {/* Dev debug dump intentionally removed for production cleanliness */}
//     </>
//   );

//   return (
//     <Card className="bg-white shadow-lg border border-gray-200">
//       <CardHeader className="bg-blue-800 text-white rounded-lg">
//         <div className="flex flex-row items-center justify-between pt-2 py-1">
//           <div className="flex items-center gap-2">
//             <Battery className="w-5 h-5" />
//             <h2 className="text-xl font-bold">Vehicle Status</h2>
//           </div>
//           <Button variant="outline" size="sm" className="bg-white text-blue-800 border-white hover:bg-blue-50">
//             Manage Vehicle
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent className="p-6 space-y-6">
//         {content}

//         {/* Action Buttons */}
//         <div className="flex justify-center">
//           <Link to="/driver/map">
//             <Button className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 shadow-md w-full">
//               Find Stations
//             </Button>
//           </Link>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }