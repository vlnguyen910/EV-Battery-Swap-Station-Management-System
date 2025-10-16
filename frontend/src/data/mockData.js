// Mock data based on database structure

// Users
export const mockUsers = [
  {
    user_id: 1,
    username: "driver_john",
    phone: "+84912345678",
    email: "john@example.com",
    role: "driver",
    created_at: "2024-01-15T08:00:00Z"
  },
  {
    user_id: 2,
    username: "staff_alice",
    phone: "+84912345679",
    email: "alice@example.com",
    role: "station_staff",
    created_at: "2024-02-10T09:00:00Z"
  },
  {
    user_id: 3,
    username: "admin_bob",
    phone: "+84912345680",
    email: "bob@example.com",
    role: "admin",
    created_at: "2024-01-01T10:00:00Z"
  }
];

// Changing Stations
export const mockStations = [
  {
    station_id: 1,
    name: "Downtown Station A",
    address: "123 Nguyen Hue St, District 1, HCMC",
    latitude: 10.7769,
    longitude: 106.7009,
    status: "active"
  },
  {
    station_id: 2,
    name: "Mall Station B",
    address: "456 Le Lai St, District 1, HCMC",
    latitude: 10.7718,
    longitude: 106.6984,
    status: "active"
  },
  {
    station_id: 3,
    name: "Airport Station C",
    address: "Tan Son Nhat Airport, Tan Binh District",
    latitude: 10.8186,
    longitude: 106.6576,
    status: "active"
  },
  {
    station_id: 4,
    name: "University Station D",
    address: "268 Ly Thuong Kiet St, District 10, HCMC",
    latitude: 10.7722,
    longitude: 106.6574,
    status: "active"
  },
  {
    station_id: 5,
    name: "Tech Park Station E",
    address: "Lot E.4a, 2nd Floor, KCX Tan Thuan, District 7",
    latitude: 10.7359,
    longitude: 106.7217,
    status: "maintenance"
  }
];

// Batteries
export const mockBatteries = [
  {
    battery_id: 1,
    vehicle_id: null,
    station_id: 1,
    model: "EV-BAT-100",
    capacity: 100,
    pin_hien_tai: 95.5,
    status: "full",
    soh: 98.5,
    last_maintenance: "2025-09-15T10:00:00Z"
  },
  {
    battery_id: 2,
    vehicle_id: null,
    station_id: 1,
    model: "EV-BAT-100",
    capacity: 100,
    pin_hien_tai: 88.0,
    status: "full",
    soh: 95.2,
    last_maintenance: "2025-09-10T14:30:00Z"
  },
  {
    battery_id: 3,
    vehicle_id: null,
    station_id: 1,
    model: "EV-BAT-100",
    capacity: 100,
    pin_hien_tai: 45.0,
    status: "charging",
    soh: 92.8,
    last_maintenance: "2025-09-01T09:00:00Z"
  },
  {
    battery_id: 4,
    vehicle_id: 1,
    station_id: null,
    model: "EV-BAT-80",
    capacity: 80,
    pin_hien_tai: 68.0,
    status: "booked",
    soh: 89.5,
    last_maintenance: "2025-08-20T11:00:00Z"
  },
  {
    battery_id: 5,
    vehicle_id: null,
    station_id: 2,
    model: "EV-BAT-100",
    capacity: 100,
    pin_hien_tai: 92.0,
    status: "full",
    soh: 97.0,
    last_maintenance: "2025-09-18T08:00:00Z"
  },
  {
    battery_id: 6,
    vehicle_id: null,
    station_id: 2,
    model: "EV-BAT-100",
    capacity: 100,
    pin_hien_tai: 85.0,
    status: "full",
    soh: 94.5,
    last_maintenance: "2025-09-12T15:00:00Z"
  },
  {
    battery_id: 7,
    vehicle_id: null,
    station_id: 3,
    model: "EV-BAT-120",
    capacity: 120,
    pin_hien_tai: 98.0,
    status: "full",
    soh: 99.0,
    last_maintenance: "2025-09-20T07:00:00Z"
  },
  {
    battery_id: 8,
    vehicle_id: null,
    station_id: 3,
    model: "EV-BAT-120",
    capacity: 120,
    pin_hien_tai: 95.0,
    status: "full",
    soh: 98.2,
    last_maintenance: "2025-09-19T13:00:00Z"
  },
  {
    battery_id: 9,
    vehicle_id: null,
    station_id: 3,
    model: "EV-BAT-120",
    capacity: 120,
    pin_hien_tai: 90.0,
    status: "full",
    soh: 96.8,
    last_maintenance: "2025-09-17T10:00:00Z"
  },
  {
    battery_id: 10,
    vehicle_id: null,
    station_id: 3,
    model: "EV-BAT-120",
    capacity: 120,
    pin_hien_tai: 87.0,
    status: "full",
    soh: 95.5,
    last_maintenance: "2025-09-15T16:00:00Z"
  },
  {
    battery_id: 11,
    vehicle_id: null,
    station_id: 4,
    model: "EV-BAT-100",
    capacity: 100,
    pin_hien_tai: 93.0,
    status: "full",
    soh: 96.5,
    last_maintenance: "2025-09-16T12:00:00Z"
  },
  {
    battery_id: 12,
    vehicle_id: null,
    station_id: 4,
    model: "EV-BAT-100",
    capacity: 100,
    pin_hien_tai: 20.0,
    status: "defective",
    soh: 65.0,
    last_maintenance: "2025-08-01T14:00:00Z"
  }
];

// Vehicles
export const mockVehicles = [
  {
    vehicle_id: 1,
    user_id: 1,
    battery_id: 4,
    vin: "VIN001EVBIKE2024",
    cong_suat_dong_co: 5.0,
    battery_model: "EV-BAT-80",
    battery_type: "Lithium-Ion"
  },
  {
    vehicle_id: 2,
    user_id: 1,
    battery_id: null,
    vin: "VIN002EVBIKE2024",
    cong_suat_dong_co: 7.5,
    battery_model: "EV-BAT-100",
    battery_type: "Lithium-Ion"
  }
];

// Battery Service Packages
export const mockPackages = [
  {
    package_id: 1,
    name: "Basic Plan",
    base_distance: 500,
    base_price: 99000,
    phi_phat: 5000,
    duration_days: 30,
    description: "Perfect for casual riders",
    active: true
  },
  {
    package_id: 2,
    name: "Standard Plan",
    base_distance: 1000,
    base_price: 179000,
    phi_phat: 4000,
    duration_days: 30,
    description: "Great for daily commuters",
    active: true
  },
  {
    package_id: 3,
    name: "Premium Plan",
    base_distance: 2000,
    base_price: 299000,
    phi_phat: 3000,
    duration_days: 30,
    description: "Best value for frequent users",
    active: true
  },
  {
    package_id: 4,
    name: "Unlimited Plan",
    base_distance: 999999,
    base_price: 499000,
    phi_phat: 0,
    duration_days: 30,
    description: "Unlimited swaps for professionals",
    active: true
  }
];

// Subscriptions
export const mockSubscriptions = [
  {
    subscription_id: 1,
    user_id: 1,
    package_id: 2,
    battery_id: 4,
    swap_count: 18,
    start_date: "2025-09-15",
    end_date: "2025-10-15",
    status: "active"
  }
];

// Swap Transactions
export const mockSwapTransactions = [
  {
    transaction_id: 1,
    user_id: 1,
    vehicle_id: 1,
    station_id: 1,
    battery_taken_id: 1,
    battery_returned_id: 4,
    subscription_id: 1,
    createAT: "2025-10-14T10:30:00Z",
    updateAt: "2025-10-14T10:45:00Z",
    status: "completed"
  },
  {
    transaction_id: 2,
    user_id: 1,
    vehicle_id: 1,
    station_id: 2,
    battery_taken_id: 5,
    battery_returned_id: 1,
    subscription_id: 1,
    createAT: "2025-10-13T14:20:00Z",
    updateAt: "2025-10-13T14:35:00Z",
    status: "completed"
  },
  {
    transaction_id: 3,
    user_id: 1,
    vehicle_id: 1,
    station_id: 3,
    battery_taken_id: 7,
    battery_returned_id: 5,
    subscription_id: 1,
    createAT: "2025-10-11T08:15:00Z",
    updateAt: "2025-10-11T08:28:00Z",
    status: "completed"
  }
];

// Generate swap history for the past year
export const generateSwapHistory = (count = 230) => {
  const now = new Date();
  const stations = mockStations.filter(s => s.status === 'active');
  const batteries = mockBatteries.filter(b => b.status === 'full' || b.status === 'charging');
  
  return Array.from({ length: count }, (_, i) => {
    const daysAgo = Math.floor(Math.random() * 365);
    const swapDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const hour = Math.floor(Math.random() * 12) + 8; // 8-19h
    const minute = Math.floor(Math.random() * 60);
    
    const station = stations[Math.floor(Math.random() * stations.length)];
    const batteryTaken = batteries[Math.floor(Math.random() * batteries.length)];
    const batteryReturned = batteries[Math.floor(Math.random() * batteries.length)];
    
    const createTime = new Date(swapDate);
    createTime.setHours(hour, minute, 0);
    
    const updateTime = new Date(createTime);
    updateTime.setMinutes(minute + Math.floor(Math.random() * 15) + 5); // 5-20 minutes later
    
    return {
      transaction_id: i + 1,
      user_id: 1,
      vehicle_id: 1,
      station_id: station.station_id,
      station_name: station.name,
      station_address: station.address,
      battery_taken_id: batteryTaken.battery_id,
      battery_returned_id: batteryReturned.battery_id,
      subscription_id: 1,
      createAT: createTime.toISOString(),
      updateAt: updateTime.toISOString(),
      status: "completed",
      // Calculated fields for display
      date: swapDate.toISOString().split('T')[0],
      time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      location: station.name,
      amount: 1, // Always 1 battery per swap
      duration_minutes: Math.floor((updateTime - createTime) / 60000)
    };
  });
};

// Reservations
export const mockReservations = [
  {
    reservation_id: 1,
    user_id: 1,
    vehicle_id: 1,
    battery_id: 1,
    station_id: 1,
    scheduled_time: "2025-10-16T14:00:00Z",
    status: "scheduled"
  },
  {
    reservation_id: 2,
    user_id: 1,
    vehicle_id: 1,
    battery_id: 5,
    station_id: 2,
    scheduled_time: "2025-10-17T10:30:00Z",
    status: "scheduled"
  }
];

// Payments
export const mockPayments = [
  {
    payment_id: 1,
    user_id: 1,
    amount: 179000,
    payment_time: "2025-09-15T09:00:00Z",
    method: "e_wallet",
    status: "paid",
    invoice_url: "https://example.com/invoice/001"
  },
  {
    payment_id: 2,
    user_id: 1,
    amount: 8500,
    payment_time: "2025-10-14T10:45:00Z",
    method: "credit_card",
    status: "paid",
    invoice_url: "https://example.com/invoice/002"
  }
];

// Supports
export const mockSupports = [
  {
    support_id: 1,
    user_id: 1,
    station_id: 1,
    type: "battery_issue",
    description: "Battery not charging properly",
    created_at: "2025-10-10T15:30:00Z",
    status: "closed",
    rating: 5
  },
  {
    support_id: 2,
    user_id: 1,
    station_id: 2,
    type: "station_issue",
    description: "Station location is difficult to find",
    created_at: "2025-10-12T11:20:00Z",
    status: "in_progress",
    rating: null
  }
];

// Station Staff
export const mockStationStaff = [
  {
    staff_id: 1,
    user_id: 2,
    station_id: 1,
    assigned_at: "2024-02-10T09:00:00Z",
    role: "manager"
  },
  {
    staff_id: 2,
    user_id: 3,
    station_id: 2,
    assigned_at: "2024-03-01T08:00:00Z",
    role: "staff"
  }
];

// Battery Transfer
export const mockBatteryTransfers = [
  {
    transfer_id: 1,
    battery_id: 3,
    from_station_id: 2,
    to_station_id: 1,
    transfer_time: "2025-10-05T14:00:00Z",
    status: "completed"
  },
  {
    transfer_id: 2,
    battery_id: 7,
    from_station_id: 1,
    to_station_id: 3,
    transfer_time: "2025-10-08T10:00:00Z",
    status: "completed"
  }
];

// Config
export const mockConfig = [
  {
    config_id: 1,
    name: "max_battery_charge_time",
    value: 120,
    description: "Maximum time in minutes for battery charging"
  },
  {
    config_id: 2,
    name: "min_battery_soh",
    value: 70,
    description: "Minimum State of Health percentage for battery usage"
  },
  {
    config_id: 3,
    name: "swap_service_fee",
    value: 5000,
    description: "Service fee per swap transaction (VND)"
  },
  {
    config_id: 4,
    name: "reservation_window_hours",
    value: 48,
    description: "Maximum hours in advance for reservations"
  }
];

// Helper functions
export const getStationById = (stationId) => {
  return mockStations.find(s => s.station_id === stationId);
};

export const getBatteriesByStation = (stationId) => {
  return mockBatteries.filter(b => b.station_id === stationId);
};

export const getAvailableBatteries = (stationId) => {
  return mockBatteries.filter(b => 
    b.station_id === stationId && 
    (b.status === 'full' || b.status === 'charging') &&
    b.soh >= 70
  );
};

export const getUserSwapHistory = (userId) => {
  return mockSwapTransactions.filter(t => t.user_id === userId);
};

export const getUserActiveSubscription = (userId) => {
  return mockSubscriptions.find(s => 
    s.user_id === userId && 
    s.status === 'active' &&
    new Date(s.end_date) > new Date()
  );
};

export const getNearbyStations = (latitude, longitude, maxDistance = 10) => {
  // Simple distance calculation (not accurate for real use)
  return mockStations
    .filter(s => s.status === 'active')
    .map(station => {
      const distance = Math.sqrt(
        Math.pow(station.latitude - latitude, 2) + 
        Math.pow(station.longitude - longitude, 2)
      ) * 111; // Rough km conversion
      
      const availableBatteries = getAvailableBatteries(station.station_id);
      
      return {
        ...station,
        distance: distance.toFixed(1),
        available_slots: availableBatteries.length
      };
    })
    .filter(s => parseFloat(s.distance) <= maxDistance)
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};

// Calculate monthly stats
export const calculateMonthlyStats = (userId) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthlySwaps = mockSwapTransactions.filter(t => 
    t.user_id === userId && 
    new Date(t.createAT) >= firstDayOfMonth &&
    t.status === 'completed'
  );
  
  const monthlyPayments = mockPayments.filter(p =>
    p.user_id === userId &&
    new Date(p.payment_time) >= firstDayOfMonth &&
    p.status === 'paid'
  );
  
  const totalCost = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const avgTime = monthlySwaps.length > 0 
    ? monthlySwaps.reduce((sum, swap) => {
        const create = new Date(swap.createAT);
        const update = new Date(swap.updateAt);
        return sum + (update - create) / 60000; // minutes
      }, 0) / monthlySwaps.length
    : 0;
  
  return {
    totalSwaps: monthlySwaps.length,
    totalCost: totalCost,
    avgTime: avgTime.toFixed(1)
  };
};
