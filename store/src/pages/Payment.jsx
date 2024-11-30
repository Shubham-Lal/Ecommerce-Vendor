// import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './../components/Header';
import Stripe from '../components/Stripe';
import Footer from './../components/Footer';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state) {
            navigate('/');
        }
    }, [location.state, navigate]);

    const { price, items, orderId } = location.state || {};

    // const [paymentMethod, setPaymentMethod] = useState('stripe')

    return (
        <div>
            <Header />

            <section className='bg-[#eeeeee]'>
                <div className='w-[95%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-5 mt-4 '>
                    <div className='flex flex-col-reverse gap-5'>
                        <div className='w-full'>
                            <div>
                                {/* <div className='flex'>
                                    <div onClick={() => setPaymentMethod('stripe')} className={`w-full md:w-[20%] border-r cursor-pointer py-8 px-12 ${paymentMethod === 'stripe' ? 'bg-white' : 'bg-slate-100'} `} >
                                        <div className='w-full flex flex-col gap-[3px] justify-center items-center'>
                                            <img src="/images/payment/stripe.png" className='w-full h-auto' alt="" />
                                        </div>
                                        <span className='text-slate-600'>Stripe</span>
                                    </div>

                                    <div onClick={() => setPaymentMethod('cod')} className={`w-[20%] border-r cursor-pointer py-8 px-12 ${paymentMethod === 'cod' ? 'bg-white' : 'bg-slate-100'} `} >
                                        <div className='flex flex-col gap-[3px] justify-center items-center'>
                                            <img src="/images/payment/cod.jpg" alt="" />
                                        </div>
                                        <span className='text-slate-600'>COD</span>
                                    </div>
                                </div> */}

                                <div>
                                    <Stripe orderId={orderId} price={price} />
                                </div>

                                {/* {paymentMethod === 'cod' &&
                                    <div className='w-full px-4 py-8 bg-white shadow-sm'>
                                        <button className='px-10 py-[6px] rounded-sm hover:shadow-green-500/20 hover:shadow-lg bg-[#059473] text-white'>Pay Now</button>
                                    </div>
                                } */}
                            </div>
                        </div>

                        <div className='w-full'>
                            <div>
                                <div className='bg-white shadow p-5 text-slate-600 flex flex-col gap-3'>
                                    <h2 className='font-bold text-lg'>Order Summary </h2>
                                    <div className='flex justify-between items-center'>
                                        <span>{items} Items and Shipping Fee Included </span>
                                        <span>${price}</span>
                                    </div>
                                    <div className='flex justify-between items-center font-semibold'>
                                        <span>Total Amount </span>
                                        <span className='text-lg text-green-600'>${price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Payment;