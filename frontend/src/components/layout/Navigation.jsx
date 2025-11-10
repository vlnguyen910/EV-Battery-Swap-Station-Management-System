import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../hooks/useContext"

export default function Navigation({ type = "main" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { logout } = useAuth();

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
              Home
            </Link>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                Services
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
                    Swap Stations
                  </Link>
                  <Link
                    to="/batteries"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Battery Management
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
              Users
            </Link>
            <Link to="/reports" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
              Reports
            </Link>
            <Link to="/help" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
              Support
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="bg-white text-blue-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
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
              Battery Inventory
            </Link>

            <Link
              to="/staff/swap-requests"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              <i className="ri-swap-line mr-2 text-orange-500"></i>
              Swap Requests
            </Link>

            <Link
              to="/staff/transfer-requests"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              <i className="ri-arrow-left-right-line mr-2 text-green-500"></i>
              Transfer Requests
            </Link>



            <div className="flex items-center space-x-3">
              <Link
                to="/staff/profile"
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
              >
                Staff
              </Link>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-user-3-line text-green-600 text-lg"></i>
              </div>
            </div>

          </div>

          <button
            onClick={logout}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )

  // --- NAVBAR CHO ADMIN ---
  const AdminNavigation = () => {
    const location = useLocation()

    // Helper function to check if current path matches
    const isActive = (path) => {
      if (path === '/admin') {
        return location.pathname === '/admin'
      }
      return location.pathname.startsWith(path)
    }

    return (
      <header className="flex h-16 w-full items-center justify-center bg-white dark:bg-slate-900 px-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        {/* Logo bên trái */}
        <div className="absolute left-6 flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-slate-50 text-xl font-bold leading-normal">EV Charge</h1>
          </div>
        </div>

        {/* Navigation ở giữa */}
        <nav className="flex items-center gap-6">
          <Link
            to="/admin"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold ${isActive('/admin') && location.pathname === '/admin'
              ? 'bg-blue-100 text-blue-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }`}
          >
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/stations-list"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold ${isActive('/admin/stations-list')
              ? 'bg-blue-100 text-blue-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }`}
          >
            <span>Stations</span>
          </Link>
          <Link
            to="/admin/users-list"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold ${isActive('/admin/users-list')
              ? 'bg-blue-100 text-blue-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }`}
          >
            <span>Users</span>
          </Link>
          <Link
            to="/admin/packages-list"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold ${isActive('/admin/packages-list')
              ? 'bg-blue-100 text-blue-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }`}
          >
            <span>Packages</span>
          </Link>
          <Link
            to="/admin/battery-transfer-requests"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold ${isActive('/admin/battery-transfer-req')
              ? 'bg-blue-100 text-blue-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }`}
          >
            <span>Battery Transfer</span>
          </Link>
          <Link
            to="/admin/support-list"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold ${isActive('/admin/support-list')
              ? 'bg-blue-100 text-blue-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }`}
          >
            <span>Support</span>
          </Link>
          <Link
            to="/admin/report"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold ${isActive('/admin/reports')
              ? 'bg-blue-100 text-blue-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }`}
          >
            <span>Reports</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/profile"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              Admin
            </Link>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-user-3-line text-blue-600 text-lg"></i>
            </div>
          </div>
        </nav>

        <button
          onClick={logout}
          className="absolute right-6 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
        >
          Logout
        </button>
      </header>
    )
  }

  switch (type) {
    case "staff":
      return <StaffNavigation />
    case "admin":
      return <AdminNavigation />
    default:
      return <MainNavigation />
  }
}