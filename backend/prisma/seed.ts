// import { PrismaClient, SubscriptionStatus } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//     // Clear existing data
//     await prisma.subscription.deleteMany();
//     await prisma.swapTransaction.deleteMany();
//     await prisma.reservation.deleteMany();
//     await prisma.vehicle.deleteMany();
//     await prisma.batteryServicePackage.deleteMany();
//     await prisma.battery.deleteMany();
//     await prisma.station.deleteMany();
//     await prisma.user.deleteMany();

//     // Seed Users
//     const users = await prisma.user.createMany({
//         data: [
//             {
//                 username: 'john_doe',
//                 email: 'john@example.com',
//                 password: '12345',
//                 phone: '+1234567890',
//                 role: 'driver'
//             },
//             {
//                 username: 'jane_smith',
//                 email: 'jane@example.com',
//                 password: '12345',
//                 phone: '+1234567891',
//                 role: 'admin'
//             },
//             {
//                 username: 'bob_wilson',
//                 email: 'bob@example.com',
//                 password: '12345',
//                 phone: '+1234567892',
//                 role: 'driver'
//             }
//         ]
//     });

//     // Seed Stations
//     const stations = await prisma.station.createMany({
//         data: [
//             {
//                 name: 'Downtown Station',
//                 address: '123 Main St, City Center',
//                 latitude: 40.7128,
//                 longitude: -74.0060,
//                 status: 'active'
//             },
//             {
//                 name: 'Airport Station',
//                 address: '456 Airport Rd, Terminal 1',
//                 latitude: 40.6892,
//                 longitude: -74.1745,
//                 status: 'active'
//             },
//             {
//                 name: 'Mall Station',
//                 address: '789 Shopping Blvd, Mall Plaza',
//                 latitude: 40.7589,
//                 longitude: -73.9851,
//                 status: 'maintenance'
//             }
//         ]
//     });

//     // Get created stations to use their IDs
//     const createdStations = await prisma.station.findMany();

//     // Seed Batteries
//     const batteries = await prisma.battery.createMany({
//         data: [
//             {
//                 station_id: createdStations[0].station_id,
//                 model: 'Tesla Model 3 Battery',
//                 type: 'Lithium-Ion',
//                 capacity: 75.0,
//                 current_charge: 85.5,
//                 soh: 95.0,
//                 status: 'full'
//             },
//             {
//                 station_id: createdStations[1].station_id,
//                 model: 'Nissan Leaf Battery',
//                 type: 'Lithium-Ion',
//                 capacity: 60.0,
//                 current_charge: 92.0,
//                 soh: 98.0,
//                 status: 'charging'
//             },
//             {
//                 station_id: createdStations[2].station_id,
//                 model: 'BMW iX3 Battery',
//                 type: 'LiFePO4',
//                 capacity: 80.0,
//                 current_charge: 45.5,
//                 soh: 88.5,
//                 status: 'full'
//             }
//         ]
//     });

//     // Get created users and packages
//     const createdUsers = await prisma.user.findMany();
//     const createdPackages = await prisma.batteryServicePackage.findMany();

//     // Seed Vehicles
//     const vehicles = await prisma.vehicle.createMany({
//         data: [
//             {
//                 user_id: createdUsers[0].user_id,
//                 vin: 'ABC123456789',
//                 battery_model: 'Tesla Model 3 Battery',
//                 battery_type: 'Lithium-Ion',
//                 status: 'active'
//             },
//             {
//                 user_id: createdUsers[1].user_id,
//                 vin: 'XYZ987654321',
//                 battery_model: 'Nissan Leaf Battery',
//                 battery_type: 'Lithium-Ion',
//                 status: 'active'
//             },
//             {
//                 user_id: createdUsers[2].user_id,
//                 vin: 'DEF456123789',
//                 battery_model: 'BMW iX3 Battery',
//                 battery_type: 'LiFePO4',
//                 status: 'active'
//             }
//         ]
//     });

//     // Get created vehicles and batteries
//     const createdVehicles = await prisma.vehicle.findMany();
//     const createdBatteries = await prisma.battery.findMany();

//     // Seed Reservations
//     const reservations = await prisma.reservation.createMany({
//         data: [
//             {
//                 user_id: createdUsers[0].user_id,
//                 station_id: createdStations[0].station_id,
//                 vehicle_id: createdVehicles[0].vehicle_id,
//                 battery_id: createdBatteries[0].battery_id,
//                 scheduled_time: new Date('2024-01-20T14:30:00'),
//                 status: 'scheduled'
//             },
//             {
//                 user_id: createdUsers[1].user_id,
//                 station_id: createdStations[1].station_id,
//                 vehicle_id: createdVehicles[1].vehicle_id,
//                 battery_id: createdBatteries[1].battery_id,
//                 scheduled_time: new Date('2024-01-21T16:00:00'),
//                 status: 'scheduled'
//             },
//             {
//                 user_id: createdUsers[2].user_id,
//                 station_id: createdStations[2].station_id,
//                 vehicle_id: createdVehicles[2].vehicle_id,
//                 battery_id: createdBatteries[2].battery_id,
//                 scheduled_time: new Date('2024-01-22T10:15:00'),
//                 status: 'cancelled'
//             }
//         ]
//     });

//     // Seed Swap Transactions
//     const swapTransactions = await prisma.swapTransaction.createMany({
//         data: [
//             {
//                 user_id: createdUsers[0].user_id,
//                 vehicle_id: createdVehicles[0].vehicle_id,
//                 station_id: createdStations[0].station_id,
//                 battery_taken_id: createdBatteries[0].battery_id,
//                 battery_returned_id: createdBatteries[1].battery_id,
//             },
//             {
//                 user_id: createdUsers[1].user_id,
//                 vehicle_id: createdVehicles[1].vehicle_id,
//                 station_id: createdStations[1].station_id,
//                 battery_taken_id: createdBatteries[1].battery_id,
//                 battery_returned_id: createdBatteries[2].battery_id,
//             },
//             {
//                 user_id: createdUsers[2].user_id,
//                 vehicle_id: createdVehicles[2].vehicle_id,
//                 station_id: createdStations[2].station_id,
//                 battery_taken_id: createdBatteries[2].battery_id,
//                 battery_returned_id: createdBatteries[0].battery_id,
//             }
//         ]
//     });

//     console.log('Database seeded successfully!');
//     console.log(`Created ${users.count} users`);
//     console.log(`Created ${stations.count} stations`);
//     console.log(`Created ${batteries.count} batteries`);
//     console.log(`Created ${vehicles.count} vehicles`);
//     console.log(`Created ${reservations.count} reservations`);
//     console.log(`Created ${swapTransactions.count} swap transactions`);
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });