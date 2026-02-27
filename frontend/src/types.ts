export interface Order {
  id: string;
  clientName: string;
  eventDate: string;
  eventType: string;
  venue: string;
  totalAmount: number;
  notes?: string;
}

export interface PaymentEntry {
  id: string;
  orderId: string;
  amount: number;
  date: string;
}
