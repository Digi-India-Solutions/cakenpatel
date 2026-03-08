// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./orderTracking.css";
// import logo from "../../images/pic/logo.png";
// import axios from "axios";
// import html2pdf from "html2pdf.js";
// import { useRef } from "react";

// const OrderTracking = () => {
//   const user = sessionStorage.getItem("userId");
//   const [orderData, setOrderData] = useState([]);
//   const invoiceRef = useRef();
//   /* ================= FETCH ORDERS ================= */
//   useEffect(() => {
//     const fetchOrderByUser = async () => {
//       try {
//         const res = await axios.get(
//           `https://api.cakenpetals.com/api/checkout/user/${user}`
//         );
//         setOrderData(res.data.data || []);
//       } catch (e) {
//         console.log(e);
//       }
//     };

//     if (user) fetchOrderByUser();
//   }, [user]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const handleDownloadPDF = (orderData) => {
//     const element = invoiceRef.current;
//     const options = {
//       margin: 0.5,
//       filename: `${orderData?.shippingAddress?.firstName || "Order"}_${formatDate(orderData?.createdAt)}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//     };
//     html2pdf().set(options).from(element).save();
//   };



//   return (
//     <>
//       {/* ================= HEADER ================= */}
//       <div className="main-header">
//         <div className="container header-inner">
//           <div className="logo">
//             <img src={logo} className="logoImg" alt="Cake Logo" />
//           </div>
//           <div className="header-right">
//             <span className="user">My Orders</span>
//           </div>
//         </div>
//       </div>

//       {/* ================= ORDERS ================= */}
//       {orderData.map((order) => {
//         const items = order.cartItems || [];

//         const totalItems = items.reduce(
//           (sum, item) => sum + item.quantity,
//           0
//         );

//         const deliveryDate = order.delivery?.date || "N/A";
//         const deliveryTime = order.delivery?.time || "N/A";

//         const address = order.shippingAddress || {
//           firstName: order.name,
//           lastName: "",
//           address: order.address,
//           city: order.city,
//           state: order.state,
//           postalCode: order.pin,
//         };

//         const fullName = `${address.firstName || ""} ${address.lastName || ""}`.trim() || order.name;

//         return (
//           <div className="container order-container mb-5" key={order._id}>
//             {/* TITLE */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h4>Order Details</h4>
//               <span className="status-badge">
//                 {order.orderStatus}
//               </span>
//             </div>

//             <p className="text-muted idSec">
//               Order ID <b>#CK{order._id.slice(-6).toUpperCase()}</b>
//             </p>
//             <button className="btn btn-light btn-sm" onClick={(e) => handleDownloadPDF(order)}>
//               📄 Download Invoice
//             </button>

//             {/* ================= DELIVERY SUMMARY ================= */}
//             <div className="row g-4 mb-4">
//               <div className="col-lg-6">
//                 <div className="card-box">
//                   <h6>Your cake is on the way 🍰</h6>

//                   <div className="route">
//                     <span>Cake Npetals Bakery To</span>
//                     <span className="dots">{order.address}</span>
//                   </div>

//                   <div className="progress mt-3">
//                     <div className="progress-bar"></div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-lg-3 col-md-6">
//                 <div className="card-box center">
//                   <p>Estimated Delivery</p>
//                   <b>{deliveryDate}</b>
//                 </div>
//               </div>

//               <div className="col-lg-3 col-md-6">
//                 <div className="card-box center">
//                   <p>Delivery Time</p>
//                   <b>{deliveryTime}</b>
//                 </div>
//               </div>
//             </div>

//             {/* ================= DELIVERY INFO ================= */}
//             <div className="row g-4 mb-4">
//               <div className="col-lg-6">
//                 <div className="card-box">
//                   <h6>Delivery Information</h6>

//                   <div className="ship-row">
//                     <span>Recipient</span>
//                     <b>{order.name?.charAt(0).toUpperCase() + order.name?.slice(1)}</b>
//                   </div>

//                   <div className="ship-row">
//                     <span>Phone</span>
//                     <b>{order.phone}</b>
//                   </div>

//                   <div className="ship-row">
//                     <span>City</span>
//                     <b>{order.city}</b>
//                   </div>

//                   <div className="ship-row">
//                     <span>Total Items</span>
//                     <b>{totalItems}</b>
//                   </div>

//                   <div className="ship-row">
//                     <span>Payment Mode</span>
//                     <b>{order.paymentMode.toUpperCase()}</b>
//                   </div>

//                   <div className="ship-row">
//                     <span>Payment Status</span>
//                     <b>{order.paymentStatus}</b>
//                   </div>
//                 </div>
//               </div>

//               {/* TIMELINE (Static UI but dynamic status) */}
//               <div className="col-lg-6">
//                 <div className="card-box">
//                   <h6>Order Timeline</h6>

//                   {order?.trackingOrders?.map((track) => <div className="timeline active">
//                     <p className="date">
//                       {track?.date
//                         ? `${new Date(track.date).toLocaleDateString("en-GB").replace(/\//g, "-")} 
//                             ${new Date(track.date).toLocaleTimeString("en-GB", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           hour12: false,
//                         })}`
//                         : ""}
//                     </p>

//                     <p>{track?.status}</p>
//                     <span>{track?.massage}</span>
//                   </div>)}

//                 </div>
//               </div>
//             </div>

//             {/* ================= ORDERED ITEMS ================= */}
//             <div className="card-box mb-4">
//               <h6>Ordered Items ({totalItems})</h6>

//               <div className="row g-3">
//                 {items.map((item, index) => (
//                   <div className="col-md-6" key={index}>
//                     <div className="item-card">
//                       <div className="item-img">
//                         <img
//                           src={`https://api.cakenpetals.com/${item.image.replace(
//                             /\\/g,
//                             "/"
//                           )}`}
//                           alt={item.name}
//                           className="productImg"
//                         />
//                       </div>

//                       <div>
//                         <p className="fw-semibold title mb-1">
//                           {item.name?.charAt(0).toUpperCase() + item.name?.slice(1)}
//                         </p>

//                         <p className="price">
//                           ₹ {item?.price * item?.quantity}
//                         </p>

//                         <small>Weight: {item?.weight}</small>
//                         <br />
//                         <small>Qty: {item?.quantity}</small>

//                         {/* ADDONS */}
//                         {item.addonProducts?.length > 0 && (
//                           <div className="mt-2">
//                             <small className="text-muted">
//                               Addon Products:
//                             </small>

//                             {item?.addonProducts?.map((addon, i) => (
//                               <div key={i}>
//                                 🎁 {addon?.name} × {addon?.quantity}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* ================= ORDER SUMMARY ================= */}
//             <div className="w-50">
//               <div className="card-box orderBox">
//                 <div className="d-flex justify-content-between mb-3">
//                   <h6>Order Summary</h6>
//                   <span
//                     className={
//                       order.paymentStatus === "Paid"
//                         ? "payment-success"
//                         : "text-warning"
//                     }
//                   >
//                     {order.paymentStatus}
//                   </span>
//                 </div>

//                 <div className="summary-row">
//                   <span>Total Amount</span>
//                   <b>₹ {order.totalPrice}</b>
//                 </div>
//               </div>
//             </div>

//             <div style={{ display: "none" }}>
//               <div ref={invoiceRef} style={{ padding: "30px", fontFamily: "'Helvetica', Arial, sans-serif", maxWidth: "700px", margin: "0 auto", color: "#333" }}>
//                 {/* Header */}
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #f0ad4e", paddingBottom: "15px", marginBottom: "20px" }}>
//                   <div>
//                     <h1 style={{ fontSize: "24px", margin: "0", color: "#f0ad4e" }}>CAKE NPETALS STORE</h1>
//                     <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#777" }}>Invoice</p>
//                   </div>
//                   <div style={{ textAlign: "right" }}>
//                     <p style={{ margin: "0", fontWeight: "bold" }}>Order ID: {order?._id}</p>
//                     <p style={{ margin: "5px 0 0", fontSize: "12px" }}>Date: {formatDate(order?.createdAt)}</p>
//                   </div>
//                 </div>

//                 {/* Addresses */}
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
//                   <div style={{ width: "45%" }}>
//                     <h4 style={{ fontSize: "14px", margin: "0 0 8px", color: "#f0ad4e" }}>Ship To:</h4>
//                     <p style={{ margin: "2px 0", fontSize: "13px" }}>{fullName}</p>
//                     <p style={{ margin: "2px 0", fontSize: "13px" }}>{address?.address}</p>
//                     <p style={{ margin: "2px 0", fontSize: "13px" }}>{address?.city}, {address?.state} - {address?.postalCode}</p>
//                     <p style={{ margin: "2px 0", fontSize: "13px" }}>Phone: {order?.phone}</p>
//                   </div>
//                   <div style={{ width: "45%", textAlign: "right" }}>
//                     <h4 style={{ fontSize: "14px", margin: "0 0 8px", color: "#f0ad4e" }}>Seller Details:</h4>
//                     <p style={{ margin: "2px 0", fontSize: "13px" }}>CAKE NPETALS STORE</p>
//                     <p style={{ margin: "2px 0", fontSize: "13px" }}>support@cakenpetals.com</p>
//                     <p style={{ margin: "2px 0", fontSize: "13px" }}>GST: xxxxxxxxxxx789</p>
//                   </div>
//                 </div>

//                 {/* Items Table */}
//                 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "25px" }}>
//                   <thead>
//                     <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #f0ad4e" }}>
//                       <th style={{ padding: "10px", textAlign: "left" }}>Item</th>
//                       <th style={{ padding: "10px", textAlign: "center" }}>Qty</th>
//                       <th style={{ padding: "10px", textAlign: "right" }}>Unit Price</th>
//                       <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {order.cartItems?.map((item, idx) => (
//                       <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
//                         {item.weight && <td style={{ padding: "10px" }}>
//                           <strong>{item.name}</strong><br />
//                           <span style={{ fontSize: "11px", color: "#777" }}>Weight: {item.weight}</span>
//                         </td>}
//                         <td style={{ padding: "10px", textAlign: "center" }}>{item.quantity}</td>
//                         <td style={{ padding: "10px", textAlign: "right" }}>₹{item.price}</td>
//                         <td style={{ padding: "10px", textAlign: "right" }}>₹{(item.price * item.quantity).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Subtotal:</td>
//                       <td style={{ padding: "10px", textAlign: "right" }}>₹{order?.totalPrice || order?.totalAmount}</td>
//                     </tr>
//                     {/* <tr>
//                 <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Shipping:</td>
//                 <td style={{ padding: "10px", textAlign: "right" }}>₹0.00</td>
//               </tr> */}
//                     <tr style={{ borderTop: "2px solid #f0ad4e" }}>
//                       <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontSize: "16px", fontWeight: "bold" }}>Grand Total:</td>
//                       <td style={{ padding: "10px", textAlign: "right", fontSize: "16px", fontWeight: "bold", color: "#f0ad4e" }}>₹{order.totalPrice || order.totalAmount}</td>
//                     </tr>
//                   </tfoot>
//                 </table>

//                 {/* Footer */}
//                 <div style={{ marginTop: "30px", borderTop: "1px dashed #ccc", paddingTop: "15px", fontSize: "11px", color: "#777", textAlign: "center" }}>
//                   <p>Thank you for shopping with DELHI BOOK STORE. For any queries, contact support@delhibookstore.com</p>
//                   <p>This is a computer generated invoice, no signature required.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}

//       {orderData.length === 0 && (
//         <div className="container text-center mt-5">
//           <h5>No Orders Found</h5>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderTracking;

import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./orderTracking.css";
import logo from "../../images/pic/logo.png";
import axios from "axios";
import html2pdf from "html2pdf.js";

const API_BASE = process.env.REACT_APP_API_URL || "https://api.cakenpetals.com";

const OrderTracking = () => {
  const user = sessionStorage.getItem("userId");
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const invoiceRefs = useRef([]); // array of refs for each order

  // Fetch orders
  useEffect(() => {
    const fetchOrderByUser = async () => {
      if (!user) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/api/checkout/user/${user}`);
        setOrderData(res.data.data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderByUser();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownloadPDF = (order, index) => {
    const element = invoiceRefs.current[index];
    if (!element) return;
    const options = {
      margin: 0.5,
      filename: `${order?.shippingAddress?.firstName || "Order"}_${formatDate(order?.createdAt)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  // Helper to get progress percentage based on order status
  const getProgressWidth = (status) => {
    switch (status) {
      case "Order Confirmed": return "25%";
      case "Processing": return "50%";
      case "Shipped": return "75%";
      case "Delivered": return "100%";
      default: return "0%";
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (orderData.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h5>No Orders Found</h5>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="main-header">
        <div className="container header-inner">
          <div className="logo">
            <img src={logo} className="logoImg" alt="Cake Logo" />
          </div>
          <div className="header-right">
            <span className="user">My Orders</span>
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      {orderData.map((order, index) => {
        const items = order.cartItems || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const deliveryDate = order.delivery?.date || "N/A";
        const deliveryTime = order.delivery?.time || "N/A";

        const address = order.shippingAddress || {
          firstName: order.name,
          lastName: "",
          address: order.address,
          city: order.city,
          state: order.state,
          postalCode: order.pin,
        };

        const fullName = `${address.firstName || ""} ${address.lastName || ""}`.trim() || order.name;

        // Determine if timeline item is latest
        const sortedTracking = (order.trackingOrders || [])
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        return (
          <div className="container order-container mb-5" key={order._id}>
            {/* TITLE */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>Order Details</h4>
              <span className="status-badge">{order.orderStatus}</span>
            </div>

            <p className="text-muted idSec">
              Order ID <b>#CK{order._id.slice(-6).toUpperCase()}</b>
            </p>
            <button
              className="btn btn-light btn-sm mb-3"
              onClick={() => handleDownloadPDF(order, index)}
            >
              📄 Download Invoice
            </button>

            {/* ================= DELIVERY SUMMARY ================= */}
            <div className="row g-4 mb-4">
              <div className="col-lg-6">
                <div className="card-box">
                  <h6>Your cake is on the way 🍰</h6>

                  <div className="route">
                    <span>Cake Npetals Bakery To</span>
                    <span className="dots">{order.address}</span>
                  </div>

                  <div className="progress mt-3">
                    <div className="progress-bar"></div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card-box center">
                  <p>Estimated Delivery</p>
                  <b>{deliveryDate}</b>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card-box center">
                  <p>Delivery Time</p>
                  <b>{deliveryTime}</b>
                </div>
              </div>
            </div>

            {/* ================= DELIVERY INFO ================= */}
            <div className="row g-4 mb-4">
              <div className="col-lg-6">
                <div className="card-box">
                  <h6>Delivery Information</h6>

                  <div className="ship-row">
                    <span>Recipient</span>
                    <b>{order.name?.charAt(0).toUpperCase() + order.name?.slice(1)}</b>
                  </div>

                  <div className="ship-row">
                    <span>Phone</span>
                    <b>{order.phone}</b>
                  </div>

                  <div className="ship-row">
                    <span>City</span>
                    <b>{order.city}</b>
                  </div>

                  <div className="ship-row">
                    <span>Total Items</span>
                    <b>{totalItems}</b>
                  </div>

                  <div className="ship-row">
                    <span>Payment Mode</span>
                    <b>{order.paymentMode.toUpperCase()}</b>
                  </div>

                  <div className="ship-row">
                    <span>Payment Status</span>
                    <b>{order.paymentStatus}</b>
                  </div>
                </div>
              </div>

              {/* TIMELINE (Static UI but dynamic status) */}
              <div className="col-lg-6">
                <div className="card-box">
                  <h6>Order Timeline</h6>

                  {order?.trackingOrders?.map((track) => <div className="timeline active">
                    <p className="date">
                      {track?.date
                        ? `${new Date(track.date).toLocaleDateString("en-GB").replace(/\//g, "-")} 
                            ${new Date(track.date).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}`
                        : ""}
                    </p>

                    <p>{track?.status}</p>
                    <span>{track?.massage}</span>
                  </div>)}

                </div>
              </div>
            </div>

            {/* ================= ORDERED ITEMS ================= */}
            <div className="card-box mb-4">
              <h6>Ordered Items ({totalItems})</h6>

              <div className="row g-3">
                {items.map((item, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="item-card">
                      <div className="item-img">
                        <img
                          src={`https://api.cakenpetals.com/${item.image.replace(
                            /\\/g,
                            "/"
                          )}`}
                          alt={item.name}
                          className="productImg"
                        />
                      </div>

                      <div>
                        <p className="fw-semibold title mb-1">
                          {item.name?.charAt(0).toUpperCase() + item.name?.slice(1)}
                        </p>

                        <p className="price">
                          ₹ {item?.price * item?.quantity}
                        </p>

                        <small>Weight: {item?.weight}</small>
                        <br />
                        <small>Qty: {item?.quantity}</small>

                        {/* ADDONS */}
                        {item.addonProducts?.length > 0 && (
                          <div className="mt-2">
                            <small className="text-muted">
                              Addon Products:
                            </small>

                            {item?.addonProducts?.map((addon, i) => (
                              <div key={i}>
                                🎁 {addon?.name} × {addon?.quantity}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="w-50">
              <div className="card-box orderBox">
                <div className="d-flex justify-content-between mb-3">
                  <h6>Order Summary</h6>
                  <span
                    className={
                      order.paymentStatus === "Paid"
                        ? "payment-success"
                        : "text-warning"
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Total Amount</span>
                  <b>₹ {order.totalPrice}</b>
                </div>
              </div>
            </div>


            {/* HIDDEN INVOICE FOR PDF (each order has its own ref) */}
            <div style={{ display: "none" }}>
              <div
                ref={(el) => (invoiceRefs.current[index] = el)}
                style={{
                  padding: "30px",
                  fontFamily: "'Helvetica', Arial, sans-serif",
                  maxWidth: "700px",
                  margin: "0 auto",
                  color: "#333",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #f0ad4e", paddingBottom: "15px", marginBottom: "20px" }}>
                  <div>
                    <h1 style={{ fontSize: "24px", margin: "0", color: "#f0ad4e" }}>CAKE NPETALS STORE</h1>
                    <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#777" }}>Invoice</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0", fontWeight: "bold" }}>Order ID: {order._id}</p>
                    <p style={{ margin: "5px 0 0", fontSize: "12px" }}>Date: {formatDate(order.createdAt)}</p>
                  </div>
                </div>

                {/* Addresses */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
                  <div style={{ width: "45%" }}>
                    <h4 style={{ fontSize: "14px", margin: "0 0 8px", color: "#f0ad4e" }}>Ship To:</h4>
                    <p style={{ margin: "2px 0", fontSize: "13px" }}>{fullName}</p>
                    <p style={{ margin: "2px 0", fontSize: "13px" }}>{address.address}</p>
                    <p style={{ margin: "2px 0", fontSize: "13px" }}>{address.city}, {address.state} - {address.postalCode}</p>
                    <p style={{ margin: "2px 0", fontSize: "13px" }}>Phone: {order.phone}</p>
                  </div>
                  <div style={{ width: "45%", textAlign: "right" }}>
                    <h4 style={{ fontSize: "14px", margin: "0 0 8px", color: "#f0ad4e" }}>Seller Details:</h4>
                    <p style={{ margin: "2px 0", fontSize: "13px" }}>CAKE NPETALS STORE</p>
                    <p style={{ margin: "2px 0", fontSize: "13px" }}>cakenpetals111@gmail.com</p>
                    <p style={{ margin: "2px 0", fontSize: "13px" }}>GST: xxxxxxxxxxx789</p>
                  </div>
                </div>

                {/* Items Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "25px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #f0ad4e" }}>
                      <th style={{ padding: "10px", textAlign: "left" }}>Item</th>
                      <th style={{ padding: "10px", textAlign: "center" }}>Qty</th>
                      <th style={{ padding: "10px", textAlign: "right" }}>Unit Price</th>
                      <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cartItems?.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "10px" }}>
                          <strong>{item.name}</strong>
                          {item.weight && <br />}
                          {item.weight && <span style={{ fontSize: "11px", color: "#777" }}>Weight: {item.weight}</span>}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>{item.quantity}</td>
                        <td style={{ padding: "10px", textAlign: "right" }}>₹{item.price}</td>
                        <td style={{ padding: "10px", textAlign: "right" }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Subtotal:</td>
                      <td style={{ padding: "10px", textAlign: "right" }}>₹{order.totalPrice || order.totalAmount}</td>
                    </tr>
                    <tr style={{ borderTop: "2px solid #f0ad4e" }}>
                      <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontSize: "16px", fontWeight: "bold" }}>Grand Total:</td>
                      <td style={{ padding: "10px", textAlign: "right", fontSize: "16px", fontWeight: "bold", color: "#f0ad4e" }}>₹{order.totalPrice || order.totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Footer */}
                <div style={{ marginTop: "30px", borderTop: "1px dashed #ccc", paddingTop: "15px", fontSize: "11px", color: "#777", textAlign: "center" }}>
                  <p>Thank you for shopping with CAKE NPETALS STORE. For any queries, contact support@cakenpetals.com</p>
                  <p>This is a computer generated invoice, no signature required.</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OrderTracking;