// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function clearDatabase() {
//     console.log('🗑️  Clearing existing data...\n');

//     // Delete in correct order to respect foreign key constraints
//     await prisma.batteriesTransfer.deleteMany();
//     await prisma.batteryTransferTicket.deleteMany();
//     await prisma.batteryTransferRequest.deleteMany();
//     await prisma.support.deleteMany();
//     await prisma.payment.deleteMany();
//     await prisma.swapTransaction.deleteMany();
//     await prisma.reservation.deleteMany();
//     await prisma.subscription.deleteMany();
//     await prisma.vehicle.deleteMany();
//     await prisma.battery.deleteMany();
//     await prisma.batteryServicePackage.deleteMany();
//     await prisma.station.deleteMany();
//     await prisma.user.deleteMany();
//     await prisma.config.deleteMany();

//     console.log('✓ All data cleared\n');
// }

// async function seedConfigs() {
//     console.log('⚙️  Seeding configs...');
//     const configs = await Promise.all([
//         prisma.config.create({
//             data: {
//                 type: 'deposit',
//                 name: 'Battery_Deposit_Default',
//                 value: 400000,
//                 description: 'Default battery deposit fee: 400,000 VNĐ',
//                 is_active: true,
//             },
//         }),
//         prisma.config.create({
//             data: {
//                 type: 'late_fee',
//                 name: 'Hourly_Late_Fee',
//                 value: 5000,
//                 description: 'Late return fee per hour',
//                 is_active: true,
//             },
//         }),
//         prisma.config.create({
//             data: {
//                 type: 'service_fee',
//                 name: 'Swap_Service_Fee',
//                 value: 2000,
//                 description: 'Fee for each battery swap transaction',
//                 is_active: true,
//             },
//         }),
//         prisma.config.create({
//             data: {
//                 type: 'penalty',
//                 name: 'Battery_Damage_Penalty',
//                 value: 50000,
//                 description: 'Penalty for battery damage',
//                 is_active: true,
//             },
//         }),
//         prisma.config.create({
//             data: {
//                 type: 'penalty',
//                 name: 'Equipment_Loss_Penalty',
//                 value: 100000,
//                 description: 'Penalty for losing equipment',
//                 is_active: true,
//             },
//         }),
//         prisma.config.create({
//             data: {
//                 type: 'swap_fee',
//                 name: 'Express_Swap_Fee',
//                 value: 5000,
//                 description: 'Additional fee for express swap service',
//                 is_active: true,
//             },
//         }),
//         prisma.config.create({
//             data: {
//                 type: 'damage_fee',
//                 name: 'Minor_Damage_Fee',
//                 value: 10000,
//                 description: 'Fee for minor damage to vehicles',
//                 is_active: true,
//             },
//         }),
//         prisma.config.create({
//             data: {
//                 type: 'penalty',
//                 name: 'Overcharge_Fee_Tier1',
//                 value: 216,
//                 description: 'Tier 1 (2000km over limit): 216 VNĐ',
//                 is_active: true,
//             },
//         }),
//         prisma.config.create({
//             data: {
//                 type: 'penalty',
//                 name: 'Overcharge_Fee_Tier2',
//                 value: 195,
//                 description: 'Tier 2 (2001 - 4000km over limit): 195 VNĐ',
//                 is_active: true,
//             },
//         }),
//         prisma.config.create({
//             data: {
//                 type: 'penalty',
//                 name: 'Overcharge_Fee_Tier3',
//                 value: 173,
//                 description: 'Tier 3 (4000km upper over limit): 173 VNĐ',
//                 is_active: true,
//             },
//         }),
//     ]);

//     console.log(`   ✓ Created ${configs.length} configs`);
// }

// async function main() {
//     // Clear database first
//     await clearDatabase();

//     console.log('🌱 Starting database seeding...\n');

//     // Seed configs first
//     await seedConfigs();

//     // 1. Seed Users
//     console.log('👥 Seeding users...');
//     const hashedPassword = await bcrypt.hash('123456', 10);

//     const admin = await prisma.user.create({
//         data: {
//             username: 'Admin User',
//             password: hashedPassword,
//             phone: '0901234567',
//             email: 'admin@evswap.com',
//             role: 'admin',
//         },
//     });

//     const driver1 = await prisma.user.create({
//         data: {
//             username: 'John Driver',
//             password: hashedPassword,
//             phone: '0912345678',
//             email: 'john@gmail.com',
//             role: 'driver',
//         },
//     });

//     const driver2 = await prisma.user.create({
//         data: {
//             username: 'Jane Smith',
//             password: hashedPassword,
//             phone: '0923456789',
//             email: 'jane@gmail.com',
//             role: 'driver',
//         },
//     });

//     console.log(`   ✓ Created ${3} users`);

//     // 2. Seed Stations
//     console.log('🏪 Seeding stations...');
//     const station1 = await prisma.station.create({
//         data: {
//             name: 'Station District 1',
//             address: '123 Nguyen Hue, District 1, HCMC',
//             latitude: 10.77562,
//             longitude: 106.70221,
//             status: 'active',
//         },
//     });

//     const station2 = await prisma.station.create({
//         data: {
//             name: 'Station District 7',
//             address: '456 Nguyen Van Linh, District 7, HCMC',
//             latitude: 10.73291,
//             longitude: 106.71863,
//             status: 'active',
//         },
//     });

//     const station3 = await prisma.station.create({
//         data: {
//             name: 'Station Binh Thanh',
//             address: '789 Xo Viet Nghe Tinh, Binh Thanh, HCMC',
//             latitude: 10.81273,
//             longitude: 106.70441,
//             status: 'maintenance',
//         },
//     });

//     console.log(`   ✓ Created ${3} stations`);

//     // 3. Create Station Staff
//     console.log('👷 Seeding station staff...');
//     const staff1 = await prisma.user.create({
//         data: {
//             username: 'Staff Station 1',
//             password: hashedPassword,
//             phone: '0934567890',
//             email: 'staff1@evswap.com',
//             role: 'station_staff',
//             station_id: station1.station_id,
//         },
//     });

//     const staff2 = await prisma.user.create({
//         data: {
//             username: 'Staff Station 2',
//             password: hashedPassword,
//             phone: '0945678901',
//             email: 'staff2@evswap.com',
//             role: 'station_staff',
//             station_id: station2.station_id,
//         },
//     });

//     const staff3 = await prisma.user.create({
//         data: {
//             username: 'Staff Station 3',
//             password: hashedPassword,
//             phone: '0956789012',
//             email: 'staff3@evswap.com',
//             role: 'station_staff',
//             station_id: station3.station_id,
//         },
//     });

//     console.log(`   ✓ Created ${3} station staff`);

//     // 4. Seed Batteries
//     console.log('🔋 Seeding batteries...');
//     const batteries = [];

//     // Station 1 batteries
//     for (let i = 1; i <= 5; i++) {
//         batteries.push(
//             await prisma.battery.create({
//                 data: {
//                     station_id: station1.station_id,
//                     model: `Battery Model ${i}`,
//                     type: i % 2 === 0 ? 'Lithium-Ion' : 'LiFePO4',
//                     capacity: 75.5,
//                     current_charge: 80.0 + i,
//                     soh: 95.0 + i * 0.5,
//                     status: i === 1 ? 'full' : i === 2 ? 'charging' : 'full',
//                 },
//             })
//         );
//     }

//     // Station 2 batteries
//     for (let i = 6; i <= 10; i++) {
//         batteries.push(
//             await prisma.battery.create({
//                 data: {
//                     station_id: station2.station_id,
//                     model: `Battery Model ${i}`,
//                     type: i % 2 === 0 ? 'Lithium-Ion' : 'LiFePO4',
//                     capacity: 75.5,
//                     current_charge: 75.0 + (i % 5),
//                     soh: 93.0 + (i % 5) * 0.8,
//                     status: i === 6 ? 'charging' : 'full',
//                 },
//             })
//         );
//     }

//     // Station 3 batteries
//     for (let i = 11; i <= 15; i++) {
//         batteries.push(
//             await prisma.battery.create({
//                 data: {
//                     station_id: station3.station_id,
//                     model: `Battery Model ${i}`,
//                     type: i % 2 === 0 ? 'Lithium-Ion' : 'LiFePO4',
//                     capacity: 75.5,
//                     current_charge: 70.0 + (i % 5),
//                     soh: 90.0 + (i % 5) * 0.6,
//                     status: 'full',
//                 },
//             })
//         );
//     }

//     console.log(`   ✓ Created ${batteries.length} batteries`);

//     // 5. Seed Vehicles
//     console.log('🚗 Seeding vehicles...');
//     const vehicle1 = await prisma.vehicle.create({
//         data: {
//             user_id: driver1.user_id,
//             battery_id: batteries[0].battery_id,
//             vin: 'VIN1234567890ABCD1',
//             battery_model: 'Battery Model 1',
//             battery_type: 'LiFePO4',
//             status: 'active',
//         },
//     });

//     const vehicle2 = await prisma.vehicle.create({
//         data: {
//             user_id: driver2.user_id,
//             battery_id: batteries[5].battery_id,
//             vin: 'VIN1234567890ABCD2',
//             battery_model: 'Battery Model 6',
//             battery_type: 'Lithium-Ion',
//             status: 'active',
//         },
//     });

//     const vehicle3 = await prisma.vehicle.create({
//         data: {
//             user_id: driver1.user_id,
//             vin: 'VIN1234567890ABCD3',
//             battery_model: 'Battery Model 2',
//             battery_type: 'Lithium-Ion',
//             status: 'inactive',
//         },
//     });

//     console.log(`   ✓ Created ${3} vehicles`);

//     // 6. Seed Battery Service Packages
//     console.log('📦 Seeding battery service packages...');
//     const basicPackage = await prisma.batteryServicePackage.create({
//         data: {
//             name: 'Basic Package',
//             base_distance: 1000,
//             base_price: 500000,
//             swap_count: 10,
//             penalty_fee: 50000,
//             duration_days: 30,
//             description: 'Perfect for light users',
//             active: true,
//         },
//     });

//     const standardPackage = await prisma.batteryServicePackage.create({
//         data: {
//             name: 'Standard Package',
//             base_distance: 2000,
//             base_price: 900000,
//             swap_count: 20,
//             penalty_fee: 45000,
//             duration_days: 30,
//             description: 'Most popular package',
//             active: true,
//         },
//     });

//     const premiumPackage = await prisma.batteryServicePackage.create({
//         data: {
//             name: 'Premium Package',
//             base_distance: 5000,
//             base_price: 2000000,
//             swap_count: 50,
//             penalty_fee: 40000,
//             duration_days: 30,
//             description: 'Unlimited swaps for heavy users',
//             active: true,
//         },
//     });

//     console.log(`   ✓ Created ${3} battery service packages`);

//     // 7. Seed Subscriptions
//     console.log('📋 Seeding subscriptions...');
//     const subscription1 = await prisma.subscription.create({
//         data: {
//             user_id: driver1.user_id,
//             package_id: standardPackage.package_id,
//             vehicle_id: vehicle1.vehicle_id,
//             start_date: new Date(),
//             end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//             status: 'active',
//             swap_used: 5,
//             distance_traveled: 850.5,
//         },
//     });

//     const subscription2 = await prisma.subscription.create({
//         data: {
//             user_id: driver2.user_id,
//             package_id: basicPackage.package_id,
//             vehicle_id: vehicle2.vehicle_id,
//             start_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
//             end_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
//             status: 'expired',
//             swap_used: 10,
//             distance_traveled: 1000.0,
//         },
//     });

//     console.log(`   ✓ Created ${2} subscriptions`);

//     // 8. Seed Payments
//     console.log('💰 Seeding payments...');
//     await prisma.payment.create({
//         data: {
//             user_id: driver1.user_id,
//             amount: 900000,
//             payment_time: new Date(),
//             method: 'vnpay',
//             status: 'success',
//             order_info: 'Standard Package Payment',
//             package_id: standardPackage.package_id,
//             subscription_id: subscription1.subscription_id,
//             transaction_id: 'TXN' + Date.now() + '001',
//             vnp_txn_ref: 'VNPAY' + Date.now() + '001',
//             vnp_bank_code: 'NCB',
//             vnp_card_type: 'ATM',
//             vnp_response_code: '00',
//         },
//     });

//     await prisma.payment.create({
//         data: {
//             user_id: driver2.user_id,
//             amount: 500000,
//             payment_time: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
//             method: 'credit_card',
//             status: 'success',
//             order_info: 'Basic Package Payment',
//             package_id: basicPackage.package_id,
//             subscription_id: subscription2.subscription_id,
//             transaction_id: 'TXN' + Date.now() + '002',
//         },
//     });

//     await prisma.payment.create({
//         data: {
//             user_id: driver1.user_id,
//             amount: 2000000,
//             method: 'vnpay',
//             status: 'pending',
//             order_info: 'Premium Package Payment',
//             package_id: premiumPackage.package_id,
//             vnp_txn_ref: 'VNPAY' + Date.now() + '003',
//         },
//     });

//     console.log(`   ✓ Created ${3} payments`);

//     // 9. Seed Reservations
//     console.log('📅 Seeding reservations...');
//     await prisma.reservation.create({
//         data: {
//             user_id: driver1.user_id,
//             vehicle_id: vehicle1.vehicle_id,
//             battery_id: batteries[2].battery_id,
//             station_id: station1.station_id,
//             scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000),
//             status: 'scheduled',
//         },
//     });

//     await prisma.reservation.create({
//         data: {
//             user_id: driver2.user_id,
//             vehicle_id: vehicle2.vehicle_id,
//             battery_id: batteries[7].battery_id,
//             station_id: station2.station_id,
//             scheduled_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
//             status: 'completed',
//         },
//     });

//     console.log(`   ✓ Created ${2} reservations`);

//     // 10. Seed Swap Transactions
//     console.log('🔄 Seeding swap transactions...');
//     await prisma.swapTransaction.create({
//         data: {
//             user_id: driver1.user_id,
//             vehicle_id: vehicle1.vehicle_id,
//             station_id: station1.station_id,
//             battery_taken_id: batteries[0].battery_id,
//             battery_returned_id: batteries[1].battery_id,
//             status: 'completed',
//             subscription_id: subscription1.subscription_id,
//         },
//     });

//     await prisma.swapTransaction.create({
//         data: {
//             user_id: driver2.user_id,
//             vehicle_id: vehicle2.vehicle_id,
//             station_id: station2.station_id,
//             battery_taken_id: batteries[5].battery_id,
//             battery_returned_id: batteries[6].battery_id,
//             status: 'completed',
//             subscription_id: subscription2.subscription_id,
//         },
//     });

//     await prisma.swapTransaction.create({
//         data: {
//             user_id: driver1.user_id,
//             vehicle_id: vehicle1.vehicle_id,
//             station_id: station1.station_id,
//             battery_taken_id: batteries[2].battery_id,
//             status: 'failed',
//             subscription_id: subscription1.subscription_id,
//         },
//     });

//     console.log(`   ✓ Created ${3} swap transactions`);

//     // 11. Seed Supports
//     console.log('🆘 Seeding support tickets...');
//     await prisma.support.create({
//         data: {
//             user_id: driver1.user_id,
//             station_id: station1.station_id,
//             type: 'battery_issue',
//             description: 'Battery not charging properly',
//             status: 'in_progress',
//             rating: null,
//         },
//     });

//     await prisma.support.create({
//         data: {
//             user_id: driver2.user_id,
//             station_id: station2.station_id,
//             type: 'station_issue',
//             description: 'Station equipment malfunction',
//             status: 'closed',
//             rating: 4,
//         },
//     });

//     await prisma.support.create({
//         data: {
//             user_id: driver1.user_id,
//             type: 'other',
//             description: 'Question about subscription renewal',
//             status: 'open',
//         },
//     });

//     console.log(`   ✓ Created ${3} support tickets`);

//     // 12. Seed Battery Transfer Requests
//     console.log('📦 Seeding battery transfer requests...');
//     const transferRequest1 = await prisma.batteryTransferRequest.create({
//         data: {
//             battery_model: 'Battery Model 1',
//             battery_type: 'LiFePO4',
//             quantity: 3,
//             from_station_id: station1.station_id,
//             to_station_id: station2.station_id,
//             status: 'completed',
//             created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//         },
//     });

//     const transferRequest2 = await prisma.batteryTransferRequest.create({
//         data: {
//             battery_model: 'Battery Model 6',
//             battery_type: 'Lithium-Ion',
//             quantity: 2,
//             from_station_id: station2.station_id,
//             to_station_id: station3.station_id,
//             status: 'in_progress',
//             created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//         },
//     });

//     const transferRequest3 = await prisma.batteryTransferRequest.create({
//         data: {
//             battery_model: 'Battery Model 11',
//             battery_type: 'LiFePO4',
//             quantity: 4,
//             from_station_id: station3.station_id,
//             to_station_id: station1.station_id,
//             status: 'cancelled',
//             created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
//         },
//     });

//     console.log(`   ✓ Created ${3} battery transfer requests`);

//     // 13. Seed Battery Transfer Tickets
//     console.log('🎫 Seeding battery transfer tickets...');

//     // Export ticket from Station 1 (completed request)
//     const exportTicket1 = await prisma.batteryTransferTicket.create({
//         data: {
//             transfer_request_id: transferRequest1.transfer_request_id,
//             ticket_type: 'export',
//             station_id: station1.station_id,
//             staff_id: staff1.user_id,
//             created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//         },
//     });

//     // Import ticket to Station 2 (completed request)
//     const importTicket1 = await prisma.batteryTransferTicket.create({
//         data: {
//             transfer_request_id: transferRequest1.transfer_request_id,
//             ticket_type: 'import',
//             station_id: station2.station_id,
//             staff_id: staff2.user_id,
//             created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
//         },
//     });

//     // Export ticket from Station 2 (in progress request)
//     const exportTicket2 = await prisma.batteryTransferTicket.create({
//         data: {
//             transfer_request_id: transferRequest2.transfer_request_id,
//             ticket_type: 'export',
//             station_id: station2.station_id,
//             staff_id: staff2.user_id,
//             created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//         },
//     });

//     console.log(`   ✓ Created ${3} battery transfer tickets`);

//     // 14. Seed Batteries Transfer (linking batteries to tickets)
//     console.log('🔗 Seeding batteries transfer records...');

//     // For completed transfer (request 1)
//     await prisma.batteriesTransfer.createMany({
//         data: [
//             {
//                 ticket_id: exportTicket1.ticket_id,
//                 battery_id: batteries[1].battery_id,
//             },
//             {
//                 ticket_id: exportTicket1.ticket_id,
//                 battery_id: batteries[2].battery_id,
//             },
//             {
//                 ticket_id: exportTicket1.ticket_id,
//                 battery_id: batteries[3].battery_id,
//             },
//             {
//                 ticket_id: importTicket1.ticket_id,
//                 battery_id: batteries[1].battery_id,
//             },
//             {
//                 ticket_id: importTicket1.ticket_id,
//                 battery_id: batteries[2].battery_id,
//             },
//             {
//                 ticket_id: importTicket1.ticket_id,
//                 battery_id: batteries[3].battery_id,
//             },
//         ],
//     });

//     // For in-progress transfer (request 2)
//     await prisma.batteriesTransfer.createMany({
//         data: [
//             {
//                 ticket_id: exportTicket2.ticket_id,
//                 battery_id: batteries[6].battery_id,
//             },
//             {
//                 ticket_id: exportTicket2.ticket_id,
//                 battery_id: batteries[7].battery_id,
//             },
//         ],
//     });

//     console.log(`   ✓ Created ${8} batteries transfer records`);

//     console.log('\n✅ Database seeding completed successfully!\n');

//     // Summary
//     console.log('📊 Seeding Summary:');
//     console.log('   Configs:', await prisma.config.count());
//     console.log('   Users:', await prisma.user.count());
//     console.log('   Stations:', await prisma.station.count());
//     console.log('   Batteries:', await prisma.battery.count());
//     console.log('   Vehicles:', await prisma.vehicle.count());
//     console.log('   Packages:', await prisma.batteryServicePackage.count());
//     console.log('   Subscriptions:', await prisma.subscription.count());
//     console.log('   Payments:', await prisma.payment.count());
//     console.log('   Reservations:', await prisma.reservation.count());
//     console.log('   Swap Transactions:', await prisma.swapTransaction.count());
//     console.log('   Support Tickets:', await prisma.support.count());
//     console.log('   Battery Transfer Requests:', await prisma.batteryTransferRequest.count());
//     console.log('   Battery Transfer Tickets:', await prisma.batteryTransferTicket.count());
//     console.log('   Batteries Transfer Records:', await prisma.batteriesTransfer.count());
// }

// main()
//     .catch((e) => {
//         console.error('❌ Error seeding database:', e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });