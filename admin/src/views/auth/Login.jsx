import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { seller_login, messageClear } from '../../store/Reducers/authReducer';

const Login = () => {
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const { loader, errorMessage, successMessage, userInfo, role } = useSelector(state => state.auth)

    const [state, setState] = useState({ email: "", password: "" })

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const submit = (e) => {
        e.preventDefault()
        dispatch(seller_login(state))
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage])

    useEffect(() => {
        if (userInfo) {
            if (role === 'admin') navigate('/admin/dashboard')
            else if (role === 'seller') navigate('/seller/dashboard')
        }
    }, [userInfo, role])

    return (
        <div className='min-w-screen min-h-screen bg-[#cdcae9] flex justify-center items-center' >
            <div className='w-[350px] text-[#ffffff] p-2'>
                <div className='bg-[#6f68d1] p-4 rounded-md'>
                    <h2 className='text-xl mb-3 font-bold'>Welcome to Ecommerce</h2>
                    <p className='text-sm mb-3 font-medium'>Please Sign In your account</p>

                    <form onSubmit={submit}>
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor="email">Email</label>
                            <input onChange={inputHandle} value={state.email} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' type="email" name='email' placeholder='Email' id='email' required />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor="password">Password</label>
                            <input onChange={inputHandle} value={state.password} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' type="password" name='password' placeholder='Password' id='password' required />
                        </div>
                        <button disabled={loader ? true : false} className='bg-slate-800 w-full hover:shadow-blue-300/ hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                            {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sign In'}
                        </button>
                        <div className='flex items-center mb-3 gap-3 justify-center'>
                            <p>Don't Have an account ? <Link className='font-bold' to="/register">Sign Up</Link> </p>
                        </div>
                        <div className='w-full flex justify-center items-center mb-3'>
                            <div className='w-[45%] bg-slate-700 h-[1px]'></div>
                            <div className='w-[10%] flex justify-center items-center'>
                                <span className='pb-1'>Or</span>
                            </div>
                            <div className='w-[45%] bg-slate-700 h-[1px] '></div>
                        </div>
                        <div className='flex items-center mb-3 gap-3 justify-center'>
                            <p><Link className='font-bold' to="/admin/login">Login as Admin</Link> </p>
                        </div>
                        {/* <div className='flex justify-center items-center gap-3'>
                            <div className='w-[135px] h-[35px] flex rounded-md bg-orange-700 shadow-lg hover:shadow-orange-700/50 justify-center cursor-pointer items-center overflow-hidden'>
                                <span><FaGoogle /></span>
                            </div>
                            <div className='w-[135px] h-[35px] flex rounded-md bg-blue-700 shadow-lg hover:shadow-blue-700/50 justify-center cursor-pointer items-center overflow-hidden'>
                                <span><FaFacebook /></span>
                            </div>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;