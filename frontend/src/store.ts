import type { Order, PaymentEntry } from './types';

// Use env variable or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Transform MongoDB _id to id for the frontend
const transformId = (item: Record<string, unknown> & { _id?: unknown; id?: string }) => {
    if (item._id) {
        item.id = String(item._id);
    }
    return item as any;
};

export const store = {
    getOrders: async (): Promise<Order[]> => {
        try {
            const res = await fetch(`${API_URL}/orders`);
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();
            return data.map(transformId);
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    saveOrder: async (order: Order | Omit<Order, 'id'>): Promise<Order | null> => {
        try {
            const isUpdate = 'id' in order && !!order.id && !order.id.includes('_adv') && order.id.length === 24; // Check if it's a valid mongo ID for update

            const url = isUpdate ? `${API_URL}/orders/${(order as Order).id}` : `${API_URL}/orders`;
            const method = isUpdate ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });

            if (!res.ok) throw new Error('Failed to save order');
            const data = await res.json();
            return transformId(data);
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    deleteOrder: async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
            return res.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    getPayments: async (): Promise<PaymentEntry[]> => {
        try {
            const res = await fetch(`${API_URL}/payments`);
            if (!res.ok) throw new Error('Failed to fetch payments');
            const data = await res.json();
            return data.map(transformId);
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getPaymentsForOrder: async (orderId: string): Promise<PaymentEntry[]> => {
        try {
            const res = await fetch(`${API_URL}/payments/order/${orderId}`);
            if (!res.ok) throw new Error('Failed to fetch payments for order');
            const data = await res.json();
            return data.map(transformId);
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    savePayment: async (payment: PaymentEntry | Omit<PaymentEntry, 'id'>): Promise<PaymentEntry | null> => {
        try {
            const res = await fetch(`${API_URL}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payment)
            });

            if (!res.ok) throw new Error('Failed to save payment');
            const data = await res.json();
            return transformId(data);
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};
