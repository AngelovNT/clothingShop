import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(`${process.env.PUBLISHABLE_KEY}`); // Replace with your actual Stripe publishable key

interface CheckoutFormProps {
  amount: number;
  orderId: string;
  setPaymentStatus: (status: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, orderId, setPaymentStatus }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      setError('Stripe has not been initialized.');
      return;
    }
    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('CardElement is not available.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/stripe/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'usd', orderId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await response.json();

      setPaymentStatus('Awaiting Confirmation');
      cardElement.update({ disabled: true });

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        setPaymentStatus('Paid');

        // Update the order payment status in the backend
        const updateResponse = await fetch('http://localhost:5000/orders/' + orderId + '/status', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentStatus: 'paid' }),
        });

        if (!updateResponse.ok) {
          setError('Failed to update order payment status');
        }
      } else {
        setPaymentStatus('Awaiting Confirmation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`bg-blue-500 text-white px-4 py-2 rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : `Pay ${amount} USD`}
      </button>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </form>
  );
};

const StripeCheckout: React.FC<{ amount: number; orderId: string }> = ({ amount, orderId }) => {
  const [paymentStatus, setPaymentStatus] = useState('unpaid');

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} orderId={orderId} setPaymentStatus={setPaymentStatus} />
      {paymentStatus === 'Awaiting Confirmation' && <p>Awaiting confirmation from payment provider...</p>}
      {paymentStatus === 'Paid' && <p>Payment confirmed!</p>}
    </Elements>
  );
};

export default StripeCheckout;
