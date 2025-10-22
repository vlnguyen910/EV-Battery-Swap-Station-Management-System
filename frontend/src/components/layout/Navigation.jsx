import { Link } from "react-router-dom"
import { useState } from "react"

export default function Navigation({ type = "main" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // --- NAVBAR CHO MAIN WEBSITE ---
  const MainNavigation = () => (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-blue-800 font-bold text-lg">E</span>
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
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Trạm đổi pin
                  </Link>
                  <Link
                    to="/batteries"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Quản lý pin
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
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
            <button className="bg-white text-blue-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50">
              <Link to="/login">Đăng nhập</Link>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )

  // --- NAVBAR CHO STAFF ---
  const StaffNavigation = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "Pacifico, serif" }}
            >
              hman Power
            </h1>
            <span className="ml-4 text-sm text-gray-500">Staff Portal</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/staff"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              <i className="ri-layout-grid-line mr-2 text-blue-500"></i>
              Overview
            </Link>

            <Link
              to="/staff/inspection"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              <i className="ri-search-line mr-2 text-blue-500"></i>
              Kiểm tra pin
            </Link>

            <Link
              to="/staff/manual-swap"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              <i className="ri-search-line mr-2 text-blue-500"></i>
              Manual Swap
            </Link>

            <Link
              to="/staff/inventory"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              <i className="ri-archive-line mr-2 text-blue-500"></i>
              Kho pin
            </Link>

            <Link
              to="/staff/swap-requests"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              <i className="ri-swap-line mr-2 text-orange-500"></i>
              Yêu cầu đổi pin
            </Link>

            {/* Dropdown Status */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
              >
                <i className="ri-battery-2-charge-line mr-2 text-blue-500"></i>
                Trạng thái pin
                <i
                  className={`ri-arrow-down-s-line ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                ></i>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-10">
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center w-full px-3 py-2">
                    <i className="ri-time-line mr-2 text-blue-500"></i>
                    Chờ xử lý
                  </button>
                  <button className="text-gray-600 hover:text-blue-600 transition-colors flex items-center w-full px-3 py-2">
                    <i className="ri-loader-2-line mr-2 animate-spin text-yellow-500"></i>
                    Đang xử lý
                  </button>
                  <button className="text-gray-600 hover:text-blue-600 transition-colors flex items-center w-full px-3 py-2">
                    <i className="ri-check-double-line mr-2 text-green-500"></i>
                    Hoàn thành
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">Nhân viên</span>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-user-3-line text-green-600 text-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )

  // --- CHỌN NAVBAR NÀO DÙNG ---
  // const AdminNavigation = () => <div>Navbar admin</div>

  switch (type) {
    case "staff":
      return <StaffNavigation />
    // case "admin":
    //   return <AdminNavigation />
    default:
      return <MainNavigation />
  }
}