import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";

const Footer = () => {
    const navigate = useNavigate()
    const { userInfo } = useSelector(state => state.auth)
    const { cart_product_count, wishlist_count } = useSelector(state => state.cart)

    return (
        <footer className='bg-[#f3f6fa]'>
            <div className='w-[95%] lg:w-[90%] flex flex-col lg:flex-row gap-4 mx-auto border-b py-16'>
                <div className='w-full lg:w-3/12'>
                    <div className='flex flex-col gap-3'>
                        <img className='w-[190px] h-[70px]' src="/images/logo.png" alt="logo" />
                        <ul className='flex flex-col gap-2 text-slate-600'>
                            <li>Address:  2504 Ivins Avenue, Egg Harbor Township, NJ 08234,</li>
                            <li>Phone: 4343434344</li>
                            <li>Email: support@easylearingbd.com</li>
                        </ul>
                    </div>
                </div>

                <div className='w-full lg:w-9/12 flex flex-col sm:flex-row justify-between'>
                    <div className='w-full sm:w-1/2'>
                        <div className='flex sm:mt-6 w-full'>
                            <div>
                                <h2 className='font-bold text-lg mb-2'>Usefull Links </h2>
                                <div className='flex justify-between gap-[40px] lg:gap-[60px]'>
                                    <ul className='flex flex-col gap-2 text-slate-600 text-sm font-semibold'>
                                        <li><Link to='/'>About Us</Link></li>
                                        <li><Link to='/'>About Our Shop</Link></li>
                                        <li><Link to='/'>Delivery Information</Link></li>
                                        <li><Link to='/'>Privacy Policy</Link></li>
                                        <li><Link to='/'>Blogs</Link></li>
                                    </ul>

                                    <ul className='flex flex-col gap-2 text-slate-600 text-sm font-semibold'>
                                        <li><Link to='/'>Our Service</Link></li>
                                        <li><Link to='/'>Company Profile</Link></li>
                                        <li><Link to='/'>Delivery Information</Link></li>
                                        <li><Link to='/'>Privacy Policy</Link></li>
                                        <li><Link to='/'>Blogs</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-full sm:w-1/2 mt-6'>
                        <div className='w-full flex flex-col justify-start'>
                            <h2 className='font-bold text-lg mb-2'>Join Our Shop</h2>
                            <span>Get Email updates about tour latest and shop specials offers</span>
                            <div className='mt-2 h-[50px] w-full bg-white border relative'>
                                <input className='h-full bg-transparent w-full px-3 outline-0' type="text" placeholder='Enter Your Email' />
                                <button className='h-full absolute right-0 bg-[#059473] text-white uppercase px-4 font-bold text-sm'>Subscribe</button>
                            </div>
                            <ul className='mt-2 flex justify-start items-center gap-3'>
                                <li>
                                    <a className='w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-white rounded-full' href="#"><FaFacebookF /> </a>
                                </li>
                                <li>
                                    <a className='w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-white rounded-full' href="#"><FaTwitter /> </a>
                                </li>
                                <li>
                                    <a className='w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-white rounded-full' href="#"><FaLinkedin /> </a>
                                </li>
                                <li>
                                    <a className='w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-white rounded-full' href="#"><FaGithub /> </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-[90%] flex flex-wrap justify-center items-center text-slate-600 mx-auto py-5 text-center'>
                <span>Copiright @ 2024 All Rights Reserved </span>
            </div>

            <div className='hidden fixed md-lg:block w-[50px] h-[110px] bottom-3 right-2 bg-white rounded-full p-2'>
                <div className='w-full h-full flex gap-3 flex-col justify-center items-center'>
                    <div onClick={() => navigate(userInfo ? '/cart' : '/login')} className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]'>
                        <span className='text-xl text-green-500'><FaCartShopping /></span>
                        {cart_product_count !== 0 &&
                            <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]'>
                                {cart_product_count}
                            </div>
                        }
                    </div>

                    <div onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')} className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]'>
                        <span className='text-xl text-green-500'><FaHeart /></span>
                        {wishlist_count !== 0 &&
                            <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]'>
                                {wishlist_count}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;