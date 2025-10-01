// prisma/clear-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
    console.log('🗑️  Starting database cleanup...');

    try {
        // Xóa theo thứ tự foreign key dependencies (child → parent)
        console.log('Deleting reservations...');
        await prisma.reservation.deleteMany();
        
        console.log('Deleting batteries...');
        await prisma.battery.deleteMany();
        
        console.log('Deleting vehicles...');
        await prisma.vehicle.deleteMany();
        
        console.log('Deleting battery service packages...');
        await prisma.batteryServicePackage.deleteMany();
        
        console.log('Deleting swapping stations...');
        await prisma.station.deleteMany();
        
        console.log('Deleting users...');
        await prisma.user.deleteMany();

        console.log('✅ Database cleared successfully!');
        
        // Kiểm tra kết quả
        const counts = {
            users: await prisma.user.count(),
            vehicles: await prisma.vehicle.count(),
            stations: await prisma.station.count(),
            batteries: await prisma.battery.count(),
            packages: await prisma.batteryServicePackage.count(),
            reservations: await prisma.reservation.count()
        };
        
        console.log('📊 Current counts:', counts);
        
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
        console.log('📝 Database connection closed');
    }
}

clearDatabase();