import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import axios from 'axios';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51Oml5cGAwoXiNtjJgPPyQngDj9WTjawya4zCsqTn3LPFhl4VvLZZJIh9fW9wqVweFYC5f0YEb9zjUqRpXbkEKT7T00eU1xQvjp')

const Stripe = ({ price, orderId }) => {
    const [clientSecret, setClientSecret] = useState('')

    const apperance = { theme: 'stripe' }

    const options = { apperance, clientSecret }

    const create_payment = async () => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order/create-payment`, { price }, { withCredentials: true })
            setClientSecret(data.clientSecret)
        }
        catch (error) { }
    }

    return (
        clientSecret
            ? <Elements options={options} stripe={stripePromise}>
                <CheckoutForm orderId={orderId} />
            </Elements>
            : <button onClick={create_payment} className='w-full sm:w-auto px-10 py-[6px] rounded-sm hover:shadow-green-700/30 hover:shadow-lg bg-green-700 text-white'>Start Payment</button>
    );
};

export default Stripe;