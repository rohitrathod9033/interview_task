import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { store } from '../store';

interface Props {
    editMode?: boolean;
}

export default function OrderFormPage({ editMode = false }: Props) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState({
        clientName: '',
        eventDate: '',
        eventType: '',
        venue: '',
        totalAmount: '',
        advanceAmount: '', // Only used in creation
        notes: ''
    });

    const [loading, setLoading] = useState(editMode);

    useEffect(() => {
        if (editMode && id) {
            loadOrder(id);
        }
    }, [editMode, id]);

    const loadOrder = async (orderId: string) => {
        try {
            setLoading(true);
            const orders = await store.getOrders();
            const order = orders.find(o => String(o.id) === String(orderId));
            if (order) {
                setFormData({
                    clientName: order.clientName,
                    eventDate: order.eventDate.split('T')[0],
                    eventType: order.eventType,
                    venue: order.venue,
                    totalAmount: order.totalAmount.toString(),
                    advanceAmount: '',
                    notes: order.notes || ''
                });
            } else {
                navigate('/orders');
            }
        } catch (e) {
            console.error(e);
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const orderData: any = {
            clientName: formData.clientName,
            eventDate: new Date(formData.eventDate).toISOString(),
            eventType: formData.eventType,
            venue: formData.venue,
            totalAmount: Number(formData.totalAmount),
            notes: formData.notes
        };

        if (editMode && id) {
            orderData.id = id;
        }

        const savedOrder = await store.saveOrder(orderData);

        if (!editMode && savedOrder && formData.advanceAmount && Number(formData.advanceAmount) > 0) {
            const paymentData: any = {
                orderId: savedOrder.id,
                amount: Number(formData.advanceAmount),
                date: new Date().toISOString()
            };
            await store.savePayment(paymentData);
        }

        setLoading(false);
        navigate('/orders');
    };

    if (loading && editMode) {
        return <div className="text-center mt-12 text-gray-500">Loading order details...</div>;
    }

    const inputClass = "w-full bg-white border border-gray-300 rounded px-4 py-2 text-black focus:border-blue-500 focus:outline-none";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="max-w-4xl mx-auto text-black">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    &larr; Back
                </button>
                <h1 className="text-2xl font-bold tracking-tight border-l pl-4 border-gray-300">{editMode ? 'Edit Order' : 'Create New Order'}</h1>
            </div>

            <div className="bg-white border border-gray-200 rounded p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Client Name</label>
                            <input
                                type="text"
                                name="clientName"
                                className={inputClass}
                                value={formData.clientName}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Event Date</label>
                            <input
                                type="date"
                                name="eventDate"
                                className={inputClass}
                                value={formData.eventDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Event Type</label>
                            <select
                                name="eventType"
                                className={inputClass}
                                value={formData.eventType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Type...</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Birthday">Birthday</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Anniversary">Anniversary</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Venue</label>
                            <input
                                type="text"
                                name="venue"
                                className={inputClass}
                                value={formData.venue}
                                onChange={handleChange}
                                required
                                placeholder="Grand Hotel"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Total Amount (₹)</label>
                            <input
                                type="number"
                                name="totalAmount"
                                className={inputClass}
                                min="0"
                                step="0.01"
                                value={formData.totalAmount}
                                onChange={handleChange}
                                required
                                placeholder="5000"
                            />
                        </div>

                        {!editMode && (
                            <div>
                                <label className={labelClass}>Advance Paid (₹) <span className="text-gray-500 font-normal">- Optional</span></label>
                                <input
                                    type="number"
                                    name="advanceAmount"
                                    className={inputClass}
                                    min="0"
                                    step="0.01"
                                    max={formData.totalAmount || undefined}
                                    value={formData.advanceAmount}
                                    onChange={handleChange}
                                    placeholder="1000"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <label className={labelClass}>Notes <span className="text-gray-500 font-normal">(Optional)</span></label>
                        <textarea
                            name="notes"
                            className={`${inputClass} min-h-[120px] resize-y py-2`}
                            rows={4}
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Any specific requirements or details..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            onClick={() => navigate('/orders')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded font-medium bg-blue-600 text-white disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (editMode ? 'Save Changes' : 'Create Order')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
