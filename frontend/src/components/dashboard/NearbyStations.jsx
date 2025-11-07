// import { Card, CardContent, CardHeader } from "../ui/card"
// import { MapPin, Navigation, ArrowRight, Zap } from "lucide-react"
// import { getNearbyStations } from "../../data/mockData"

// // Get nearby stations based on current location (Ho Chi Minh City center)
// const userLocation = { latitude: 10.7769, longitude: 106.7009 };
// const stations = getNearbyStations(userLocation.latitude, userLocation.longitude, 5)
//   .slice(0, 3)
//   .map(station => ({
//     station_id: station.station_id,
//     name: station.name,
//     distance: `${station.distance} km • ${station.available_slots} slots`,
//     status: station.available_slots > 0 ? 'available' : 'busy',
//     address: station.address
// }));

// export default function NearbyStations() {
//   return (
//     <Card className="bg-white shadow-lg border border-gray-200">
//       <CardHeader className="bg-blue-800 text-white rounded-lg pt-2">
//         <div className="flex flex-row items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Navigation className="w-5 h-5" />
//             <h2 className="text-lg font-bold">Nearby Stations</h2>
//           </div>
//           <button className="text-white hover:text-green-100 text-sm font-medium underline">
//             View All
//           </button>
//         </div>
//       </CardHeader>
//       <CardContent className="p-4">
//         <div className="space-y-3">
//           {stations.map((station) => (
//             <div 
//               key={station.station_id} 
//               className={`bg-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-indigo-300 transition-all cursor-pointer border border-gray-100`}
//             >
//               <div className="flex items-center space-x-3">
//                 <div className={`w-10 h-10 ${station.status === 'available' ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center`}>
//                   <Zap className={`w-5 h-5 ${station.status === 'available' ? 'text-green-600' : 'text-yellow-600'}`} />
//                 </div>
//                 <div>
//                   <p className={`font-semibold text-sm text-indigo-800`}>{station.name}</p>
//                   <div className="flex items-center gap-1 text-gray-600 text-xs font-medium">
//                     <MapPin className="w-3 h-3" />
//                     <p>{station.distance}</p>
//                   </div>
//                 </div>
//               </div>
//               <button className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded-lg transition-colors shadow-sm">
//                 <ArrowRight className="w-4 h-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }