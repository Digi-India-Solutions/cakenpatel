// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useRef } from "react";
// import html2pdf from "html2pdf.js";


// const EditOrder = () => {
//   const { id } = useParams();
//   const [orderData, setOrderData] = useState({});
//   const [orderStatus, setOrderStatus] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [orderStatusMassage, setOrderStatusMassage] = useState("");
//   const navigate = useNavigate();
//   const invoiceRef = useRef();


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
//     console.log("XXXXXXXX::=>", orderData)
//     const options = {
//       margin: 0.5,
//       filename: `${orderData?.shippingAddress?.firstName + " " + orderData?.shippingAddress?.lastName} - ${formatDate(orderData?.createdAt)}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//     };
//     html2pdf().set(options).from(element).save();
//   };


//   // Fetch API data
//   const getApiData = async () => {
//     try {
//       const res = await axios.get(`https://api.cakenpetals.com/api/checkout/${id}`);
//       setOrderData(res.data);
//       setOrderStatus(res.data.orderStatus);
//       setPaymentStatus(res.data.paymentStatus);
//     } catch (error) {
//       console.error("Error fetching order data:", error);
//       toast.error("Failed to fetch order data.");
//     }
//   };

//   useEffect(() => {
//     getApiData();
//   }, []);

//   // Update Order Status and Payment Status
//   const handleUpdate = async () => {
//     try {
//       const updatedData = {
//         orderStatus,
//         paymentStatus,
//         date: new Date(),
//         orderStatusMassage
//       };
//       const res = await axios.put(
//         `https://api.cakenpetals.com/api/checkout/${id}`,
//         updatedData
//       );
//       toast.success("Order updated successfully!");
//       setOrderData(res.data); // Optionally refresh the data
//       navigate("/all-orders");
//     } catch (error) {
//       console.error("Error updating order:", error);
//       toast.error("Failed to update order.");
//     }
//   };

//   const handlePrint = (note) => {
//     const printWindow = window.open("", "_blank");

//     printWindow.document.write(`
//     <html>
//       <head>
//         <title>Special Greeting Card</title>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             padding: 40px;
//             text-align: center;
//             background: #f8f8f8;
//           }

//           .card {
//             background: white;
//             padding: 40px;
//             border-radius: 15px;
//             box-shadow: 0 5px 20px rgba(0,0,0,0.1);
//             max-width: 500px;
//             margin: auto;
//             border: 2px solid #ffc107;
//           }

//           h2 {
//             margin-bottom: 20px;
//             color: #ff6a00;
//           }

//           .label {
//             font-size: 14px;
//             color: #777;
//           }

//           .value {
//             font-size: 18px;
//             font-weight: bold;
//             margin-bottom: 15px;
//           }

//           .message {
//             margin-top: 20px;
//             font-style: italic;
//             font-size: 18px;
//             padding: 15px;
//             border-left: 4px solid #ff9800;
//             background: #fff8e1;
//           }

//           @media print {
//             body {
//               background: white;
//             }
//           }
//         </style>
//       </head>

//       <body>
//         <div class="card">
//           <h2>🎁 Special Greeting</h2>

//           <div class="label">Occasion</div>
//           <div class="value">${note.occasion || "-"}</div>

//           <div class="label">Relation</div>
//           <div class="value">${note.relation || "-"}</div>

//           <div class="label">From</div>
//           <div class="value">${note.toName || "-"}</div>

//           <div class="message">
//             "${note.message || ""}"
//           </div>
//         </div>

//         <script>
//           window.onload = function() {
//             window.print();
//             window.close();
//           }
//         </script>
//       </body>
//     </html>
//   `);

//     printWindow.document.close();
//   };


//   // Determine if the "Order Status" dropdown should be disabled
//   const isOrderStatusDisabled =
//     orderStatus === "Delivered" || orderStatus === "Cancelled";
//   const isPaymentStatusDisabled = paymentStatus === "Success";
//   console.log("DDDDDDDD::=>", orderData.specialNote);
//   return (
//     <>
//       <div className="bread">
//         <div className="head">
//           <h4>Update Order</h4>
//         </div>
//         <div className="links">
//           <Link to="/all-orders" className="add-new">
//             Back <i className="fa-regular fa-circle-left"></i>
//           </Link>
//         </div>
//       </div>

//       <div className="container mt-4">
//         <div className="row">
//           <div className="col-md-8">
//             <div className="card">
//               <div className="card-header">
//                 <div className="card-header bg-primary text-white justify-content-between d-flex">
//                   <h5 className="card-title">Order Details</h5>
//                   <button className="btn btn-light" onClick={() => handleDownloadPDF(orderData)}>
//                     📄 Download Slip
//                   </button>
//                 </div>
//               </div>
//               <div className="table-responsive">
//                 <table className="table table-bordered">
//                   <tbody>
//                     <tr>
//                       <th scope="row">Order ID</th>
//                       <td>{orderData._id}</td>
//                     </tr>
//                     <tr>
//                       <th scope="row">User Name</th>
//                       <td>{orderData.name}</td>
//                     </tr>
//                     <tr>
//                       <th scope="row">Email</th>
//                       <td>{orderData.email}</td>
//                     </tr>
//                     <tr>
//                       <th scope="row">Phone Number</th>
//                       <td>{orderData.phone}</td>
//                     </tr>
//                     <tr>
//                       <th scope="row">Address</th>
//                       <td>
//                         {orderData.address}, {orderData.city}, {orderData.state}
//                         , {orderData.pin}
//                       </td>
//                     </tr>
//                     <tr>
//                       <th scope="row">Order Date</th>
//                       <td>{new Date(orderData.orderDate).toLocaleString()}</td>
//                     </tr>
//                     <tr>
//                       <th scope="row">Final Price</th>
//                       <td>₹{orderData.totalPrice}</td>
//                     </tr>
//                     <tr>
//                       <th scope="row">Order Status</th>
//                       <td>
//                         <select
//                           className="form-select"
//                           value={orderStatus}
//                           onChange={(e) => setOrderStatus(e.target.value)}
//                           disabled={isOrderStatusDisabled} // Disable the dropdown based on payment and status
//                         >
//                           <option value="Order Confirmed	">
//                             Order Confirmed{" "}
//                           </option>
//                           <option value="Processing">Processing</option>
//                           <option value="Shipped">Shipped</option>
//                           <option value="Delivered">Delivered</option>
//                           <option value="Cancelled">Cancelled</option>
//                         </select>
//                       </td>
//                     </tr>

//                     <tr>
//                       <th scope="row">Order Status Massage</th>
//                       <td>
//                         {/* <select
//                           className="form-select"
//                           value={orderStatus}
//                           onChange={(e) => setOrderStatus(e.target.value)}
//                           disabled={isOrderStatusDisabled} // Disable the dropdown based on payment and status
//                         >
//                           <option value="Order Confirmed	">
//                             Order Confirmed{" "}
//                           </option>
//                           <option value="Processing">Processing</option>
//                           <option value="Shipped">Shipped</option>
//                           <option value="Delivered">Delivered</option>
//                           <option value="Cancelled">Cancelled</option>
//                         </select> */}
//                         <textarea type="text" value={orderStatusMassage} onChange={(e) => setOrderStatusMassage(e.target.value)} fullWidth />
//                       </td>
//                     </tr>
//                     <tr>
//                       <th scope="row">Payment Mode</th>
//                       <td>{orderData.paymentMode}</td>
//                     </tr>
//                     <tr>
//                       <th scope="row">Payment Status</th>
//                       <td>
//                         <select
//                           className="form-select"
//                           value={paymentStatus}
//                           onChange={(e) => setPaymentStatus(e.target.value)}
//                           disabled={isPaymentStatusDisabled} // Disable if payment is success
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="Success">Success</option>
//                         </select>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             {orderData?.specialNote && (
//               <div className="card mt-4 border-0 shadow-sm" style={{ marginTop: '100' }}>
//                 <div className="card-header bg-warning text-dark" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <h5 className="mb-0">🎁 Special Note</h5>
//                   <button
//                     className="btn btn-light btn-sm print-btn"
//                     onClick={() => handlePrint(orderData.specialNote)}
//                   >
//                     🖨 Print Card
//                   </button>
//                 </div>
//                 <div className="card-body">
//                   <div className="row g-3">
//                     <div className="col-md-6">
//                       <div className="p-2 bg-light rounded">
//                         <small className="text-muted">Occasion</small>
//                         <h6 className="mb-0">{orderData.specialNote.occasion}</h6>
//                       </div>
//                     </div>

//                     <div className="col-md-6">
//                       <div className="p-2 bg-light rounded">
//                         <small className="text-muted">Relation</small>
//                         <h6 className="mb-0">{orderData.specialNote.relation}</h6>
//                       </div>
//                     </div>

//                     <div className="col-md-6">
//                       <div className="p-2 bg-light rounded">
//                         <small className="text-muted">From</small>
//                         <h6 className="mb-0">{orderData.specialNote.toName || '-'}</h6>
//                       </div>
//                     </div>

//                     <div className="col-md-12">
//                       <div className="p-2 bg-white border rounded">
//                         <small className="text-muted">Message</small>
//                         <p className="mb-0 mt-1 fst-italic">
//                           "{orderData.specialNote.message}"
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="col-md-4">
//             <div className="card">
//               <div className="card-header">
//                 <h5 className="card-title">Items</h5>
//               </div>
//               <div className="card-body">
//                 {orderData.cartItems && orderData.cartItems.length > 0 ? (
//                   orderData.cartItems.map((item, index) => (
//                     <div key={index} className="mb-3">
//                       <strong>{item.name}</strong>
//                       <br />
//                       <p className="mb-1">Quantity: {item.quantity}</p>
//                       <p className="mb-1">Weight: {item.weight}</p>
//                       <p className="mb-1">Price: ₹{item.price}</p>
//                       <p className="mb-1">
//                         Delivery Date:{" "}
//                         {new Date(item.deliveryDate).toLocaleString()}
//                       </p>
//                       <p className="mb-0">Message: {item?.massage}</p>
//                       <img
//                         src={`https://api.cakenpetals.com/${item.image}`}
//                         alt={item.name}
//                         style={{
//                           width: "100px",
//                           height: "100px",
//                           marginTop: "10px",
//                         }}
//                       />
//                       <hr />
//                     </div>
//                   ))
//                 ) : (
//                   <p>No items in the cart.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="card mt-4">
//           <div className="card-header">
//             <h5>Order Tracking Timeline</h5>
//           </div>
//           <div className="card-body">
//             {orderData?.trackingOrders?.length > 0 ? (
//               orderData?.trackingOrders
//                 .sort((a, b) => new Date(b.date) - new Date(a.date))
//                 .map((track, index) => (
//                   <div key={index} className="tracking-item mb-3 p-3 border rounded">
//                     <div className="d-flex justify-content-between">
//                       <strong>{track.status}</strong>
//                       <small className="text-muted">
//                         {new Date(track.date).toLocaleString()}
//                       </small>
//                     </div>
//                     <p className="mb-0 text-muted">{track.massage}</p>
//                   </div>
//                 ))
//             ) : (
//               <p>No tracking updates available.</p>
//             )}
//           </div>
//         </div>


//         <div className="row mt-3">
//           <div className="col">
//             <button className="btn btn-primary" onClick={handleUpdate}>
//               Update Order
//             </button>
//             <Link to="/all-orders" className="btn btn-secondary ms-2">
//               Back
//             </Link>
//           </div>
//         </div>

//         < div style={{ display: "none" }}>
//           <div
//             ref={invoiceRef}
//             style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", fontSize: "14px", lineHeight: "1.4", }}
//           >
//             {/* Header */}
//             <div style={{ marginBottom: "15px", display: 'flex', justifyContent: 'space-between' }}>
//               <div style={{ display: 'flex' }}>
//                 <h1 style={{ fontSize: "12px", fontWeight: "bold", margin: "5px 5px 5px 5px" }}>Ship to:</h1>
//                 <div style={{ fontSize: "9px", fontWeight: "bold", margin: "0 0 0 0", marginTop: '7px' }}>
//                   {orderData?.shippingAddress?.firstName} {orderData?.shippingAddress?.lastName}
//                 </div>
//               </div>
//               <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
//                 Order ID: {orderData?._id || "404-9537172-8890759"}
//               </p>
//             </div>

//             <hr style={{ borderTop: "1px dashed #000", margin: "15px 0" }} />

//             {/* Order Info */}
//             {/* <div style={{ marginBottom: "15px" }}>
//                   <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
//                     Order ID: {orderData?._id || "404-9537172-8890759"}
//                   </p>
//                   <p style={{ margin: "0 0 5px 0", fontStyle: "italic" }}>VPrime</p>
//                   <p style={{ margin: "0 0 10px 0" }}>Thank you for buying from DELHI BOOK STORE.</p>
//                 </div> */}

//             {/* Delivery and Order Details Table */}
//             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px", fontSize: "12px" }}>
//               <tbody>
//                 <tr>
//                   <td style={{ width: "50%", verticalAlign: "top", paddingRight: "10px" }}>
//                     <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Delivery address:</p>
//                     <p style={{ margin: "0 0 2px 0" }}>
//                       {orderData?.shippingAddress?.firstName} {orderData?.shippingAddress?.lastName}
//                     </p>
//                     <p style={{ margin: "0 0 2px 0" }}>{orderData?.shippingAddress?.address}</p>
//                     <p style={{ margin: "0 0 2px 0" }}>
//                       {orderData?.shippingAddress?.city}, {orderData?.shippingAddress?.state}{" "}
//                       {orderData?.shippingAddress?.postalCode}
//                     </p>
//                   </td>
//                   <td style={{ width: "50%", verticalAlign: "top" }}>
//                     <table style={{ width: "100%" }}>
//                       <tbody>
//                         <tr>
//                           <td style={{ padding: "2px 0", textAlign: "right" }}>
//                             <strong>Order Date:</strong> {formatDate(orderData?.createdAt)}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td style={{ padding: "2px 0", textAlign: "right" }}>
//                             <strong>Shipping Service:</strong> Standard
//                           </td>
//                         </tr>
//                         <tr>
//                           <td style={{ padding: "2px 0", textAlign: "right" }}>
//                             <strong>Buyer Name:</strong> {orderData?.shippingAddress?.firstName}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td style={{ padding: "2px 0", textAlign: "right" }}>
//                             <strong>Seller Name:</strong> DELHI BOOK STORE
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             <hr style={{ borderTop: "1px dashed #000", margin: "15px 0" }} />

//             {/* Quantity Header */}
//             {/* <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 10px 0" }}>Quantity</h3> */}

//             {/* Product Details Table */}
//             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px", fontSize: "12px" }}>
//               <thead>
//                 <tr>
//                   <th style={{ textAlign: "left", borderBottom: "1px solid #000", padding: "5px 0", width: "60%" }}>
//                     Product Details
//                   </th>
//                   <th style={{ textAlign: "right", borderBottom: "1px solid #000", padding: "5px 0", width: "20%" }}>
//                     Unit price
//                   </th>
//                   <th style={{ textAlign: "right", borderBottom: "1px solid #000", padding: "5px 0", width: "20%" }}>
//                     Quantity
//                   </th>
//                   <th style={{ textAlign: "right", borderBottom: "1px solid #000", padding: "5px 0", width: "20%" }}>
//                     Order Totals
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orderData?.items?.map((item, index) => (
//                   <tr key={index}>
//                     <td style={{ padding: "10px 0", verticalAlign: "top" }}>
//                       <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
//                         {item?.productId?.title || item?.productId?.productName}
//                       </p>
//                       <p style={{ margin: "0 0 2px 0" }}>
//                         SKU: {item?.productId?.sku || "9780814472811_DBS"}
//                       </p>
//                       {item?.productId?.asin && <p style={{ margin: "0 0 2px 0" }}>
//                         ASIN: {item?.productId?.asin || "0814472818"}
//                       </p>}
//                       <p style={{ margin: "0 0 2px 0" }}>Condition: New</p>
//                       <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
//                         Order Item ID: {item?._id?.substring(0, 14) || "53402259347802"}
//                       </p>
//                     </td>
//                     <td style={{ textAlign: "center", verticalAlign: "top", padding: "5px 5px" }}>
//                       ${item?.productId?.finalPrice || item?.price || "450.00"}
//                     </td>
//                     <td style={{ textAlign: "center", verticalAlign: "top", padding: "2px 2px" }}>
//                       {item?.quantity || 1}
//                     </td>
//                     <td style={{ textAlign: "right", verticalAlign: "top", padding: "10px 0" }}>
//                       <p style={{ margin: "0 0 0 0" }}>
//                         Item total: ${((item?.productId?.finalPrice || item?.price || 450) * (item?.quantity || 1)).toFixed(2)}
//                       </p>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <p style={{ margin: "5 0 5 0" }}>
//               Condition note: Fast Shipping. Excellent & friendly Customer Service. We will respond to your mails
//               within 12 hours. You will be HAPPY with your purchase. Your satisfaction is guaranteed!
//             </p>
//             <hr style={{ borderTop: "1px dashed #000", margin: "15px 0" }} />

//             {/* COD Amount */}
//             <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between" }}>
//               <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 5px 0" }}>
//                 COD Collectible Amount
//               </h3>
//               <p style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}>
//                 ${orderData?.totalAmount || "457.00"}
//               </p>
//             </div>

//             <hr style={{ borderTop: "1px dashed #000", margin: "15px 0" }} />

//             {/* COD Amount Again */}
//             {/* <div style={{ marginBottom: "15px" }}>
//                   <p style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 10px 0" }}>
//                     COD Collectible Amount: ${orderData?.totalAmount || "457.00"}
//                   </p>
//                 </div> */}

//             {/* Footer */}
//             <div style={{ fontSize: "12px", marginTop: "20px" }}>
//               <p style={{ margin: "0 0 10px 0" }}>
//                 Thank you for choosing Delhi Book Store. For any product feedback or support, please visit our
//                 website at www.delhibookstore.com.
//               </p>
//             </div>
//           </div>
//         </div>

//       </div>

//       <ToastContainer />
//     </>
//   );
// };

// export default EditOrder;


import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2pdf from "html2pdf.js";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatusMessage, setOrderStatusMessage] = useState("");

  // Helper: format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch order data
  const getApiData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://api.cakenpetals.com/api/checkout/${id}`);
      setOrderData(res.data);
      setOrderStatus(res.data.orderStatus);
      setPaymentStatus(res.data.paymentStatus);
      setOrderStatusMessage(res?.data?.massage || "");
    } catch (error) {
      console.error("Error fetching order data:", error);
      toast.error("Failed to fetch order data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiData();
  }, [id]);

  // Update order
  const handleUpdate = async () => {
    try {
      const updatedData = {
        orderStatus,
        paymentStatus,
        orderStatusMassage: orderStatusMessage,
        date: new Date(),
      };
      console.log("SSSSSDDD==>", orderData, updatedData);
      const res = await axios.put(
        `https://api.cakenpetals.com/api/checkout/${id}`,
        updatedData
      );
      toast.success("Order updated successfully!");
      setOrderData(res.data);
      navigate("/all-orders");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };

  // Download PDF invoice
  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
    const options = {
      margin: 0.5,
      filename: `${orderData?.shippingAddress?.firstName || "Order"}_${formatDate(orderData?.createdAt)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  // Print special note card
  const handlePrint = (note) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Special Greeting Card</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f8f8f8; }
            .card { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); max-width: 500px; margin: auto; border: 2px solid #ffc107; }
            h2 { margin-bottom: 20px; color: #ff6a00; }
            .label { font-size: 14px; color: #777; }
            .value { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
            .message { margin-top: 20px; font-style: italic; font-size: 18px; padding: 15px; border-left: 4px solid #ff9800; background: #fff8e1; }
            @media print { body { background: white; } }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>🎁 Special Greeting</h2>
            <div class="label">Occasion</div><div class="value">${note.occasion || "-"}</div>
            <div class="label">Relation</div><div class="value">${note.relation || "-"}</div>
            <div class="label">From</div><div class="value">${note.toName || "-"}</div>
            <div class="message">"${note.message || ""}"</div>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return <div className="alert alert-danger">Order not found.</div>;
  }

  const isOrderStatusDisabled =
    orderStatus === "Delivered" || orderStatus === "Cancelled";
  const isPaymentStatusDisabled = paymentStatus === "Success";

  // Extract address safely (supports both flat and shippingAddress structures)
  const address = orderData.shippingAddress || {
    firstName: orderData.name,
    lastName: "",
    address: orderData.address,
    city: orderData.city,
    state: orderData.state,
    postalCode: orderData.pin,
  };

  const fullName = `${address.firstName || ""} ${address.lastName || ""}`.trim() || orderData.name;
  console.log("SSXXXXXSS=>", orderData)
  return (
    <>
      <div className="bread d-flex justify-content-between align-items-center mb-3">
        <h4>Update Order</h4>
        <Link to="/all-orders" className="btn btn-outline-secondary">
          <i className="fa-regular fa-circle-left me-1"></i> Back
        </Link>
      </div>

      <div className="container-fluid mt-4">
        <div className="row g-4">
          {/* Left column: Order details */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Order Details</h5>
                <button className="btn btn-light btn-sm" onClick={handleDownloadPDF}>
                  📄 Download Invoice
                </button>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <tbody>
                    <tr><th>Order ID</th><td>{orderData._id}</td></tr>
                    <tr><th>Customer Name</th><td>{fullName}</td></tr>
                    <tr><th>Email</th><td>{orderData.email}</td></tr>
                    <tr><th>Phone</th><td>{orderData.phone}</td></tr>
                    <tr>
                      <th>Address</th>
                      <td>
                        {address.address}, {address.city}, {address.state} - {address.postalCode}
                      </td>
                    </tr>
                    <tr><th>Order Date</th><td>{new Date(orderData.orderDate).toLocaleString()}</td></tr>
                    <tr><th>Order Delevry Date</th><td>{`${orderData?.delivery?.date} || ${orderData?.delivery?.time}`}</td></tr>
                    <tr><th>Total Amount</th><td>₹{orderData.totalPrice || orderData.totalAmount}</td></tr>
                    <tr>
                      <th>Order Status</th>
                      <td>
                        <select
                          className="form-select"
                          value={orderStatus}
                          onChange={(e) => setOrderStatus(e.target.value)}
                          disabled={isOrderStatusDisabled}
                        >
                          <option value="Order Confirmed">Order Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th>Status Message</th>
                      <td>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={orderStatusMessage}
                          onChange={(e) => setOrderStatusMessage(e.target.value)}
                          placeholder="Add an optional message for the customer..."
                        />
                      </td>
                    </tr>
                    <tr><th>Payment Mode</th><td>{orderData.paymentMode}</td></tr>
                    <tr>
                      <th>Payment Status</th>
                      <td>
                        <select
                          className="form-select"
                          value={paymentStatus}
                          onChange={(e) => setPaymentStatus(e.target.value)}
                          disabled={isPaymentStatusDisabled}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Success">Success</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Special Note Card */}
            {orderData?.specialNote && (
              <div className="card mt-4 border-0 shadow-sm">
                <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">🎁 Special Note</h5>
                  <button className="btn btn-light btn-sm" onClick={() => handlePrint(orderData.specialNote)}>
                    🖨 Print Card
                  </button>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted">Occasion</small>
                        <h6 className="mb-0">{orderData.specialNote.occasion}</h6>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted">Relation</small>
                        <h6 className="mb-0">{orderData.specialNote.relation}</h6>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted">From</small>
                        <h6 className="mb-0">{orderData.specialNote.toName || '-'}</h6>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="p-3 bg-white border rounded">
                        <small className="text-muted">Message</small>
                        <p className="mb-0 mt-1 fst-italic">"{orderData.specialNote.message}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Tracking Timeline */}
            <div className="card mt-4 shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">Order Tracking Timeline</h5>
              </div>
              <div className="card-body">
                {orderData?.trackingOrders?.length > 0 ? (
                  orderData.trackingOrders
                    .sort((a, b) => new Date(b?.date) - new Date(a?.date))
                    .map((track, idx) => (
                      <div key={idx} className="tracking-item mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between">
                          <strong>{track.status}</strong>
                          <small className="text-muted">{new Date(track.date).toLocaleString()}</small>
                        </div>
                        <p className="mb-0 text-muted">{track?.massage}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-muted">No tracking updates available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Ordered Items */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">Items in this Order</h5>
              </div>
              <div className="card-body" style={{ maxHeight: "500px", overflowY: "auto" }}>
                {orderData.cartItems && orderData.cartItems.length > 0 ? (
                  orderData.cartItems.map((item, index) => (
                    <div key={index} className="mb-4 pb-3 border-bottom">
                      <div className="d-flex gap-3">
                        <img
                          src={`https://api.cakenpetals.com/${item.image}`}
                          alt={item.name}
                          style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.name}</h6>
                          <p className="mb-1 small">Quantity: {item.quantity}</p>
                          <p className="mb-1 small">Weight: {item.weight}</p>
                          <p className="mb-1 small">Price: ₹{item?.price}</p>
                          {/* <p className="mb-1 small">
                            Delivery: {item?.delivery?.date}
                          </p> */}
                          {item.massage && <p className="mb-0 small fst-italic">Note: {item.massage}</p>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No items in this order.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update Order
          </button>
          <Link to="/all-orders" className="btn btn-outline-secondary">
            Cancel
          </Link>
        </div>
      </div>

      {/* Hidden Invoice for PDF - Improved Design */}
      <div style={{ display: "none" }}>
        <div ref={invoiceRef} style={{ padding: "30px", fontFamily: "'Helvetica', Arial, sans-serif", maxWidth: "700px", margin: "0 auto", color: "#333" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #f0ad4e", paddingBottom: "15px", marginBottom: "20px" }}>
            <div>
              <h1 style={{ fontSize: "24px", margin: "0", color: "#f0ad4e" }}>CAKE NPETALS STORE</h1>
              <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#777" }}>Invoice</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0", fontWeight: "bold" }}>Order ID: {orderData._id}</p>
              <p style={{ margin: "5px 0 0", fontSize: "12px" }}>Date: {formatDate(orderData?.createdAt)}</p>
            </div>
          </div>

          {/* Addresses */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
            <div style={{ width: "45%" }}>
              <h4 style={{ fontSize: "14px", margin: "0 0 8px", color: "#f0ad4e" }}>Ship To:</h4>
              <p style={{ margin: "2px 0", fontSize: "13px" }}>{fullName}</p>
              <p style={{ margin: "2px 0", fontSize: "13px" }}>{address?.address}</p>
              <p style={{ margin: "2px 0", fontSize: "13px" }}>{address?.city}, {address?.state} - {address?.postalCode}</p>
              <p style={{ margin: "2px 0", fontSize: "13px" }}>Phone: {orderData?.phone}</p>
            </div>
            <div style={{ width: "45%", textAlign: "right" }}>
              <h4 style={{ fontSize: "14px", margin: "0 0 8px", color: "#f0ad4e" }}>Seller Details:</h4>
              <p style={{ margin: "2px 0", fontSize: "13px" }}>CAKE NPETALS STORE</p>
              <p style={{ margin: "2px 0", fontSize: "13px" }}>support@cakenpetals.com</p>
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
              {orderData.cartItems?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                  {item.weight && <td style={{ padding: "10px" }}>
                    <strong>{item.name}</strong><br />
                    <span style={{ fontSize: "11px", color: "#777" }}>Weight: {item.weight}</span>
                  </td>}
                  <td style={{ padding: "10px", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>₹{item.price}</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Subtotal:</td>
                <td style={{ padding: "10px", textAlign: "right" }}>₹{orderData?.totalPrice || orderData?.totalAmount}</td>
              </tr>
              {/* <tr>
                <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Shipping:</td>
                <td style={{ padding: "10px", textAlign: "right" }}>₹0.00</td>
              </tr> */}
              <tr style={{ borderTop: "2px solid #f0ad4e" }}>
                <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontSize: "16px", fontWeight: "bold" }}>Grand Total:</td>
                <td style={{ padding: "10px", textAlign: "right", fontSize: "16px", fontWeight: "bold", color: "#f0ad4e" }}>₹{orderData.totalPrice || orderData.totalAmount}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div style={{ marginTop: "30px", borderTop: "1px dashed #ccc", paddingTop: "15px", fontSize: "11px", color: "#777", textAlign: "center" }}>
            <p>Thank you for shopping with DELHI BOOK STORE. For any queries, contact support@delhibookstore.com</p>
            <p>This is a computer generated invoice, no signature required.</p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default EditOrder;