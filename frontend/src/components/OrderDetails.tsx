import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { store } from '../store';
import type { Order, PaymentEntry } from '../types';

export default function OrderDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [payments, setPayments] = useState<PaymentEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newPaymentAmount, setNewPaymentAmount] = useState('');
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id]);

    const loadData = async (orderId: string) => {
        try {
            setLoading(true);
            const orders = await store.getOrders();
            const foundOrder = orders.find(o => String(o.id) === String(orderId));
            if (!foundOrder) {
                navigate('/orders');
                return;
            }
            setOrder(foundOrder);

            const orderPayments = await store.getPaymentsForOrder(orderId);
            setPayments(orderPayments);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-12 text-gray-500">Loading order details...</div>;
    if (!order) return <div className="text-center mt-12 text-red-600">Order not found.</div>;

    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const remainingAmount = Number(order.totalAmount) - totalPaid;
    const isFullyPaid = remainingAmount <= 0;

    const handleAddPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPaymentAmount || Number(newPaymentAmount) <= 0) return;

        if (Number(newPaymentAmount) > remainingAmount) {
            alert("Payment amount cannot exceed the remaining balance.");
            return;
        }

        setIsSubmittingPayment(true);

        const paymentData: Omit<PaymentEntry, 'id'> = {
            orderId: order.id,
            amount: Number(newPaymentAmount),
            date: new Date().toISOString()
        };

        await store.savePayment(paymentData);
        await loadData(order.id);

        setShowPaymentModal(false);
        setNewPaymentAmount('');
        setIsSubmittingPayment(false);
    };

    const getStatusBadge = () => {
        if (isFullyPaid) return <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-200 text-sm font-semibold rounded">Fully Paid</span>;
        if (totalPaid > 0) return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 text-sm font-semibold rounded">Partially Paid</span>;
        return <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-200 text-sm font-semibold rounded">Unpaid</span>;
    };

    const labelClass = "text-sm font-medium text-gray-500 mb-1 block";
    const valueClass = "text-lg font-medium text-black";

    return (
        <div className="max-w-6xl mx-auto text-black">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        &larr; Back to Orders
                    </button>
                    <h1 className="text-2xl font-bold tracking-tight border-l pl-4 border-gray-300">Order #{order.id.slice(-6).toUpperCase()}</h1>
                </div>
                <div>
                    <Link
                        to={`/orders/${order.id}/edit`}
                        className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-black font-medium rounded"
                    >
                        Edit Order
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column - Order Info & History */}
                <div className="lg:col-span-2 flex flex-col gap-8">

                    <div className="bg-white border border-gray-200 rounded p-6">
                        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-black">Event Information</h2>
                            {getStatusBadge()}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <p className={labelClass}>Client Name</p>
                                <p className={valueClass}>{order.clientName}</p>
                            </div>
                            <div>
                                <p className={labelClass}>Event Date</p>
                                <p className={valueClass}>{new Date(order.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div>
                                <p className={labelClass}>Event Type</p>
                                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium border border-gray-200 mt-1">
                                    {order.eventType}
                                </div>
                            </div>
                            <div>
                                <p className={labelClass}>Venue</p>
                                <p className={valueClass}>{order.venue}</p>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className={labelClass}>Notes</p>
                                <p className="text-gray-800 bg-gray-50 p-4 rounded border border-gray-200 mt-2 whitespace-pre-wrap">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Payment History Table */}
                    <div className="bg-white border border-gray-200 rounded p-6">
                        <h2 className="text-lg font-bold mb-4 text-black">
                            Payment History
                        </h2>

                        {payments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded border border-gray-200 border-dashed">
                                No payments recorded yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded border border-gray-200">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm">Date</th>
                                            <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm">Transaction ID</th>
                                            <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(payment => (
                                            <tr key={payment.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="p-3 text-gray-800">{new Date(payment.date).toLocaleString()}</td>
                                                <td className="p-3 font-mono text-sm text-gray-500">{payment.id.slice(-8)}</td>
                                                <td className="p-3 text-right font-semibold text-green-700">
                                                    + ₹{Number(payment.amount).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Payment Summary & Action */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded p-6 sticky top-8">
                        <h2 className="text-lg font-bold mb-6 text-black border-b border-gray-100 pb-2">Payment Summary</h2>

                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex justify-between items-center text-gray-600">
                                <span>Total Amount</span>
                                <span className="text-xl font-bold text-black">₹{Number(order.totalAmount).toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center text-gray-600">
                                <span>Total Paid</span>
                                <span className="text-xl font-bold text-green-700">₹{totalPaid.toLocaleString()}</span>
                            </div>

                            <hr className="border-gray-200 my-2" />

                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">Remaining</span>
                                <span className={`text-2xl font-bold ${remainingAmount > 0 ? 'text-red-600' : 'text-black'}`}>
                                    ₹{remainingAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {!isFullyPaid ? (
                            <button
                                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded flex items-center justify-center gap-2"
                                onClick={() => setShowPaymentModal(true)}
                            >
                                Record Payment
                            </button>
                        ) : (
                            <div className="text-center p-3 bg-green-50 text-green-800 border border-green-200 rounded font-semibold flex items-center justify-center gap-2">
                                Order fully paid
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4" onClick={() => !isSubmittingPayment && setShowPaymentModal(false)}>
                    <div className="bg-white border border-gray-200 rounded w-full max-w-md shadow-xl p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-black">Record Payment</h2>
                            <button
                                className="text-gray-500 hover:text-black font-bold"
                                onClick={() => !isSubmittingPayment && setShowPaymentModal(false)}
                            >
                                X
                            </button>
                        </div>

                        <form onSubmit={handleAddPayment}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount (₹)</label>
                                <input
                                    type="number"
                                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-black text-lg focus:border-blue-500 focus:outline-none"
                                    min="0.01"
                                    step="0.01"
                                    max={remainingAmount}
                                    value={newPaymentAmount}
                                    onChange={(e) => setNewPaymentAmount(e.target.value)}
                                    required
                                    autoFocus
                                    disabled={isSubmittingPayment}
                                    placeholder="0.00"
                                />
                                <div className="mt-2 flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Maximum allowed:</span>
                                    <span className="font-semibold text-black">₹{remainingAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    onClick={() => setShowPaymentModal(false)}
                                    disabled={isSubmittingPayment}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-2 px-4 rounded font-medium bg-blue-600 text-white disabled:opacity-50 flex items-center justify-center gap-2"
                                    disabled={isSubmittingPayment}
                                >
                                    {isSubmittingPayment ? 'Processing...' : 'Confirm Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
