import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../components/Search';
import { get_seller_request } from '../../store/Reducers/sellerReducer';
import { FaEye } from "react-icons/fa";

const SellerRequest = () => {
    const dispatch = useDispatch()
    const { sellers, totalSeller } = useSelector(state => state.seller)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] = useState(false)

    useEffect(() => {
        dispatch(get_seller_request({
            parPage,
            searchValue,
            page: currentPage
        }))
    }, [parPage, searchValue, currentPage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[20px] font-bold mb-3'>  Seller Request </h1>

            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />

                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left text-[#d0d2d6]'>
                        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>No</th>
                                <th scope='col' className='py-3 px-4'>Name</th>
                                <th scope='col' className='py-3 px-4'>Email</th>
                                <th scope='col' className='py-3 px-4'>Payment Status</th>
                                <th scope='col' className='py-3 px-4'>Status</th>
                                <th scope='col' className='py-3 px-4'>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sellers.map((d, i) =>
                                <tr className='border-b border-slate-700' key={i}>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>{d.name} </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>{d.email} </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.payment}</span>
                                    </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.status}</span>
                                    </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <div className='flex justify-start items-center gap-4'>
                                            <Link to={`/admin/dashboard/seller/details/${d._id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'> <FaEye /> </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                    <Pagination
                        pageNumber={currentPage}
                        setPageNumber={setCurrentPage}
                        totalItem={50}
                        parPage={parPage}
                        showItem={3}
                    />
                </div>
            </div>
        </div>
    );
};

export default SellerRequest;