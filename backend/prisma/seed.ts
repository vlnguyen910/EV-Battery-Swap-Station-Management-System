// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library.js';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional)
    await prisma.battery.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.swappingStation.deleteMany();
    await prisma.user.deleteMany();

    // 1. Seed Users (same as before)
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

    // 2. Seed Swapping Stations - ✅ Removed all capacity fields
    console.log('🏢 Seeding swapping stations...');
    const stations = await Promise.all([
        // ✅ ACTIVE STATIONS - Trong nội thành TP.HCM
        prisma.swappingStation.create({
            data: {
                name: 'EV Station District 1 - Nguyen Hue',
                address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
                latitude: new Decimal('10.7769'),
                longitude: new Decimal('106.7009'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station District 3 - Vo Van Tan',
                address: '456 Vo Van Tan Street, District 3, Ho Chi Minh City',
                latitude: new Decimal('10.7859'),
                longitude: new Decimal('106.6890'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Thu Duc - Landmark 81',
                address: '101 Vo Nguyen Giap, Thu Duc City, Ho Chi Minh City',
                latitude: new Decimal('10.8411'),
                longitude: new Decimal('106.8097'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station District 7 - PMH',
                address: '789 Nguyen Thi Thap, District 7, Ho Chi Minh City',
                latitude: new Decimal('10.7411'),
                longitude: new Decimal('106.7197'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Binh Thanh - Vincom',
                address: '159 Xa Lo Ha Noi, Binh Thanh District, Ho Chi Minh City',
                latitude: new Decimal('10.8012'),
                longitude: new Decimal('106.7103'),
                status: 'active',
            },
        }),

        // ✅ ACTIVE STATIONS - Ngoại thành và xa hơn
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Tan Binh - Airport',
                address: '202 Truong Son, Tan Binh District, Ho Chi Minh City',
                latitude: new Decimal('10.8186'),
                longitude: new Decimal('106.6524'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Go Vap - Pham Van Dong',
                address: '345 Pham Van Dong, Go Vap District, Ho Chi Minh City',
                latitude: new Decimal('10.8406'),
                longitude: new Decimal('106.6774'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station District 12 - Go Dua',
                address: '678 Go Dua Street, District 12, Ho Chi Minh City',
                latitude: new Decimal('10.8692'),
                longitude: new Decimal('106.6389'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Nha Be - Industrial Zone',
                address: '901 Nguyen Van Tao, Nha Be District, Ho Chi Minh City',
                latitude: new Decimal('10.6941'),
                longitude: new Decimal('106.7414'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Can Gio - Seaside',
                address: '234 Can Gio Beach Road, Can Gio District, Ho Chi Minh City',
                latitude: new Decimal('10.4078'),
                longitude: new Decimal('106.9547'),
                status: 'active',
            },
        }),

        // ✅ ACTIVE STATIONS - Vùng phụ cận
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Binh Duong - Thuan An',
                address: '456 National Road 13, Thuan An City, Binh Duong Province',
                latitude: new Decimal('10.9045'),
                longitude: new Decimal('106.7317'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Dong Nai - Bien Hoa',
                address: '789 Phan Trung, Bien Hoa City, Dong Nai Province',
                latitude: new Decimal('10.9460'),
                longitude: new Decimal('106.8230'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Long An - Ben Luc',
                address: '321 Hung Vuong, Ben Luc Town, Long An Province',
                latitude: new Decimal('10.6542'),
                longitude: new Decimal('106.4981'),
                status: 'active',
            },
        }),

        // ❌ MAINTENANCE/INACTIVE STATIONS
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Cu Chi - Under Maintenance',
                address: '147 Tran Hung Dao, Cu Chi District, Ho Chi Minh City',
                latitude: new Decimal('11.0515'),
                longitude: new Decimal('106.4944'),
                status: 'maintenance',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Hoc Mon - Temporarily Closed',
                address: '852 Pham Van Coi, Hoc Mon District, Ho Chi Minh City',
                latitude: new Decimal('10.8841'),
                longitude: new Decimal('106.5927'),
                status: 'inactive',
            },
        }),

        // ✅ ACTIVE STATIONS - Xa hơn để test radius
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Tay Ninh - Border Station',
                address: '963 Cach Mang Thang 8, Tay Ninh City, Tay Ninh Province',
                latitude: new Decimal('11.3100'),
                longitude: new Decimal('106.0983'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station Vung Tau - Beach Resort',
                address: '741 Ha Long Street, Vung Tau City, Ba Ria Vung Tau Province',
                latitude: new Decimal('10.3460'),
                longitude: new Decimal('107.0840'),
                status: 'active',
            },
        }),
        prisma.swappingStation.create({
            data: {
                name: 'EV Station My Tho - Mekong Delta',
                address: '159 Ap Bac Street, My Tho City, Tien Giang Province',
                latitude: new Decimal('10.3600'),
                longitude: new Decimal('106.3600'),
                status: 'active',
            },
        }),
    ]);

    // 3. Seed Vehicles (same as before)
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
                status: 'inactive',
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

    // 4. Seed Batteries - Phân bổ cho nhiều stations
    console.log('🔋 Seeding batteries...');
    type BatteryType = Awaited<ReturnType<typeof prisma.battery.create>>;
    const batteries: BatteryType[] = [];

    // Helper function để tạo battery
    const createBattery = async (stationIndex: number, model: string, type: string, count: number, status: 'full' | 'charging' = 'full') => {
        for (let i = 0; i < count; i++) {
            const battery = await prisma.battery.create({
                data: {
                    model,
                    type,
                    capacity: new Decimal(getCapacityByModel(model)),
                    current_charge: new Decimal(status === 'full'
                        ? (Math.random() * 15 + 85).toFixed(2) // 85-100%
                        : (Math.random() * 50 + 30).toFixed(2) // 30-80%
                    ),
                    soh: new Decimal((Math.random() * 20 + 75).toFixed(2)), // 75-95%
                    status,
                    station_id: stations[stationIndex].station_id,
                },
            });
            batteries.push(battery);
        }
    };

    // Helper function capacity by model
    const getCapacityByModel = (model: string): string => {
        switch (model) {
            case 'Tesla Model S Battery': return '75.50';
            case 'Tesla Model 3 Battery': return '54.00';
            case 'BYD Blade Battery': return '60.00';
            case 'CATL NCM Battery': return '65.00';
            case 'VinFast VF8 Battery': return '87.70';
            default: return '60.00';
        }
    };

    // Station 0: District 1 - Mix batteries for all vehicle types
    await createBattery(0, 'Tesla Model S Battery', 'Lithium-Ion', 4, 'full');
    await createBattery(0, 'BYD Blade Battery', 'LiFePO4', 3, 'full');
    await createBattery(0, 'CATL NCM Battery', 'Lithium-Ion', 3, 'full');
    await createBattery(0, 'Tesla Model 3 Battery', 'Lithium-Ion', 2, 'full');
    await createBattery(0, 'VinFast VF8 Battery', 'NCM', 2, 'charging'); // Some charging

    // Station 1: District 3 - Focus on Tesla and CATL
    await createBattery(1, 'Tesla Model S Battery', 'Lithium-Ion', 3, 'full');
    await createBattery(1, 'Tesla Model 3 Battery', 'Lithium-Ion', 4, 'full');
    await createBattery(1, 'CATL NCM Battery', 'Lithium-Ion', 3, 'full');
    await createBattery(1, 'BYD Blade Battery', 'LiFePO4', 2, 'charging');

    // Station 2: Thu Duc - Large station with all types
    await createBattery(2, 'Tesla Model S Battery', 'Lithium-Ion', 5, 'full');
    await createBattery(2, 'Tesla Model 3 Battery', 'Lithium-Ion', 4, 'full');
    await createBattery(2, 'BYD Blade Battery', 'LiFePO4', 4, 'full');
    await createBattery(2, 'CATL NCM Battery', 'Lithium-Ion', 3, 'full');
    await createBattery(2, 'VinFast VF8 Battery', 'NCM', 4, 'full');

    // Station 3: District 7 - Good mix
    await createBattery(3, 'Tesla Model S Battery', 'Lithium-Ion', 3, 'full');
    await createBattery(3, 'Tesla Model 3 Battery', 'Lithium-Ion', 3, 'full');
    await createBattery(3, 'CATL NCM Battery', 'Lithium-Ion', 4, 'full');
    await createBattery(3, 'VinFast VF8 Battery', 'NCM', 3, 'full');
    await createBattery(3, 'BYD Blade Battery', 'LiFePO4', 2, 'charging');

    // Station 4: Binh Thanh - Smaller station
    await createBattery(4, 'Tesla Model 3 Battery', 'Lithium-Ion', 3, 'full');
    await createBattery(4, 'CATL NCM Battery', 'Lithium-Ion', 3, 'full');
    await createBattery(4, 'VinFast VF8 Battery', 'NCM', 2, 'full');
    await createBattery(4, 'Tesla Model S Battery', 'Lithium-Ion', 2, 'charging');

    // Station 5: Tan Binh Airport - Large capacity
    await createBattery(5, 'Tesla Model S Battery', 'Lithium-Ion', 6, 'full');
    await createBattery(5, 'Tesla Model 3 Battery', 'Lithium-Ion', 5, 'full');
    await createBattery(5, 'BYD Blade Battery', 'LiFePO4', 4, 'full');
    await createBattery(5, 'CATL NCM Battery', 'Lithium-Ion', 5, 'full');
    await createBattery(5, 'VinFast VF8 Battery', 'NCM', 5, 'full');

    // Station 6-12: Outer stations với ít battery hơn
    for (let i = 6; i <= 12; i++) {
        await createBattery(i, 'Tesla Model S Battery', 'Lithium-Ion', 2, 'full');
        await createBattery(i, 'Tesla Model 3 Battery', 'Lithium-Ion', 2, 'full');
        await createBattery(i, 'CATL NCM Battery', 'Lithium-Ion', 1, 'full');
        await createBattery(i, 'VinFast VF8 Battery', 'NCM', 1, 'full');

        if (Math.random() > 0.5) { // 50% chance có BYD
            await createBattery(i, 'BYD Blade Battery', 'LiFePO4', 1, 'full');
        }
    }

    // Station 13-17: Far stations với limited batteries
    for (let i = 13; i <= 17; i++) {
        await createBattery(i, 'Tesla Model S Battery', 'Lithium-Ion', 1, 'full');
        await createBattery(i, 'Tesla Model 3 Battery', 'Lithium-Ion', 1, 'full');

        if (i % 2 === 0) { // Every other station
            await createBattery(i, 'CATL NCM Battery', 'Lithium-Ion', 1, 'full');
        }
        if (i % 3 === 0) { // Every third station  
            await createBattery(i, 'VinFast VF8 Battery', 'NCM', 1, 'full');
        }
    }

    console.log('✅ Database seeding completed!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${stations.length} swapping stations`);
    console.log(`Created ${batteries.length} batteries`);
    console.log(`Created ${vehicles.length} vehicles`);

    console.log('\n📊 Station Distribution:');
    console.log('🏙️ Inner City Stations (0-15km): 5 stations');
    console.log('🏘️ Outer City Stations (15-30km): 8 stations');
    console.log('🌄 Provincial Stations (30km+): 5 stations');
    console.log('⚠️ Maintenance/Inactive: 2 stations');
    console.log('\n✅ All capacity fields removed from stations!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });