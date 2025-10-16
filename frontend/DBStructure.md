Table users {
  user_id int [pk, increment]
  username varchar [unique, not null]
  password_hash varchar
  phone varchar
  email varchar
  role enum('driver', 'station_staff', 'admin') [not null]
  created_at datetime
}

Table vehicles {
  vehicle_id int [pk, increment]
  user_id int [ref: > users.user_id]
  battery_id int [ref: > batteries.battery_id]
  vin varchar [unique, not null]
  cong_suat_dong_co double
  battery_model varchar
  battery_type varchar
}

Table changing_stations {
  station_id int [pk, increment]
  name varchar
  address varchar
  latitude double
  longitude double
  status enum('active', 'inactive', 'maintenance')
}

Table batteries {
  battery_id int [pk, increment]
  vehicle_id int [ref: > vehicles.vehicle_id]
  station_id int [ref: > changing_stations.station_id]
  model varchar
  capacity int
  pin_hien_tai double
  status enum('full', 'charging', 'booked', 'defective')
  soh decimal
  last_maintenance datetime
}

Table swap_transactions {
  transaction_id int [pk, increment]
  user_id int [ref: > users.user_id]
  vehicle_id int [ref: > vehicles.vehicle_id]
  station_id int [ref: > changing_stations.station_id]
  battery_taken_id int [ref: > batteries.battery_id]
  battery_returned_id int [ref: > batteries.battery_id]
  subscription_id int [ref: > subscription.subscription_id]
  createAT datetime
  updateAt datetime
  status enum('completed', 'failed', 'cancelled')
}

Table reservations {
  reservation_id int [pk, increment]
  user_id int [ref: > users.user_id]
  vehicle_id int [ref: > vehicles.vehicle_id]
  battery_id int [ref: > batteries.battery_id]
  station_id int [ref: > changing_stations.station_id]
  scheduled_time datetime
  status enum('scheduled', 'cancelled', 'completed')
}

Table battery_service_packages {
  package_id int [pk, increment]
  name varchar
  base_distance int
  base_price decimal
  phi_phat int
  duration_days int
  description varchar
  active boolean
}

Table subscription {
  subscription_id int [pk, increment]
  user_id int [ref: > users.user_id]
  package_id int [ref: > battery_service_packages.package_id]
  battery_id int [ref: > batteries.battery_id]
  swap_count int
  start_date date
  end_date date
  status enum('active', 'expired', 'cancelled')
}

Table payments {
  payment_id int [pk, increment]
  user_id int [ref: > users.user_id]
  amount decimal
  payment_time datetime
  method enum('cash', 'credit_card', 'bank_transfer', 'e_wallet')
  status enum('paid', 'pending', 'failed')
  invoice_url varchar
}

Table supports {
  support_id int [pk, increment]
  user_id int [ref: > users.user_id]
  station_id int [ref: > changing_stations.station_id]
  type enum('battery_issue', 'station_issue', 'other')
  description varchar
  created_at datetime
  status enum('open', 'in_progress', 'closed')
  rating int
}

Table station_staff {
  staff_id int [pk, increment]
  user_id int [ref: > users.user_id]
  station_id int [ref: > changing_stations.station_id]
  assigned_at datetime
  role enum('manager', 'staff')
}

Table battery_transfer {
  transfer_id int [pk, increment]
  battery_id int [ref: > batteries.battery_id]
  from_station_id int [ref: > changing_stations.station_id]
  to_station_id int [ref: > changing_stations.station_id]
  transfer_time datetime
  status enum('completed', 'in_progress', 'cancelled')
}

Table config {
  config_id int [pk, increment]
  name string
  value double
  description string
}