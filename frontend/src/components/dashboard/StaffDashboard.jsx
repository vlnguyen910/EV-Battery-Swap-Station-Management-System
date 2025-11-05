import { useState, useEffect } from 'react';
import { useAuth, useBattery } from '../../hooks/useContext';
import StaffWelcomeHeader from '../staff-dashboard/StaffWelcomeHeader';
import BatteryStatsCards from '../staff-dashboard/BatteryStatsCards';
import TransactionsTable from '../staff-dashboard/TransactionsTable';

export default function StaffDashboard() {
    const { user } = useAuth();
    const { batteries, loading: batteriesLoading } = useBattery();
    const [stats, setStats] = useState({
        fullBatteries: 0,
        chargingBatteries: 0,
        maintenanceBatteries: 0
    });

    useEffect(() => {
        if (batteries && batteries.length > 0) {
            const full = batteries.filter(b => b.status === 'full').length;
            const charging = batteries.filter(b => b.status === 'charging').length;
            const maintenance = batteries.filter(b => b.status === 'maintenance').length;

            setStats({
                fullBatteries: full,
                chargingBatteries: charging,
                maintenanceBatteries: maintenance
            });
        }
    }, [batteries]);

    return (
        <div className="flex-1 p-8">
            <div className="flex flex-col gap-8">
                <StaffWelcomeHeader user={user} />
                <BatteryStatsCards stats={stats} loading={batteriesLoading} />
                <TransactionsTable />
            </div>
        </div>
    );
}
