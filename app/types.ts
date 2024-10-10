export interface Receipt {
    _id: string;
    clientName: string;
    amount: number;
    isPaid: boolean;
    createdAt: string; // Assuming you have timestamps
    updatedAt: string; // If you need to track updates
    paymentIntentId?: string; // Optional, in case of payment intent
    status?: string; // Status for payments, e.g., 'authorized'
  }

 export interface Product {
  id: string;
  name: string;
}
