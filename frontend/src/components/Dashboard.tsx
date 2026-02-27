import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DashboardStats {
    totalOrders: number;
    todayOrders: number;
    tomorrowOrders: number;
    totalRevenue: number;
    pendingPayment: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        todayOrders: 0,
        tomorrowOrders: 0,
        totalRevenue: 0,
        pendingPayment: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const ordersRes = await fetch(`${API_URL}/orders`);
            const orders = await ordersRes.json();

            const paymentsRes = await fetch(`${API_URL}/payments`);
            const payments = await paymentsRes.json();

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const dayAfter = new Date(tomorrow);
            dayAfter.setDate(dayAfter.getDate() + 1);

            let todayCount = 0;
            let tomorrowCount = 0;
            let totalRev = 0;

            orders.forEach((order: any) => {
                const eventDate = new Date(order.eventDate);
                if (eventDate >= today && eventDate < tomorrow) {
                    todayCount++;
                } else if (eventDate >= tomorrow && eventDate < dayAfter) {
                    tomorrowCount++;
                }
                totalRev += Number(order.totalAmount);
            });

            let totalPaid = 0;
            payments.forEach((payment: any) => {
                totalPaid += Number(payment.amount);
            });

            setStats({
                totalOrders: orders.length,
                todayOrders: todayCount,
                tomorrowOrders: tomorrowCount,
                totalRevenue: totalRev,
                pendingPayment: Math.max(0, totalRev - totalPaid),
            });

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-black">Loading dashboard...</div>;
    }

    const statCards = [
        { title: 'Total Orders', value: stats.totalOrders },
        { title: 'Today\'s Orders', value: stats.todayOrders },
        { title: 'Tomorrow\'s Orders', value: stats.tomorrowOrders },
        { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}` },
        { title: 'Pending Payment', value: `₹${stats.pendingPayment.toLocaleString()}` }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="pb-4 mb-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-black tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Key metrics and status at a glance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div
                        key={idx}
                        className="p-6 bg-white border border-gray-200 rounded text-left"
                    >
                        <div className="text-gray-600 text-sm font-medium mb-2">{stat.title}</div>
                        <div className="text-3xl font-bold text-black">{stat.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}