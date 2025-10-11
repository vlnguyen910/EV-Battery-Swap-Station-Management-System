
export default function StaffNavigation() {
    return (
        <nav className="w-full flex items-center justify-between px-6 py-2 bg-white shadow-sm">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold font-[Poppins] text-gray-900">
                    hman <span className="text-indigo-600">Power</span>
                </h1>
                <span className="text-sm text-gray-500">Staff Portal</span>
            </div>

            {/* Menu items */}
            <div className="flex items-center space-x-6 text-sm text-gray-700">
                <button className="flex items-center gap-1 hover:text-indigo-600 transition">
                    <i className="ri-time-line"></i> Overview
                </button>
                <button className="flex items-center gap-1 hover:text-indigo-600 transition">
                    <i className="ri-search-line"></i> Kiểm tra pin
                </button>
                <button className="flex items-center gap-1 hover:text-indigo-600 transition">
                    <i className="ri-database-2-line"></i> Kho pin
                </button>
                <button className="hover:text-indigo-600 transition">Nhân viên</button>
            </div>

            {/* User icon */}
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                <i className="ri-user-line text-green-700 text-lg"></i>
            </div>
        </nav>

    )
}
