import { Outlet } from "react-router-dom";
import Navigation from "../components/layout/Navigation";
import { useAuth } from "../hooks/useContext";

export default function StaffPage() {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Aurora Dream Diagonal Flow Background */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 60% at 5% 40%, #ecf1fbdc, transparent 67%),
                        radial-gradient(ellipse 70% 60% at 45% 45%, #eaf1ff69, transparent 67%),
                        radial-gradient(ellipse 62% 52% at 83% 76%, #f7fbffff, transparent 63%),
                        radial-gradient(ellipse 60% 48% at 75% 20%, #dde5ffbc, transparent 66%),
                        linear-gradient(45deg, #eaeeffc5 0%, #ffffffff 100%)
                    `,
                }}
            />

            {/* Navigation */}
            <div className="relative z-10">
                <Navigation type="staff" />
            </div>

            {/* Main Content */}
            <main className="relative z-10 p-6">
                {/* Trang con sẽ render ở đây */}
                <Outlet />
                <button
                    onClick={logout}
                    className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded border-none cursor-pointer transition-colors"
                >
                    🚪 Logout
                </button>
            </main>
        </div>
    );
}


// const StaffOverview = () => (
//     <div className="p-6">

//         {/* Phần Tiêu đề: Tương tự như Admin Dashboard */}
//         <div className="bg-green-600 text-white p-6 rounded-lg shadow-xl mb-6">
//             <h2 className="text-3xl font-extrabold">Staff Dashboard</h2>
//             <p className="text-sm opacity-90 mt-1">
//                 Tổng quan hoạt động và tồn kho tại trạm đổi pin hiện tại
//             </p>
//         </div>

//         {/* Phần 1: Các Thẻ Thống kê (Metrics Cards) */}
//         <div className="grid grid-cols-4 gap-4 mb-6">

//             {/* 1. Tổng Giao dịch Hôm nay */}
//             <div className="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
//                 <div className="flex justify-between items-center">
//                     <h3 className="text-sm font-semibold opacity-75">Giao dịch Hôm nay</h3>
//                     <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
//                     </svg>
//                 </div>
//                 <p className="text-3xl font-bold mt-2">124</p>
//                 <p className="text-xs text-green-400 mt-1">+8 so với hôm qua</p>
//             </div>

//             {/* 2. Pin Đầy sẵn sàng */}
//             <div className="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
//                 <div className="flex justify-between items-center">
//                     <h3 className="text-sm font-semibold opacity-75">Pin Đầy (Full)</h3>
//                     <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                     </svg>
//                 </div>
//                 <p className="text-3xl font-bold mt-2">18</p>
//                 <p className="text-xs text-yellow-400 mt-1">2 đang chờ sạc</p>
//             </div>

//             {/* 3. Pin Đang sạc */}
//             <div className="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
//                 <div className="flex justify-between items-center">
//                     <h3 className="text-sm font-semibold opacity-75">Pin Đang Sạc</h3>
//                     <svg className="w-8 h-8 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                     </svg>
//                 </div>
//                 <p className="text-3xl font-bold mt-2">4</p>
//                 <p className="text-xs text-red-400 mt-1">1 lỗi cần bảo dưỡng</p>
//             </div>

//             {/* 4. Pin Bảo dưỡng */}
//             <div className="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
//                 <div className="flex justify-between items-center">
//                     <h3 className="text-sm font-semibold opacity-75">Pin Bảo dưỡng</h3>
//                     <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                     </svg>
//                 </div>
//                 <p className="text-3xl font-bold mt-2">3</p>
//                 <p className="text-xs text-red-400 mt-1">2 cần kiểm tra hôm nay</p>
//             </div>
//         </div>

//         {/* Phần 2: Các Bảng Hoạt động Gần đây */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//             {/* Cột 1: Giao dịch Đổi Pin Gần đây */}
//             <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
//                 <h3 className="text-lg font-bold text-gray-800 mb-4">Giao dịch Đổi Pin Gần đây</h3>

//                 {/* Item 1 */}
//                 <div className="flex justify-between items-center py-2 border-b last:border-b-0">
//                     <div>
//                         <p className="font-semibold">TXN009 - John Smith</p>
//                         <p className="text-sm text-gray-500">Model X | Từ BAT015</p>
//                     </div>
//                     <div className="text-right">
//                         <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
//                             Hoàn thành
//                         </span>
//                         <p className="text-xs text-gray-400 mt-1">10:45</p>
//                     </div>
//                 </div>

//                 {/* Item 2 */}
//                 <div className="flex justify-between items-center py-2 border-b last:border-b-0">
//                     <div>
//                         <p className="font-semibold">TXN010 - Emma Wilson</p>
//                         <p className="text-sm text-gray-500">Model Y | Từ BAT022</p>
//                     </div>
//                     <div className="text-right">
//                         <span className="text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
//                             Thanh toán
//                         </span>
//                         <p className="text-xs text-gray-400 mt-1">10:30</p>
//                     </div>
//                 </div>

//                 {/* Item 3 */}
//                 <div className="flex justify-between items-center py-2 border-b last:border-b-0">
//                     <div>
//                         <p className="font-semibold">TXN011 - Nguyễn Văn A</p>
//                         <p className="text-sm text-gray-500">Model X | Từ BAT040</p>
//                     </div>
//                     <div className="text-right">
//                         <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
//                             Đang xử lý
//                         </span>
//                         <p className="text-xs text-gray-400 mt-1">10:15</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Cột 2: Tình trạng Tồn kho theo Loại */}
//             <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
//                 <h3 className="text-lg font-bold text-gray-800 mb-4">Tình trạng Tồn kho chi tiết</h3>

//                 {/* Item 1: Model X */}
//                 <div className="flex justify-between items-center py-2 border-b last:border-b-0">
//                     <div className="flex items-center">
//                         <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         <div>
//                             <p className="font-semibold">Model X (Dung lượng cao)</p>
//                             <p className="text-sm text-gray-500">Tổng: 12 pin</p>
//                         </div>
//                     </div>
//                     <div className="text-right">
//                         <span className="text-sm font-medium text-green-700">Đầy: 8</span>
//                         <p className="text-xs text-red-600 mt-1">Bảo dưỡng: 1</p>
//                     </div>
//                 </div>

//                 {/* Item 2: Model Y */}
//                 <div className="flex justify-between items-center py-2 border-b last:border-b-0">
//                     <div className="flex items-center">
//                         <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         <div>
//                             <p className="font-semibold">Model Y (Dung lượng thường)</p>
//                             <p className="text-sm text-gray-500">Tổng: 16 pin</p>
//                         </div>
//                     </div>
//                     <div className="text-right">
//                         <span className="text-sm font-medium text-green-700">Đầy: 10</span>
//                         <p className="text-xs text-yellow-600 mt-1">Đang sạc: 3</p>
//                     </div>
//                 </div>

//                 {/* Item 3: Pin Lỗi */}
//                 <div className="flex justify-between items-center py-2 border-b last:border-b-0">
//                     <div className="flex items-center">
//                         <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                         </svg>
//                         <div>
//                             <p className="font-semibold text-red-700">Pin Lỗi (Cần báo cáo)</p>
//                             <p className="text-sm text-gray-500">Tổng: 3 pin</p>
//                         </div>
//                     </div>
//                     <div className="text-right">
//                         <span className="text-sm font-medium text-red-700">Chưa xử lý: 2</span>
//                         <p className="text-xs text-gray-400 mt-1">Hôm nay</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// Backup BatteryManagement component (commented out)
// function BatteryManagement() {
//   const { batteries, loading, error, refreshBatteries } = useBattery();
//   // ... rest of component
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