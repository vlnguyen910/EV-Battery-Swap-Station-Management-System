import { Link } from "react-router-dom"
import { useState } from "react"

export default function Navigation({ type = "main" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // --- NAVBAR CHO STAFF ---
  const StaffNavigation = () => (
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

  // --- NAVBAR CHO MAIN WEBSITE ---
  const MainNavigation = () => (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">EV SWAP</span>
            </Link>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
              Trang chủ
            </Link>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                Dịch vụ
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50">
                  <Link
                    to="/stations"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Trạm đổi pin
                  </Link>
                  <Link
                    to="/batteries"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Quản lý pin
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                </div>
              )}
            </div>

            <Link to="/users" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
              Người dùng
            </Link>
            <Link to="/reports" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
              Báo cáo
            </Link>
            <Link to="/help" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
              Hỗ trợ
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-blue-200">VI</span>
              <span className="text-white">EN</span>
            </div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50">
              <Link to="/login">Đăng nhập</Link>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )

  // --- CHỌN NAVBAR NÀO DÙNG ---
  return type === "staff" ? <StaffNavigation /> : <MainNavigation />
}
