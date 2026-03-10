import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axiosInstance, { getData, postData } from '../../services/FetchNodeServices';
import axios from 'axios';

const AllCoupon = () => {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const AdminData = JSON.parse(sessionStorage.getItem("AdminData"))

    const hasAccessAdd = (module) => {
        return (
            AdminData?.role === "Admin" ||
            AdminData?.permissions?.[module]?.write === true
        );
    };

    const hasAccessDelete = (module) => {
        return (
            AdminData?.role === "Admin" ||
            AdminData?.permissions?.[module]?.delete === true
        );
    };

    const hasAccessEdit = (module) => {
        return (
            AdminData?.role === "Admin" ||
            AdminData?.permissions?.[module]?.update === true
        );
    };

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:7000/api/coupon/get-all-coupons');
                console.log("SSSSSS::=>", response)

                if (response.status === 200) {
                    setCoupons(response?.data?.coupons);
                }
                setIsLoading(false);
            } catch (error) {
                // toast.error('Error fetching coupons');
                console.error('Error fetching coupons:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    // Handle Delete Action
    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await axios.get(`http://localhost:7000/api/coupon/delete-coupon/${id}`);
                if (response.status === 200) {
                    setCoupons(coupons?.filter(coupon => coupon?._id !== id));
                    Swal.fire('Deleted!', 'Your coupon has been deleted.', 'success');
                }
            } catch (error) {
                Swal.fire('Error!', 'There was an error deleting the coupon.', 'error');
                console.error('Error deleting coupon:', error);
            }
        }
    };

    // Handle status checkbox change
    const handleCheckboxChange = async (e, couponId) => {
        const updatedStatus = e.target.checked;

        try {
            const response = await axios.post(`http://localhost:7000/api/coupon/change-status`, {
                isActive: updatedStatus,
                couponId: couponId
            });

            if (response.status === 200) {

                const updatedCoupons = coupons.map(coupon => {
                    if (coupon._id === couponId) {
                        coupon.isActive = updatedStatus;
                    }
                    return coupon;
                });
                toast.success('Coupon status updated successfully');
                setCoupons(updatedCoupons);
            }
        } catch (error) {
            toast.error("Error updating coupon status");
            console.error("Error updating coupon status:", error);
        }
    };

    // Loading state
    if (isLoading) {
        return <p>Loading Coupons...</p>;
    }

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Coupons</h4>
                </div>
                {hasAccessAdd('coupon') && <div className="links">
                    <Link to="/add-coupon" className="add-new">
                        Add New <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>}
            </div>

            {/* <div className="filteration">
                <div className="selects">
                  
                </div>
                <div className="search">
                    <label htmlFor="search">Search</label>&nbsp;
                    <input
                        type="text"
                        name="search"
                        id="search"
                        onChange={(e) => {
                            // Implement search filtering logic here if necessary
                        }}
                    />
                </div>
            </div> */}

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Coupon Title</th>
                            <th scope="col">Coupon Code</th>
                            <th scope="col">Discount</th>
                            <th scope="col">Show Top in Home Page</th>
                            {hasAccessEdit('coupon') && <th scope="col">Edit</th>}
                            {hasAccessDelete('coupon') && <th scope="col">Delete</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {coupons?.length > 0 ? (
                            coupons.map((coupon, index) => (
                                <tr key={coupon._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{coupon?.title || "-"}</td>
                                    <td>{coupon?.couponCode}</td>
                                    <td>{coupon?.discount > 100 && "$"}{coupon.discount}{coupon?.discount < 100 && "%"}</td>

                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={coupon?.isActive}
                                            onChange={(e) => handleCheckboxChange(e, coupon._id)}
                                        />
                                    </td>
                                    {hasAccessEdit('coupon') && <td>
                                        <Link to={`/edit-coupon/${coupon?._id}`} className="bt edit">
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                    </td>}
                                    {hasAccessDelete('coupon') && <td>
                                        <button className="bt cursor-pointer delete" onClick={() => handleDelete(coupon?._id)}>
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No Coupons found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllCoupon;
