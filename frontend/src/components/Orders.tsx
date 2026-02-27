import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../store';
import type { Order, PaymentEntry } from '../types';

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [payments, setPayments] = useState<PaymentEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [fetchedOrders, fetchedPayments] = await Promise.all([
                store.getOrders(),
                store.getPayments()
            ]);
            setOrders(fetchedOrders);
            setPayments(fetchedPayments);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getOrderStatus = (order: Order) => {
        const orderPayments = payments.filter(p => String(p.orderId) === String(order.id));
        const paid = orderPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const remaining = Number(order.totalAmount) - paid;

        // Solid background badges, no opacity styling
        if (remaining <= 0) return <span className="px-2 py-1 bg-green-100 text-green-800 border border-green-200 text-xs rounded-full">Paid</span>;
        if (paid > 0) return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 text-xs rounded-full">Partial ({remaining} left)</span>;
        return <span className="px-2 py-1 bg-red-100 text-red-800 border border-red-200 text-xs rounded-full">Unpaid</span>;
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            await store.deleteOrder(id);
            loadData();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black tracking-tight">Orders</h1>
                <Link
                    to="/orders/new"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium py-2 px-4 rounded"
                >
                    New Order
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        Loading orders...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No orders found. Create your first event order!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-gray-600 font-medium text-sm">Client</th>
                                    <th className="p-4 text-gray-600 font-medium text-sm">Event Date</th>
                                    <th className="p-4 text-gray-600 font-medium text-sm">Type</th>
                                    <th className="p-4 text-gray-600 font-medium text-sm">Amount</th>
                                    <th className="p-4 text-gray-600 font-medium text-sm">Payment Status</th>
                                    <th className="p-4 text-gray-600 font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <td className="p-4 text-black">{order.clientName}</td>
                                        <td className="p-4 text-gray-600">{new Date(order.eventDate).toLocaleDateString()}</td>
                                        <td className="p-4 text-gray-600">{order.eventType}</td>
                                        <td className="p-4 text-black font-semibold">₹{Number(order.totalAmount).toLocaleString()}</td>
                                        <td className="p-4">{getOrderStatus(order)}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/orders/${order.id}`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
