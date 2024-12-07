import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_cart_products, get_wishlist_products } from '../store/reducers/cartReducer';
import { MdEmail } from "react-icons/md";
import { IoMdPhonePortrait, IoMdArrowDropdown, IoIosArrowDown } from "react-icons/io";
import { FaFacebookF, FaList, FaLock, FaUser, FaLinkedin, FaGithub, FaPhoneAlt, FaSearch } from "react-icons/fa";
import { FaHeart, FaTwitter, FaCartShopping } from "react-icons/fa6";

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { categories } = useSelector(state => state.home)
    const { userInfo } = useSelector(state => state.auth)
    const { cart_product_count, wishlist_count } = useSelector(state => state.cart)

    const { pathname } = useLocation()

    const [showShidebar, setShowShidebar] = useState(true);
    const [categoryShow, setCategoryShow] = useState(true);

    const [searchValue, setSearchValue] = useState('')
    const [category, setCategory] = useState('')

    const search = () => {
        navigate(`/products/search?category=${category}&&value=${searchValue}`)
    }

    const redirect_cart_page = () => {
        if (userInfo) {
            navigate('/cart')
        } else {
            navigate('/login')
        }
    }

    useEffect(() => {
        if (userInfo) {
            dispatch(get_cart_products(userInfo.id))
            dispatch(get_wishlist_products(userInfo.id))
        }
    }, [userInfo])

    return (
        <div className='w-full bg-white'>
            <div className='bg-[#caddff] md-lg:hidden'>
                <div className='w-[85%] lg:w-[90%] mx-auto'>
                    <div className='py-4 flex flex-col md:flex-row w-full justify-between items-center text-slate-500'>
                        <ul className='pb-4 md:pb-0 flex justify-start items-center gap-8 font-semibold text-black'>
                            <li className='flex relative justify-center items-center gap-2 text-sm after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]'>
                                <span><MdEmail /></span>
                                <span>support@gmail.com</span>
                            </li>

                            <li className='flex relative justify-center items-center gap-2 text-sm '>
                                <span><IoMdPhonePortrait /></span>
                                <span>+(123) 3243 343</span>
                            </li>
                        </ul>

                        <div>
                            <div className='flex justify-center items-center gap-10'>
                                <div className='flex justify-center items-center gap-4 text-black'>
                                    <a href="#"><FaFacebookF /></a>
                                    <a href="#"><FaTwitter /> </a>
                                    <a href="#"><FaLinkedin /></a>
                                    <a href="#"><FaGithub /> </a>
                                </div>
                                <div className='flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] after:absolute before:absolute before:h-[18px] before:bg-[#afafaf] before:w-[1px] before:-left-[20px]'>
                                    <img src="/images/language.png" alt="" />
                                    <span><IoMdArrowDropdown /></span>
                                    <ul className='absolute invisible transition-all top-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10'>
                                        <li>Hindi</li>
                                        <li>English</li>
                                    </ul>
                                </div>

                                {userInfo
                                    ? <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-black' to='/dashboard'>
                                        <span> <FaUser /> </span>
                                        <span> {userInfo.name} </span>
                                    </Link>
                                    : <Link to='/login' className='flex cursor-pointer justify-center items-center gap-2 text-sm text-black'>
                                        <span> <FaLock /> </span>
                                        <span>Login </span>
                                    </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-white'>
                <div className='px-4 lg:px-0 w-full lg:w-[90%] mx-auto'>
                    <div className='flex md:gap-4 flex-col md:flex-row justify-between items-center flex-wrap'>
                        <div className='w-auto'>
                            <div className='flex justify-between items-center'>
                                <Link to='/' className='w-auto h-[70px] object-contain'>
                                    <img src="/images/logo.png" alt="" className='w-full h-full' />
                                </Link>
                                <div className='justify-center items-center w-[30px] h-[30px] bg-white text-slate-600 border border-slate-600 rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden' onClick={() => setShowShidebar(false)}>
                                    <span> <FaList /> </span>
                                </div>
                            </div>
                        </div>

                        <div className='flex-1'>
                            <div className='flex justify-center sm:justify-between md-lg:justify-center items-center flex-wrap'>
                                <ul className='flex justify-start items-start gap-4 md:gap-8 text-sm font-bold uppercase md-lg:hidden'>
                                    <li>
                                        <Link to='/' className={`block ${pathname === '/' ? 'text-[#059473]' : 'text-slate-600'} `}>Home</Link>
                                    </li>
                                    <li>
                                        <Link to='/shops' className={`block ${pathname === '/shops' ? 'text-[#059473]' : 'text-slate-600'} `}>Shop</Link>
                                    </li>
                                    <li>
                                        <Link className={`block ${pathname === '/blog' ? 'text-[#059473]' : 'text-slate-600'} `}>Blog</Link>
                                    </li>
                                    <li>
                                        <Link className={`block ${pathname === '/about' ? 'text-[#059473]' : 'text-slate-600'} `}>About Us</Link>
                                    </li>
                                    <li>
                                        <Link className={`block ${pathname === '/contact' ? 'text-[#059473]' : 'text-slate-600'} `}>Contact Us</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className='pt-4 md:pt-0 flex md-lg:hidden justify-center items-center gap-5'>
                            <div className='flex justify-center gap-5'>
                                <div onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')} className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]'>
                                    <span className='text-xl text-green-500'><FaHeart /></span>
                                    {wishlist_count !== 0 &&
                                        <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] '>
                                            {wishlist_count}
                                        </div>
                                    }
                                </div>

                                <div onClick={redirect_cart_page} className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]'>
                                    <span className='text-xl text-green-500'><FaCartShopping /></span>
                                    {cart_product_count !== 0 &&
                                        <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] '>
                                            {cart_product_count}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='hidden md-lg:block'>
                <div onClick={() => setShowShidebar(true)} className={`fixed duration-200 transition-all ${showShidebar ? 'invisible' : 'visible'} hidden md-lg:block w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20 `} />

                <div className={`w-[300px] z-[9999] transition-all duration-200 fixed ${showShidebar ? '-left-[300px]' : 'left-0 top-0'} overflow-y-auto bg-white h-screen py-6 px-8 `}>
                    <div className='flex justify-start flex-col gap-6'>
                        <Link to='/'>
                            <img src="/images/logo.png" alt="" />
                        </Link>
                        <div className='flex justify-start items-center gap-10'>
                            <div className='flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] after:absolute '>
                                <img src="/images/language.png" alt="" />
                                <span><IoMdArrowDropdown /></span>
                                <ul className='absolute invisible transition-all top-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10'>
                                    <li>Hindi</li>
                                    <li>English</li>
                                </ul>
                            </div>
                            {userInfo
                                ? <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-black' to='/dashboard'>
                                    <span> <FaUser /> </span>
                                    <span>{userInfo.name}</span>
                                </Link>
                                : <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-black' to='/login'>
                                    <span> <FaLock /> </span>
                                    <span>Login </span>
                                </Link>
                            }
                        </div>

                        <ul className='flex flex-col justify-start items-start text-sm font-bold uppercase'>
                            <li>
                                <Link className={`py-2 block ${pathname === '/' ? 'text-[#059473]' : 'text-slate-600'} `}>Home</Link>
                            </li>
                            <li>
                                <Link to='/shops' className={`py-2 block ${pathname === '/shops' ? 'text-[#059473]' : 'text-slate-600'} `}>Shop</Link>
                            </li>
                            <li>
                                <Link className={`py-2 block ${pathname === '/blog' ? 'text-[#059473]' : 'text-slate-600'} `}>Blog</Link>
                            </li>
                            <li>
                                <Link className={`py-2 block ${pathname === '/about' ? 'text-[#059473]' : 'text-slate-600'} `}>About Us</Link>
                            </li>
                            <li>
                                <Link className={`py-2 block ${pathname === '/contact' ? 'text-[#059473]' : 'text-slate-600'} `}>Contact Us</Link>
                            </li>
                        </ul>

                        <div className='flex justify-start items-center gap-4 text-black'>
                            <a href="#"><FaFacebookF /></a>
                            <a href="#"><FaTwitter /></a>
                            <a href="#"><FaLinkedin /></a>
                            <a href="#"><FaGithub /></a>
                        </div>

                        <div className='w-full flex justify-end md-lg:justify-start gap-3 items-center'>
                            <div className='w-[48px] h-[48px] rounded-full flex bg-[#f5f5f5] justify-center items-center '>
                                <span><FaPhoneAlt /></span>
                            </div>
                            <div className='flex justify-end flex-col gap-1'>
                                <h2 className='text-sm font-medium text-slate-700'>+134343455</h2>
                                <span className='text-xs'>Support 24/7</span>
                            </div>
                        </div>

                        <ul className='flex flex-col justify-start items-start gap-3 text-[#1c1c1c]'>
                            <li className='flex justify-start items-center gap-2 text-sm'>
                                <span><MdEmail /></span>
                                <span>support@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='px-4 lg:px-0 pt-4 w-full lg:w-[90%] mx-auto'>
                <div className='flex w-full flex-col md:flex-row gap-4 md:gap-8'>
                    <div className='w-full md:w-1/2'>
                        <div className='bg-white relative'>
                            <div onClick={() => setCategoryShow(!categoryShow)} className='h-[50px] bg-[#059473] text-white flex justify-center md-lg:justify-between md-lg:px-6 items-center gap-3 font-bold text-md cursor-pointer'>
                                <div className='flex justify-center items-center gap-3'>
                                    <span><FaList /></span>
                                    <span>All Category</span>
                                </div>
                                <span className='pt-1'><IoIosArrowDown /></span>
                            </div>

                            <div className={`${categoryShow ? 'h-0' : 'h-[400px]'} overflow-hidden transition-all md-lg:relative duration-500 absolute z-[99999] bg-[#dbf3ed] w-full border-x`}>
                                <ul className='py-2 text-slate-600 font-medium'>
                                    {categories.map((c, i) => {
                                        return (
                                            <li key={i} className='flex justify-start items-center gap-2 px-[24px] py-[6px]'>
                                                <img src={c.image} className='w-[50px] h-[50px] object-contain' alt="" />
                                                <Link to={`/products?category=${c.name}`} className='block'>{c.name}</Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='w-full md:w-1/2'>
                        <div className='flex flex-col md:flex-row flex-wrap w-full justify-between items-center md-lg:gap-6'>
                            <div className='w-full'>
                                <div className='flex border h-[50px] items-center relative gap-6'>
                                    {/* <div className='relative after:absolute after:h-[25px] after:w-[1px] after:bg-[#afafaf] after:-right-[15px] md:hidden'>
                                        <select onChange={(e) => setCategory(e.target.value)} className='w-[100px] text-slate-600 font-semibold bg-transparent px-2 h-full outline-0 border-none' name="" id="">
                                            <option value="">Category</option>
                                            {categories.map((c, i) => <option key={i} value={c.name}> {c.name} </option>)}
                                        </select>
                                    </div> */}
                                    <input className='w-full relative bg-transparent text-slate-500 outline-0 px-3 h-full' onChange={(e) => setSearchValue(e.target.value)} type="text" name='' id='' placeholder='What do you need' />
                                    <button onClick={search} className='bg-[#059473] right-0 absolute px-8 h-full font-semibold uppercase text-white'>
                                        <FaSearch className='sm:hidden' />
                                        <span className='hidden sm:block'>Search</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;