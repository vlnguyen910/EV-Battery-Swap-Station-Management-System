// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data in correct order (foreign keys first)
    await prisma.reservation.deleteMany();
    await prisma.battery.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.batteryServicePackage.deleteMany();
    await prisma.station.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Cleared existing data');

//     // 1. Create 5 Users
//     console.log('👥 Creating users...');
//     const usersData = [
//         {
//             username: 'admin',
//             password: 'admin123',
//             phone: '0123456789',
//             email: 'admin@evswap.com',
//             role: 'admin' as const,
//         },
//         {
//             username: 'staff01',
//             password: 'staff123',
//             phone: '0987654321',
//             email: 'staff01@evswap.com',
//             role: 'station_staff' as const,
//         },
//         {
//             username: 'driver01',
//             password: 'driver123',
//             phone: '0912345678',
//             email: 'driver01@evswap.com',
//             role: 'driver' as const,
//         },
//         {
//             username: 'driver02',
//             password: 'driver123',
//             phone: '0912345679',
//             email: 'driver02@evswap.com',
//             role: 'driver' as const,
//         },
//         {
//             username: 'driver03',
//             password: 'driver123',
//             phone: '0912345680',
//             email: 'driver03@evswap.com',
//             role: 'driver' as const,
//         },
//     ];

//     const users = [];
//     for (const userData of usersData) {
//         const hashedPassword = await bcrypt.hash(userData.password, 10);
//         const user = await prisma.user.create({
//             data: {
//                 ...userData,
//                 password: hashedPassword,
//             },
//         });
//         users.push(user);
//     }

//     console.log(`✅ Created ${users.length} users`);

//     // 2. Create 5 Swapping Stations
//     console.log('🏢 Creating swapping stations...');
//     const stationsData = [
//         {
//             name: 'EV Station District 1 - Nguyen Hue',
//             address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
//             latitude: '10.7769',
//             longitude: '106.7009',
//             status: 'active' as const,
//         },
//         {
//             name: 'EV Station District 3 - Vo Van Tan',
//             address: '456 Vo Van Tan Street, District 3, Ho Chi Minh City',
//             latitude: '10.7859',
//             longitude: '106.6890',
//             status: 'active' as const,
//         },
//         {
//             name: 'EV Station Thu Duc - Landmark 81',
//             address: '101 Vo Nguyen Giap, Thu Duc City, Ho Chi Minh City',
//             latitude: '10.8411',
//             longitude: '106.8097',
//             status: 'active' as const,
//         },
//         {
//             name: 'EV Station District 7 - PMH',
//             address: '789 Nguyen Thi Thap, District 7, Ho Chi Minh City',
//             latitude: '10.7411',
//             longitude: '106.7197',
//             status: 'active' as const,
//         },
//         {
//             name: 'EV Station Binh Thanh - Vincom',
//             address: '159 Xa Lo Ha Noi, Binh Thanh District, Ho Chi Minh City',
//             latitude: '10.8012',
//             longitude: '106.7103',
//             status: 'maintenance' as const,
//         },
//     ];

//     const stations = [];
//     for (const stationData of stationsData) {
//         const station = await prisma.swappingStation.create({
//             data: {
//                 ...stationData,
//                 latitude: new Decimal(stationData.latitude),
//                 longitude: new Decimal(stationData.longitude),
//             },
//         });
//         stations.push(station);
//     }

//     console.log(`✅ Created ${stations.length} swapping stations`);

//     // 3. Create 5 Vehicles
//     console.log('🚗 Creating vehicles...');
//     const vehiclesData = [
//         {
//             user_id: users[2].user_id, // driver01
//             vin: '1HGBH41JXMN109186',
//             battery_model: 'Tesla Model S Battery',
//             battery_type: 'Lithium-Ion',
//             status: 'active' as const,
//         },
//         {
//             user_id: users[2].user_id, // driver01
//             vin: '1HGBH41JXMN109187',
//             battery_model: 'BYD Blade Battery',
//             battery_type: 'LiFePO4',
//             status: 'active' as const,
//         },
//         {
//             user_id: users[3].user_id, // driver02
//             vin: '2FMDK3GC8DBA12345',
//             battery_model: 'CATL NCM Battery',
//             battery_type: 'Lithium-Ion',
//             status: 'active' as const,
//         },
//         {
//             user_id: users[3].user_id, // driver02
//             vin: '2FMDK3GC8DBA12346',
//             battery_model: 'Tesla Model 3 Battery',
//             battery_type: 'Lithium-Ion',
//             status: 'inactive' as const,
//         },
//         {
//             user_id: users[4].user_id, // driver03
//             vin: '3FA6P0HD9ER123456',
//             battery_model: 'VinFast VF8 Battery',
//             battery_type: 'NCM',
//             status: 'active' as const,
//         },
//     ];

//     const vehicles = [];
//     for (const vehicleData of vehiclesData) {
//         const vehicle = await prisma.vehicle.create({
//             data: vehicleData,
//         });
//         vehicles.push(vehicle);
//     }

//     console.log(`✅ Created ${vehicles.length} vehicles`);

//     // 4. Create 5 Battery Service Packages
//     console.log('📦 Creating battery service packages...');
//     const servicePackagesData = [
//         {
//             name: 'Basic Swap Package',
//             description: 'Standard battery swap service for daily commuters',
//             base_distance: 50,
//             base_price: '50000',
//             swap_count: 1,
//             penalty_fee: 10000,
//             duration_days: 1,
//             active: true,
//         },
//         {
//             name: 'Premium Daily Package',
//             description: 'Premium daily service with unlimited swaps',
//             base_distance: 100,
//             base_price: '150000',
//             swap_count: 999,
//             penalty_fee: 5000,
//             duration_days: 1,
//             active: true,
//         },
//         {
//             name: 'Weekly Commuter Package',
//             description: 'Weekly package for regular commuters',
//             base_distance: 300,
//             base_price: '300000',
//             swap_count: 10,
//             penalty_fee: 15000,
//             duration_days: 7,
//             active: true,
//         },
//         {
//             name: 'Monthly Business Package',
//             description: 'Monthly package for business users',
//             base_distance: 1000,
//             base_price: '1000000',
//             swap_count: 999,
//             penalty_fee: 20000,
//             duration_days: 30,
//             active: true,
//         },
//         {
//             name: 'Legacy Package',
//             description: 'Old package - no longer available',
//             base_distance: 25,
//             base_price: '25000',
//             swap_count: 1,
//             penalty_fee: 25000,
//             duration_days: 1,
//             active: false,
//         },
//     ];

//     const servicePackages = [];
//     for (const packageData of servicePackagesData) {
//         const servicePackage = await prisma.batteryServicePackage.create({
//             data: {
//                 ...packageData,
//                 base_price: new Decimal(packageData.base_price),
//             },
//         });
//         servicePackages.push(servicePackage);
//     }

//     console.log(`✅ Created ${servicePackages.length} service packages`);

//     // 5. Create 5 Batteries
//     console.log('🔋 Creating batteries...');
//     const batteriesData = [
//         {
//             model: 'Tesla Model S Battery',
//             type: 'Lithium-Ion',
//             capacity: '75.50',
//             current_charge: '95.25',
//             soh: '88.75',
//             status: 'full' as const,
//             station_id: stations[0].station_id,
//         },
//         {
//             model: 'BYD Blade Battery',
//             type: 'LiFePO4',
//             capacity: '60.00',
//             current_charge: '87.50',
//             soh: '92.00',
//             status: 'full' as const,
//             station_id: stations[0].station_id,
//         },
//         {
//             model: 'CATL NCM Battery',
//             type: 'Lithium-Ion',
//             capacity: '65.00',
//             current_charge: '76.25',
//             soh: '85.50',
//             status: 'charging' as const,
//             station_id: stations[1].station_id,
//         },
//         {
//             model: 'Tesla Model 3 Battery',
//             type: 'Lithium-Ion',
//             capacity: '54.00',
//             current_charge: '91.75',
//             soh: '89.25',
//             status: 'full' as const,
//             station_id: stations[2].station_id,
//         },
//         {
//             model: 'VinFast VF8 Battery',
//             type: 'NCM',
//             capacity: '87.70',
//             current_charge: '83.50',
//             soh: '91.75',
//             status: 'booked' as const,
//             station_id: stations[3].station_id,
//         },
//     ];

//     const batteries = [];
//     for (const batteryData of batteriesData) {
//         const battery = await prisma.battery.create({
//             data: {
//                 ...batteryData,
//                 capacity: new Decimal(batteryData.capacity),
//                 current_charge: new Decimal(batteryData.current_charge),
//                 soh: new Decimal(batteryData.soh),
//             },
//         });
//         batteries.push(battery);
//     }

//     console.log(`✅ Created ${batteries.length} batteries`);

//     // 6. Create 5 Reservations
//     console.log('📅 Creating reservations...');
//     const reservationsData = [
//         {
//             user_id: users[2].user_id, // driver01
//             battery_id: batteries[0].battery_id,
//             station_id: stations[0].station_id,
//             scheduled_time: new Date('2025-01-15T09:00:00Z'),
//             status: 'scheduled' as const,
//         },
//         {
//             user_id: users[3].user_id, // driver02
//             battery_id: batteries[1].battery_id,
//             station_id: stations[0].station_id,
//             scheduled_time: new Date('2025-01-15T14:30:00Z'),
//             status: 'scheduled' as const,
//         },
//         {
//             user_id: users[4].user_id, // driver03
//             battery_id: batteries[2].battery_id,
//             station_id: stations[1].station_id,
//             scheduled_time: new Date('2025-01-16T10:15:00Z'),
//             status: 'scheduled' as const,
//         },
//         {
//             user_id: users[2].user_id, // driver01
//             battery_id: batteries[3].battery_id,
//             station_id: stations[2].station_id,
//             scheduled_time: new Date('2025-01-14T16:45:00Z'),
//             status: 'completed' as const,
//         },
//         {
//             user_id: users[3].user_id, // driver02
//             battery_id: batteries[4].battery_id,
//             station_id: stations[3].station_id,
//             scheduled_time: new Date('2025-01-17T11:20:00Z'),
//             status: 'cancelled' as const,
//         },
//     ];

//     const reservations = [];
//     for (const reservationData of reservationsData) {
//         const reservation = await prisma.reservation.create({
//             data: reservationData,
//         });
//         reservations.push(reservation);
//     }

//     console.log(`✅ Created ${reservations.length} reservations`);

//     // Summary
//     console.log('\n🎉 Database seeding completed successfully!');
//     console.log('📊 Summary:');
//     console.log(`👥 Users: ${users.length} (1 admin, 1 staff, 3 drivers)`);
//     console.log(`🏢 Stations: ${stations.length} (4 active, 1 maintenance)`);
//     console.log(`🚗 Vehicles: ${vehicles.length} (4 active, 1 inactive)`);
//     console.log(`📦 Service Packages: ${servicePackages.length} (4 active, 1 legacy)`);
//     console.log(`🔋 Batteries: ${batteries.length} (3 full, 1 charging, 1 booked)`);
//     console.log(`📅 Reservations: ${reservations.length} (3 scheduled, 1 completed, 1 cancelled)`);

//     console.log('\n🔑 Test Accounts:');
//     console.log('Admin: admin / admin123');
//     console.log('Staff: staff01 / staff123');
//     console.log('Driver: driver01, driver02, driver03 / driver123');

//     console.log('\n🚀 Ready for testing with minimal data!');
// }

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('📝 Database connection closed');
    });
}