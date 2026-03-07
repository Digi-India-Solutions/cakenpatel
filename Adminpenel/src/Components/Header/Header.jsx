import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect } from 'react';


const Header = () => {
  const location = useLocation();
  const [sidetoggle, setSideToggle] = useState(false)
  const [orderActive, setOrderActive] = useState(true);
  const [AdminData, setAdminData] = useState({});

  const AdminDatas = JSON.parse(sessionStorage.getItem("AdminData"))
  const isActive = (path) => location.pathname === path;

  console.log("AdminDataAdminData=>", AdminData.role)

  const handletoggleBtn = () => {
    setSideToggle(!sidetoggle)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('login'); // Remove login status
    window.location.href = '/login' // Redirect to login page
  };

  const handleToggleOrders = async () => {
    setOrderActive((prev) => !prev);
    try {
      const res = await axios.post(`https://api.cakenpetals.com/api/active-order/upload-active-order`, { isActive: !orderActive });
    } catch (e) {
      console.log(e);
    }

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: orderActive ? "warning" : "success",
      title: orderActive ? "Orders Deactivated" : "Orders Activated",
      showConfirmButton: false,
      timer: 1200,
    });
  };

  const fetchOrderStatus = async () => {
    try {
      const res = await axios.get(`https://api.cakenpetals.com/api/active-order/get-active-order`);
      setOrderActive(res.data.data.isActive || false);
    } catch (e) {
      console.log(e);
    }
  }
  const fetchAdminUser = async () => {
    try {
      const res = await axios.get(`https://api.cakenpetals.com/api/user/${AdminDatas?._id}`);
      console.log(".data.data==>", res);
      setAdminData(res.data.data);
      sessionStorage.setItem("AdminData", JSON.stringify(res.data.data));
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchAdminUser()
    fetchOrderStatus();
  }, []);

  const hasAccess = (module) => {
    return (
      AdminData?.role === "Admin" ||
      AdminData?.permissions?.[module]?.read === true
    );
  };

  return (
    <>
      <header>
        <div className="top-head">
          <div className="right">
            <h2>Cake Admin Panel</h2>
            <div className="bar" onClick={handletoggleBtn}>
              <i class="fa-solid fa-bars"></i>
            </div>
          </div>
          <div className="left">
            <div
              className="toggle-orders"
              onClick={handleToggleOrders}
              style={{ cursor: "pointer", fontWeight: 600, fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", }}
            >
              <i
                className={`fa-solid ${orderActive ? "fa-toggle-on" : "fa-toggle-off"}`}
                style={{ color: orderActive ? "#22c55e" : "#ffffff", fontSize: "28px", transition: "all 0.25s ease", }}
              ></i>

              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                {orderActive ? "Orders Active" : "Orders Disabled"}
              </span>
            </div>

            <a href="https://www.cakecrazzy.com" target="_blank">
              <i class="fa-solid fa-globe"></i>
              Go To Website
            </a>

            <div className="logout" onClick={handleLogout}>
              Log Out <i className="fa-solid fa-right-from-bracket"></i>
            </div>
          </div>

        </div>

        <div className={`rightNav ${sidetoggle ? "active" : ""} `}>
          <ul>

            {hasAccess("dashboard") && <li ><Link to="/dashboard" className={isActive('/dashboard') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-gauge"></i> Dashboard</Link></li>}
            {hasAccess("orders") && <li><Link to="/all-orders" className={isActive('/all-orders') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-truck"></i> Manage Orders</Link></li>}
            {hasAccess("banners") && <li><Link to="/all-banners" className={isActive('/all-banners') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-regular fa-images"></i> Manage Banners</Link></li>}
            {hasAccess("cakeBanner") && <li><Link to="/all-cake-banner" className={isActive('/all-cake-banner') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-regular fa-images"></i> Manage Level Banners</Link></li>}
            {hasAccess("contactQuery") && <li><Link to="/all-contact-query" className={isActive('/all-contact-query') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> All Contact Query</Link></li>}
            {hasAccess("mainCategory") && <li><Link to="/all-category" className={isActive('/all-category') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> Manage Main Category</Link></li>}
            {hasAccess("category") && <li><Link to="/all-subcategory" className={isActive('/all-subcategory') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-tag"></i> Manage Sub Category</Link></li>}
            {hasAccess("subCategory") && <li><Link to="/all-sub-subcategory" className={isActive('/all-sub-subcategory') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-tag"></i> Manage Child Category</Link></li>}
            {hasAccess("perancProduct") && <li><Link to="/all-perant-product" className={isActive('/all-perant-product') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> Manage Perant product</Link></li>}
            {hasAccess("products") && <li><Link to="/all-products" className={isActive('/all-products') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-boxes-stacked"></i> Manage Product</Link></li>}
            {hasAccess("recommendedCategory") && <li><Link to="/all-recommended-category" className={isActive('/all-recommended-category') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-tag"></i> Manage Recommended Category</Link></li>}
            {hasAccess("recommendedProducts") && <li><Link to="/all-recommended-products" className={isActive('/all-recommended-products') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-boxes-stacked"></i> Manage Recommended Product</Link></li>}
            {hasAccess("size") && <li><Link to="/all-size" className={isActive('/all-size') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-ruler-combined"></i> Manage Size</Link></li>}
            {/* {hasAccess("dashboard") && <li><Link to="/all-promo-banners" className={isActive('/all-promo-banners') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-regular fa-images"></i> Manage Promo Banners</Link></li>} */}
            {hasAccess("reels") && <li><Link to="/all-reels" className={isActive('/all-reels') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-regular fa-images"></i> Manage Reels</Link></li>}
            {hasAccess("users") && <li><Link to="/all-users" className={isActive('/all-users') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> All Users</Link></li>}
            {hasAccess("pincode") && <li><Link to="/all-pincode" className={isActive('/all-pincode') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> All State/Pincode</Link></li>}
            {hasAccess("coupon") && <li><Link to="/all-coupon" className={isActive('/all-coupon') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> Manage Coupon</Link></li>}
            {hasAccess("countdown") && <li><Link to="/all-countdown" className={isActive('/all-countdown') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> Manage Count Down</Link></li>}
            {hasAccess("adminUser") && <li><Link to="/all-admin" className={isActive('/all-admin') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> All Admin Permission</Link></li>}
            {hasAccess("subscribeEmail") && <li><Link to="/all-subscribeEmail" className={isActive('/all-subscribeEmail') ? 'click' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> All Subscribe Email</Link></li>}

            <div className="logout" onClick={handleLogout}>
              Log Out <i className="fa-solid fa-right-from-bracket mb-4"></i>
            </div>

          </ul>
        </div>

      </header>
    </>
  )
}

export default Header