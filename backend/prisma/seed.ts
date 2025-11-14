//battery sẽ có status như sau:
//nếu current_charge = 100% thì status = 'full', ngược lại nếu current_charge < 100% thì status = 'charging' nếu pin ở trong trạm
//nếu pin được đặt lịch sẽ là 'booked', neu611 pin nằm trong xe thì status = 'in_use'
//chỉ có 1 model và type pin duy nhất, không tách pin trong xe và pin trong trạm ra

import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Clean database
    await prisma.support.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.reservation.deleteMany();
    await prisma.swapTransaction.deleteMany();
    await prisma.batteriesTransfer.deleteMany();
    await prisma.batteryTransferTicket.deleteMany();
    await prisma.batteryTransferRequest.deleteMany();
    await prisma.battery.deleteMany();
    await prisma.slot.deleteMany();
    await prisma.cabinet.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.config.deleteMany();
    await prisma.batteryServicePackage.deleteMany();
    await prisma.user.deleteMany();
    await prisma.station.deleteMany();

    // 1. Create Stations
    const station1 = await prisma.station.create({
        data: {
            name: 'Station Hà Nội',
            address: '123 Đường Lê Lợi, Hà Nội',
            latitude: new Prisma.Decimal('21.0285'),
            longitude: new Prisma.Decimal('105.8542'),
            status: 'active',
        },
    });

    const station2 = await prisma.station.create({
        data: {
            name: 'Station TP.HCM',
            address: '456 Đường Nguyễn Huệ, TP.HCM',
            latitude: new Prisma.Decimal('10.7769'),
            longitude: new Prisma.Decimal('106.7009'),
            status: 'active',
        },
    });

    // 2. Create Users
    const adminUser = await prisma.user.create({
        data: {
            username: 'admin',
            password: 'hashed_password_123',
            phone: '0901000001',
            email: 'admin@evswap.com',
            role: 'admin',
            email_verified: true,
        },
    });

    const staffUser = await prisma.user.create({
        data: {
            username: 'staff_hanoi',
            password: 'hashed_password_456',
            phone: '0901000002',
            email: 'staff@station1.com',
            role: 'station_staff',
            station_id: station1.station_id,
            email_verified: true,
        },
    });

    const driverUser1 = await prisma.user.create({
        data: {
            username: 'driver_john',
            password: 'hashed_password_789',
            phone: '0901000003',
            email: 'john.driver@example.com',
            role: 'driver',
            email_verified: true,
        },
    });

    const driverUser2 = await prisma.user.create({
        data: {
            username: 'driver_jane',
            password: 'hashed_password_101',
            phone: '0901000004',
            email: 'jane.driver@example.com',
            role: 'driver',
            email_verified: true,
        },
    });

    // 3. Create Battery Service Packages
    const packageBasic = await prisma.batteryServicePackage.create({
        data: {
            name: 'Basic Plan',
            battery_count: 1,
            base_distance: 500,
            base_price: new Prisma.Decimal('500000'),
            swap_count: 20,
            penalty_fee: 100000,
            duration_days: 30,
            description: 'Gói cơ bản cho người mới',
            active: true,
        },
    });

    const packagePremium = await prisma.batteryServicePackage.create({
        data: {
            name: 'Premium Plan',
            battery_count: 2,
            base_distance: 1000,
            base_price: new Prisma.Decimal('1000000'),
            swap_count: 50,
            penalty_fee: 50000,
            duration_days: 30,
            description: 'Gói cao cấp với nhiều quyền lợi',
            active: true,
        },
    });

    // 4. Create Config
    await prisma.config.create({
        data: {
            type: 'deposit',
            name: 'battery_deposit',
            value: new Prisma.Decimal('500000'),
            description: 'Tiền cọc pin',
            is_active: true,
        },
    });

    await prisma.config.create({
        data: {
            type: 'penalty',
            name: 'late_return_fee',
            value: new Prisma.Decimal('100000'),
            description: 'Phí trả pin muộn',
            is_active: true,
        },
    });

    // 5. Create Vehicles
    const vehicle1 = await prisma.vehicle.create({
        data: {
            user_id: driverUser1.user_id,
            vin: 'WVWZZZ3CZ9E123456',
            battery_model: 'BYD Blade',
            battery_type: 'LFP',
            status: 'active',
        },
    });

    const vehicle2 = await prisma.vehicle.create({
        data: {
            user_id: driverUser2.user_id,
            vin: 'WVWZZZ3CZ9E654321',
            battery_model: 'CATL',
            battery_type: 'NCM',
            status: 'active',
        },
    });

    // 6. Create Cabinets
    const cabinet1 = await prisma.cabinet.create({
        data: {
            station_id: station1.station_id,
            cabinet_name: 'Cabinet A1',
            total_slots: 6,
            status: 'active',
        },
    });

    const cabinet2 = await prisma.cabinet.create({
        data: {
            station_id: station1.station_id,
            cabinet_name: 'Cabinet A2',
            total_slots: 6,
            status: 'active',
        },
    });

    // 7. Create Slots
    const slot1 = await prisma.slot.create({
        data: {
            cabinet_id: cabinet1.cabinet_id,
            slot_number: 1,
            is_occupied: false,
        },
    });

    const slot2 = await prisma.slot.create({
        data: {
            cabinet_id: cabinet1.cabinet_id,
            slot_number: 2,
            is_occupied: true,
        },
    });

    const slot3 = await prisma.slot.create({
        data: {
            cabinet_id: cabinet2.cabinet_id,
            slot_number: 1,
            is_occupied: false,
        },
    });

    // 8. Create Batteries
    // Status logic: full (100%), charging (<100% in station), booked (reserved), in_use (in vehicle)
    const battery1 = await prisma.battery.create({
        data: {
            station_id: station1.station_id,
            cabinet_id: cabinet1.cabinet_id,
            slot_id: slot2.slot_id,
            serial_number: 'BAT-2025-001',
            model: 'BYD Blade',
            type: 'LFP',
            capacity: new Prisma.Decimal('50'),
            current_charge: new Prisma.Decimal('100'),
            soh: new Prisma.Decimal('98'),
            status: 'full',
        },
    });

    const battery2 = await prisma.battery.create({
        data: {
            station_id: station1.station_id,
            cabinet_id: cabinet1.cabinet_id,
            serial_number: 'BAT-2025-002',
            model: 'CATL',
            type: 'NCM',
            capacity: new Prisma.Decimal('60'),
            current_charge: new Prisma.Decimal('75'),
            soh: new Prisma.Decimal('95'),
            status: 'charging',
        },
    });

    const battery3 = await prisma.battery.create({
        data: {
            vehicle_id: vehicle1.vehicle_id,
            serial_number: 'BAT-2025-003',
            model: 'BYD Blade',
            type: 'LFP',
            capacity: new Prisma.Decimal('50'),
            current_charge: new Prisma.Decimal('45'),
            soh: new Prisma.Decimal('92'),
            status: 'in_use',
        },
    });

    const battery4 = await prisma.battery.create({
        data: {
            station_id: station1.station_id,
            serial_number: 'BAT-2025-004',
            model: 'BYD Blade',
            type: 'LFP',
            capacity: new Prisma.Decimal('50'),
            current_charge: new Prisma.Decimal('50'),
            soh: new Prisma.Decimal('90'),
            status: 'booked',
        },
    });

    // Update vehicle with battery
    await prisma.vehicle.update({
        where: { vehicle_id: vehicle1.vehicle_id },
        data: { battery_id: battery3.battery_id },
    });

    // 9. Create Subscriptions
    const subscription1 = await prisma.subscription.create({
        data: {
            user_id: driverUser1.user_id,
            package_id: packageBasic.package_id,
            vehicle_id: vehicle1.vehicle_id,
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'active',
            swap_used: 5,
            deposit_paid: true,
            distance_traveled: 250,
        },
    });

    const subscription2 = await prisma.subscription.create({
        data: {
            user_id: driverUser2.user_id,
            package_id: packagePremium.package_id,
            vehicle_id: vehicle2.vehicle_id,
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'active',
            swap_used: 10,
            deposit_paid: true,
            distance_traveled: 500,
        },
    });

    // 10. Create Payments
    await prisma.payment.create({
        data: {
            user_id: driverUser1.user_id,
            amount: new Prisma.Decimal('500000'),
            method: 'vnpay',
            status: 'paid',
            payment_type: 'subscription',
            subscription_id: subscription1.subscription_id,
            vehicle_id: vehicle1.vehicle_id,
            created_at: new Date(),
        },
    });

    // 11. Create Reservations
    const reservation1 = await prisma.reservation.create({
        data: {
            user_id: driverUser1.user_id,
            vehicle_id: vehicle1.vehicle_id,
            battery_id: battery1.battery_id,
            station_id: station1.station_id,
            scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000),
            status: 'scheduled',
        },
    });

    // 12. Create Swap Transactions
    const swapTransaction1 = await prisma.swapTransaction.create({
        data: {
            user_id: driverUser1.user_id,
            vehicle_id: vehicle1.vehicle_id,
            station_id: station1.station_id,
            cabinet_id: cabinet1.cabinet_id,
            battery_taken_id: battery1.battery_id,
            battery_returned_id: battery3.battery_id,
            status: 'completed',
            subscription_id: subscription1.subscription_id,
        },
    });

    // 13. Create Support Tickets
    await prisma.support.create({
        data: {
            user_id: driverUser1.user_id,
            station_id: station1.station_id,
            type: 'battery_issue',
            description: 'Pin sạc không đầy',
            status: 'open',
        },
    });

    console.log('✅ Seed completed successfully!');
    console.log(`📊 Created:`);
    console.log(`  - 2 Stations`);
    console.log(`  - 4 Users (1 admin, 1 staff, 2 drivers)`);
    console.log(`  - 2 Service Packages`);
    console.log(`  - 2 Vehicles`);
    console.log(`  - 2 Cabinets with 3 Slots`);
    console.log(`  - 4 Batteries`);
    console.log(`  - 2 Subscriptions`);
    console.log(`  - 1 Swap Transaction`);
    console.log(`  - 1 Support Ticket`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });