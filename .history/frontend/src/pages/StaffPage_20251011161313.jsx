import StaffNavigation from "@/components/layout/StaffNavigation"

export default function StaffPage() {
    return (
        <>
            <StaffNavigation />
        </>

    )
}

// function BatteryManagement() {
//     const { batteries, loading, error, refreshBatteries } = useBattery();

//     if (loading) return (
//         <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//             <span className="ml-2 text-gray-600">Loading batteries...</span>
//         </div>
//     );

//     if (error) return (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             Error: {error}
//         </div>
//     );

//     return (
//         <div className="space-y-6">
//             {/* Header với refresh button */}
//             <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-bold text-gray-800">Battery Management</h2>
//                 <button
//                     onClick={refreshBatteries}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//                 >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                     Refresh
//                 </button>
//             </div>

//             {/* Battery stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-green-100 p-4 rounded-lg">
//                     <h3 className="text-sm font-medium text-green-800">Available</h3>
//                     <p className="text-2xl font-bold text-green-900">
//                         {batteries.filter(b => b.status === 'full').length}
//                     </p>
//                 </div>
//                 <div className="bg-yellow-100 p-4 rounded-lg">
//                     <h3 className="text-sm font-medium text-yellow-800">Charging</h3>
//                     <p className="text-2xl font-bold text-yellow-900">
//                         {batteries.filter(b => b.status === 'charging').length}
//                     </p>
//                 </div>
//                 <div className="bg-blue-100 p-4 rounded-lg">
//                     <h3 className="text-sm font-medium text-blue-800">In Use</h3>
//                     <p className="text-2xl font-bold text-blue-900">
//                         {batteries.filter(b => b.status === 'taken').length}
//                     </p>
//                 </div>
//                 <div className="bg-red-100 p-4 rounded-lg">
//                     <h3 className="text-sm font-medium text-red-800">Maintenance</h3>
//                     <p className="text-2xl font-bold text-red-900">
//                         {batteries.filter(b => b.status === 'defective').length}
//                     </p>
//                 </div>
//             </div>

//             {/* Battery grid */}
//             <div className="flex flex-wrap justify-center gap-6">
//                 {batteries.map(battery => (
//                     <BatteryCard key={battery.battery_id} battery={battery} />
//                 ))}
//             </div>

//         </div>
//     );
// }

// export default function StaffPage() {
//     return (
//         <BatteryProvider>
//             <div className="min-h-screen bg-gray-50">
//                 {/* Header */}
//                 <header className="bg-white shadow-sm border-b">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="flex justify-between items-center py-4">
//                             <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
//                             <div className="text-sm text-gray-500">
//                                 Welcome, Station Manager
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 {/* Main content */}
//                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     <BatteryManagement />
//                 </main>
//             </div>
//         </BatteryProvider>
//     );
// }