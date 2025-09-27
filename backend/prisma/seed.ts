// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library.js';
import * as bcrypt from 'bcrypt';

type BatteryType = Awaited<ReturnType<typeof prisma.battery.create>>;

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional)
    await prisma.battery.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.swappingStation.deleteMany();
    await prisma.user.deleteMany();

    // 1. Seed Users
    console.log('👥 Seeding users...');
    const users = await Promise.all([
        // Admin user
        prisma.user.create({
            data: {
                username: 'admin',
                password: await bcrypt.hash('admin123', 10),
                phone: '0123456789',
                email: 'admin@evswap.com',
                role: 'admin',
            },
        }),
        // Station staff
        prisma.user.create({
            data: {
                username: 'staff01',
                password: await bcrypt.hash('staff123', 10),
                phone: '0123456790',
                email: 'staff01@evswap.com',
                role: 'station_staff',
            },
        }),
        prisma.user.create({
            data: {
                username: 'staff02',
                password: await bcrypt.hash('staff123', 10),
                phone: '0123456791',
                email: 'staff02@evswap.com',
                role: 'station_staff',
            },
        }),
        // Drivers
        prisma.user.create({
            data: {
                username: 'driver01',
                password: await bcrypt.hash('driver123', 10),
                phone: '0123456792',
                email: 'driver01@evswap.com',
                role: 'driver',
            },
        }),
        prisma.user.create({
            data: {
                username: 'driver02',
                password: await bcrypt.hash('driver123', 10),
                phone: '0123456793',
                email: 'driver02@evswap.com',
                role: 'driver',
            },
        }),
        prisma.user.create({
            data: {
                username: 'driver03',
                password: await bcrypt.hash('driver123', 10),
                phone: '0123456794',
                email: 'driver03@evswap.com',
                role: 'driver',
            },
        }),
    ]);

    // 2. Seed Swapping Stations
    console.log('🏢 Seeding swapping stations...');
    const stations = await Promise.all([
        prisma.swappingStation.create({
            data: {
                name: 'Station District 1 - Active',
                address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
                latitude: new Decimal('10.7769'),
                longitude: new Decimal('106.7009'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'Station District 3 - Active',
                address: '456 Vo Van Tan Street, District 3, Ho Chi Minh City',
                latitude: new Decimal('10.7859'),
                longitude: new Decimal('106.6890'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'Station District 7 - Maintenance',
                address: '789 Nguyen Thi Thap Street, District 7, Ho Chi Minh City',
                latitude: new Decimal('10.7411'),
                longitude: new Decimal('106.7197'),
                status: 'maintenance', // Station không available
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'Station Thu Duc - Active',
                address: '101 Vo Nguyen Giap, Thu Duc City, Ho Chi Minh City',
                latitude: new Decimal('10.8411'),
                longitude: new Decimal('106.8097'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'Station Binh Tan - Inactive',
                address: '202 Kinh Duong Vuong, Binh Tan District, Ho Chi Minh City',
                latitude: new Decimal('10.7411'),
                longitude: new Decimal('106.6197'),
                status: 'inactive', // Station không available
            },
        }),
    ]);

    // 3. Seed Vehicles (để biết user cần loại pin nào)
    console.log('🚗 Seeding vehicles...');
    const vehicles = await Promise.all([
        // Driver01 vehicles
        prisma.vehicle.create({
            data: {
                user_id: users[3].user_id, // driver01
                vin: '1HGBH41JXMN109186',
                battery_model: 'Tesla Model S Battery',
                battery_type: 'Lithium-Ion',
                status: 'active',
            },
        }),
        prisma.vehicle.create({
            data: {
                user_id: users[3].user_id, // driver01
                vin: '1HGBH41JXMN109187',
                battery_model: 'BYD Blade Battery',
                battery_type: 'LiFePO4',
                status: 'active',
            },
        }),
        // Driver02 vehicles
        prisma.vehicle.create({
            data: {
                user_id: users[4].user_id, // driver02
                vin: '2FMDK3GC8DBA12345',
                battery_model: 'CATL NCM Battery',
                battery_type: 'Lithium-Ion',
                status: 'active',
            },
        }),
        prisma.vehicle.create({
            data: {
                user_id: users[4].user_id, // driver02
                vin: '2FMDK3GC8DBA12346',
                battery_model: 'Tesla Model 3 Battery',
                battery_type: 'Lithium-Ion',
                status: 'inactive', // Vehicle không active
            },
        }),
        // Driver03 vehicles
        prisma.vehicle.create({
            data: {
                user_id: users[5].user_id, // driver03
                vin: '3FA6P0HD9ER123456',
                battery_model: 'VinFast VF8 Battery',
                battery_type: 'NCM',
                status: 'active',
            },
        }),
    ]);

    // 4. Seed Batteries
    console.log('🔋 Seeding batteries...');
    const batteries: any[] = [];

    // Station 1 (Active) - Có pin cho Tesla Model S và BYD Blade (phù hợp với driver01)
    // Tesla Model S Battery - Pin đầy (available cho driver01)
    for (let i = 1; i <= 3; i++) {
        const battery = await prisma.battery.create({
            data: {
                model: 'Tesla Model S Battery',
                type: 'Lithium-Ion',
                capacity: new Decimal('75.50'),
                current_charge: new Decimal((Math.random() * 20 + 80).toFixed(2)), // 80-100% (đầy)
                soh: new Decimal((Math.random() * 20 + 80).toFixed(2)), // 80-100%
                status: 'full', // Pin đầy
                station_id: stations[0].station_id,
            },
        });
        batteries.push(battery);
    }

    // BYD Blade Battery - Pin đầy (available cho driver01)
    for (let i = 1; i <= 2; i++) {
        const battery = await prisma.battery.create({
            data: {
                model: 'BYD Blade Battery',
                type: 'LiFePO4',
                capacity: new Decimal('60.00'),
                current_charge: new Decimal((Math.random() * 15 + 85).toFixed(2)), // 85-100% (đầy)
                soh: new Decimal((Math.random() * 20 + 75).toFixed(2)), // 75-95%
                status: 'full', // Pin đầy
                station_id: stations[0].station_id,
            },
        });
        batteries.push(battery);
    }

    // CATL NCM Battery - Một số đầy, một số đang sạc (available cho driver02)
    for (let i = 1; i <= 4; i++) {
        const isFullyCharged = i <= 2; // 2 pin đầu đầy, 2 pin sau đang sạc
        const battery = await prisma.battery.create({
            data: {
                model: 'CATL NCM Battery',
                type: 'Lithium-Ion',
                capacity: new Decimal('65.00'),
                current_charge: new Decimal(
                    isFullyCharged 
                        ? (Math.random() * 15 + 85).toFixed(2) // 85-100% (đầy)
                        : (Math.random() * 50 + 30).toFixed(2) // 30-80% (đang sạc)
                ),
                soh: new Decimal((Math.random() * 20 + 75).toFixed(2)), // 75-95%
                status: isFullyCharged ? 'full' : 'charging',
                station_id: stations[0].station_id,
            },
        });
        batteries.push(battery);
    }

    // Station 2 (Active) - Có pin Tesla Model 3 và VinFast
    // Tesla Model 3 Battery - Đang sạc (không available cho swap ngay)
    for (let i = 1; i <= 3; i++) {
        const battery = await prisma.battery.create({
            data: {
                model: 'Tesla Model 3 Battery',
                type: 'Lithium-Ion',
                capacity: new Decimal('54.00'),
                current_charge: new Decimal((Math.random() * 50 + 20).toFixed(2)), // 20-70% (đang sạc)
                soh: new Decimal((Math.random() * 20 + 70).toFixed(2)), // 70-90%
                status: 'charging', // Đang sạc
                station_id: stations[1].station_id,
            },
        });
        batteries.push(battery);
    }

    // VinFast VF8 Battery - Pin đầy (available cho driver03)
    for (let i = 1; i <= 2; i++) {
        const battery = await prisma.battery.create({
            data: {
                model: 'VinFast VF8 Battery',
                type: 'NCM',
                capacity: new Decimal('87.70'),
                current_charge: new Decimal((Math.random() * 15 + 85).toFixed(2)), // 85-100% (đầy)
                soh: new Decimal((Math.random() * 15 + 85).toFixed(2)), // 85-100%
                status: 'full', // Pin đầy
                station_id: stations[1].station_id,
            },
        });
        batteries.push(battery);
    }

    // Thêm một vài pin Tesla Model 3 đầy ở Station 2
    for (let i = 1; i <= 2; i++) {
        const battery = await prisma.battery.create({
            data: {
                model: 'Tesla Model 3 Battery',
                type: 'Lithium-Ion',
                capacity: new Decimal('54.00'),
                current_charge: new Decimal((Math.random() * 15 + 85).toFixed(2)), // 85-100% (đầy)
                soh: new Decimal((Math.random() * 15 + 85).toFixed(2)), // 85-100%
                status: 'full', // Pin đầy
                station_id: stations[1].station_id,
            },
        });
        batteries.push(battery);
    }

    // Station 3 (Maintenance) - Có pin đầy nhưng station không active
    for (let i = 1; i <= 3; i++) {
        const battery = await prisma.battery.create({
            data: {
                model: 'Tesla Model S Battery',
                type: 'Lithium-Ion',
                capacity: new Decimal('75.50'),
                current_charge: new Decimal((Math.random() * 20 + 80).toFixed(2)), // Pin đầy
                soh: new Decimal((Math.random() * 20 + 80).toFixed(2)),
                status: 'full', // Pin đầy nhưng station maintenance
                station_id: stations[2].station_id,
            },
        });
        batteries.push(battery);
    }

    // Station 4 (Active) - Có nhiều loại pin đầy
    // Tesla Model S Battery - Pin đầy
    const battery1 = await prisma.battery.create({
        data: {
            model: 'Tesla Model S Battery',
            type: 'Lithium-Ion',
            capacity: new Decimal('75.50'),
            current_charge: new Decimal('95.50'), // Đầy
            soh: new Decimal('88.50'),
            status: 'full', // Pin đầy
            station_id: stations[3].station_id,
        },
    });
    batteries.push(battery1);

    // BYD Blade Battery - Pin đầy
    const battery2 = await prisma.battery.create({
        data: {
            model: 'BYD Blade Battery',
            type: 'LiFePO4',
            capacity: new Decimal('60.00'),
            current_charge: new Decimal('92.00'), // Đầy
            soh: new Decimal('85.00'),
            status: 'full', // Pin đầy
            station_id: stations[3].station_id,
        },
    });
    batteries.push(battery2);

    // CATL NCM Battery - Pin đầy
    const battery3 = await prisma.battery.create({
        data: {
            model: 'CATL NCM Battery',
            type: 'Lithium-Ion',
            capacity: new Decimal('65.00'),
            current_charge: new Decimal('90.50'),
            soh: new Decimal('87.00'),
            status: 'full', // Pin đầy
            station_id: stations[3].station_id,
        },
    });
    batteries.push(battery3);

    // Station 5 (Inactive) - Có pin đầy nhưng station không active
    const battery4 = await prisma.battery.create({
        data: {
            model: 'VinFast VF8 Battery',
            type: 'NCM',
            capacity: new Decimal('87.70'),
            current_charge: new Decimal('98.00'), // Pin đầy
            soh: new Decimal('90.00'),
            status: 'full', // Pin đầy nhưng station inactive
            station_id: stations[4].station_id,
        },
    });
    batteries.push(battery4);

    // Batteries đang được sử dụng (in vehicles)
    const inUseBatteries: BatteryType[] = [];
    for (let i = 1; i <= 3; i++) {
        const battery = await prisma.battery.create({
            data: {
                model: 'Tesla Model S Battery',
                type: 'Lithium-Ion',
                capacity: new Decimal('75.50'),
                current_charge: new Decimal((Math.random() * 60 + 20).toFixed(2)), // 20-80% (đang sử dụng)
                soh: new Decimal((Math.random() * 20 + 70).toFixed(2)), // 70-90%
                status: 'booked', // Đang được sử dụng
                station_id: null, // Không ở trạm nào
            },
        });
        inUseBatteries.push(battery);
    }

    // Thêm một số pin defective để test
    for (let i = 1; i <= 2; i++) {
        const battery = await prisma.battery.create({
            data: {
                model: 'Tesla Model 3 Battery',
                type: 'Lithium-Ion',
                capacity: new Decimal('54.00'),
                current_charge: new Decimal('0.00'), // Pin hỏng
                soh: new Decimal('30.00'), // SOH thấp
                status: 'defective', // Pin hỏng
                station_id: stations[0].station_id,
            },
        });
        batteries.push(battery);
    }

    // Assign một số pin đang sử dụng cho vehicles
    await prisma.vehicle.update({
        where: { vehicle_id: vehicles[0].vehicle_id },
        data: { battery_id: inUseBatteries[0].battery_id },
    });

    await prisma.battery.update({
        where: { battery_id: inUseBatteries[0].battery_id },
        data: { vehicle_id: vehicles[0].vehicle_id },
    });

    await prisma.vehicle.update({
        where: { vehicle_id: vehicles[2].vehicle_id },
        data: { battery_id: inUseBatteries[1].battery_id },
    });

    await prisma.battery.update({
        where: { battery_id: inUseBatteries[1].battery_id },
        data: { vehicle_id: vehicles[2].vehicle_id },
    });

    console.log('✅ Database seeding completed!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${stations.length} swapping stations`);
    console.log(`Created ${batteries.length + inUseBatteries.length} batteries`);
    console.log(`Created ${vehicles.length} vehicles`);
    
    console.log('\n📊 Summary for testing:');
    console.log('🚗 Driver01 (user_id: 4) has vehicles requiring:');
    console.log('  - Tesla Model S Battery + Lithium-Ion');
    console.log('  - BYD Blade Battery + LiFePO4');
    console.log('  ✅ Available stations: Station 1 (3 Tesla + 2 BYD full), Station 4 (1 Tesla + 1 BYD full)');
    
    console.log('\n🚗 Driver02 (user_id: 5) has vehicles requiring:');
    console.log('  - CATL NCM Battery + Lithium-Ion (active)');
    console.log('  - Tesla Model 3 Battery + Lithium-Ion (inactive vehicle)');
    console.log('  ✅ Available stations: Station 1 (2 CATL full), Station 4 (1 CATL full), Station 2 (2 Tesla Model 3 full)');
    
    console.log('\n🚗 Driver03 (user_id: 6) has vehicles requiring:');
    console.log('  - VinFast VF8 Battery + NCM');
    console.log('  ✅ Available stations: Station 2 (2 VinFast full)');
    
    console.log('\n🔋 Battery Status Summary:');
    console.log('  - Full batteries: Available for immediate swap');
    console.log('  - Charging batteries: Not available for swap yet');
    console.log('  - Booked batteries: Currently in use with vehicles');
    console.log('  - Defective batteries: Need maintenance');
    
    console.log('\n🏢 Station Status:');
    console.log('  - Active stations: Station 1, Station 2, Station 4');
    console.log('  - Maintenance station: Station 3 (has batteries but not available)');
    console.log('  - Inactive station: Station 5 (has batteries but not available)');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });