// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import html2pdf from "html2pdf.js";

// const EditOrder = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const invoiceRef = useRef();

//   const [orderData, setOrderData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [orderStatus, setOrderStatus] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [orderStatusMessage, setOrderStatusMessage] = useState("");

//   // Helper: format date nicely
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // Fetch order data
//   const getApiData = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`https://api.cakenpetals.com/api/checkout/${id}`);
//       setOrderData(res.data);
//       setOrderStatus(res.data.orderStatus);
//       setPaymentStatus(res.data.paymentStatus);
//       setOrderStatusMessage(res?.data?.massage || "");
//     } catch (error) {
//       console.error("Error fetching order data:", error);
//       toast.error("Failed to fetch order data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getApiData();
//   }, [id]);

//   // Update order
//   const handleUpdate = async () => {
//     try {
//       const updatedData = {
//         orderStatus,
//         paymentStatus,
//         orderStatusMassage: orderStatusMessage,
//         date: new Date(),
//       };
//       console.log("SSSSSDDD==>", orderData, updatedData);
//       const res = await axios.put(
//         `https://api.cakenpetals.com/api/checkout/${id}`,
//         updatedData
//       );
//       toast.success("Order updated successfully!");
//       setOrderData(res.data);
//       navigate("/all-orders");
//     } catch (error) {
//       console.error("Error updating order:", error);
//       toast.error("Failed to update order.");
//     }
//   };

//   // Download PDF invoice
//   const handleDownloadPDF = () => {
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

//   // Print special note card
//   const handlePrint = (note) => {
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Special Greeting Card</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f8f8f8; }
//             .card { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); max-width: 500px; margin: auto; border: 2px solid #ffc107; }
//             h2 { margin-bottom: 20px; color: #ff6a00; }
//             .label { font-size: 14px; color: #777; }
//             .value { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
//             .message { margin-top: 20px; font-style: italic; font-size: 18px; padding: 15px; border-left: 4px solid #ff9800; background: #fff8e1; }
//             @media print { body { background: white; } }
//           </style>
//         </head>
//         <body>
//           <div class="card">
//             <h2>🎁 Special Greeting</h2>
//             <div class="label">Occasion</div><div class="value">${note.occasion || "-"}</div>
//             <div class="label">Relation</div><div class="value">${note.relation || "-"}</div>
//             <div class="label">From</div><div class="value">${note.toName || "-"}</div>
//             <div class="message">"${note.message || ""}"</div>
//           </div>
//           <script>window.onload = function() { window.print(); window.close(); }</script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   if (loading) {
//     return (
//       <div className="text-center my-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!orderData) {
//     return <div className="alert alert-danger">Order not found.</div>;
//   }

//   const isOrderStatusDisabled =
//     orderStatus === "Delivered" || orderStatus === "Cancelled";
//   const isPaymentStatusDisabled = paymentStatus === "Success";

//   // Extract address safely (supports both flat and shippingAddress structures)
//   const address = orderData.shippingAddress || {
//     firstName: orderData.name,
//     lastName: "",
//     address: orderData.address,
//     city: orderData.city,
//     state: orderData.state,
//     postalCode: orderData.pin,
//   };

//   const fullName = `${address.firstName || ""} ${address.lastName || ""}`.trim() || orderData.name;
//   console.log("SSXXXXXSS=>", orderData)
//   return (
//     <>
//       <div className="bread d-flex justify-content-between align-items-center mb-3">
//         <h4>Update Order</h4>
//         <Link to="/all-orders" className="btn btn-outline-secondary">
//           <i className="fa-regular fa-circle-left me-1"></i> Back
//         </Link>
//       </div>

//       <div className="container-fluid mt-4">
//         <div className="row g-4">
//           {/* Left column: Order details */}
//           <div className="col-lg-8">
//             <div className="card shadow-sm">
//               <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
//                 <h5 className="mb-0">Order Details</h5>
//                 <button className="btn btn-light btn-sm" onClick={handleDownloadPDF}>
//                   📄 Download Order Receipt
//                 </button>
//               </div>
//               <div className="card-body">
//                 <table className="table table-bordered">
//                   <tbody>
//                     <tr><th>Order ID</th><td>{orderData._id}</td></tr>
//                     <tr><th>Customer Name</th><td>{fullName}</td></tr>
//                     <tr><th>Email</th><td>{orderData.email}</td></tr>
//                     <tr><th>Phone</th><td>{orderData.phone}</td></tr>
//                     <tr>
//                       <th>Address</th>
//                       <td>
//                         {address.address}, {address.city}, {address.state} - {address.postalCode}
//                       </td>
//                     </tr>
//                     <tr><th>Order Date</th><td>{new Date(orderData.orderDate).toLocaleString()}</td></tr>
//                     <tr><th>Order Delevry Date</th><td>{`${orderData?.delivery?.date} || ${orderData?.delivery?.time}`}</td></tr>
//                     <tr><th>Total Amount</th><td>₹{orderData.totalPrice || orderData.totalAmount}</td></tr>
//                     <tr>
//                       <th>Order Status</th>
//                       <td>
//                         <select
//                           className="form-select"
//                           value={orderStatus}
//                           onChange={(e) => setOrderStatus(e.target.value)}
//                           disabled={isOrderStatusDisabled}
//                         >
//                           <option value="Order Confirmed">Order Confirmed</option>
//                           <option value="Processing">Processing</option>
//                           <option value="Shipped">Shipped</option>
//                           <option value="Delivered">Delivered</option>
//                           <option value="Cancelled">Cancelled</option>
//                         </select>
//                       </td>
//                     </tr>
//                     <tr>
//                       <th>Status Message</th>
//                       <td>
//                         <textarea
//                           className="form-control"
//                           rows="2"
//                           value={orderStatusMessage}
//                           onChange={(e) => setOrderStatusMessage(e.target.value)}
//                           placeholder="Add an optional message for the customer..."
//                         />
//                       </td>
//                     </tr>
//                     <tr><th>Payment Mode</th><td>{orderData.paymentMode}</td></tr>
//                     <tr>
//                       <th>Payment Status</th>
//                       <td>
//                         <select
//                           className="form-select"
//                           value={paymentStatus}
//                           onChange={(e) => setPaymentStatus(e.target.value)}
//                           disabled={isPaymentStatusDisabled}
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

//             {/* Special Note Card */}
//             {orderData?.specialNote && (
//               <div className="card mt-4 border-0 shadow-sm">
//                 <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">🎁 Special Note</h5>
//                   <button className="btn btn-light btn-sm" onClick={() => handlePrint(orderData.specialNote)}>
//                     🖨 Print Card
//                   </button>
//                 </div>
//                 <div className="card-body">
//                   <div className="row g-3">
//                     <div className="col-md-6">
//                       <div className="p-3 bg-light rounded">
//                         <small className="text-muted">Occasion</small>
//                         <h6 className="mb-0">{orderData.specialNote.occasion}</h6>
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="p-3 bg-light rounded">
//                         <small className="text-muted">Relation</small>
//                         <h6 className="mb-0">{orderData.specialNote.relation}</h6>
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="p-3 bg-light rounded">
//                         <small className="text-muted">From</small>
//                         <h6 className="mb-0">{orderData.specialNote.toName || '-'}</h6>
//                       </div>
//                     </div>
//                     <div className="col-12">
//                       <div className="p-3 bg-white border rounded">
//                         <small className="text-muted">Message</small>
//                         <p className="mb-0 mt-1 fst-italic">"{orderData.specialNote.message}"</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Order Tracking Timeline */}
//             <div className="card mt-4 shadow-sm">
//               <div className="card-header">
//                 <h5 className="mb-0">Order Tracking Timeline</h5>
//               </div>
//               <div className="card-body">
//                 {orderData?.trackingOrders?.length > 0 ? (
//                   orderData.trackingOrders
//                     .sort((a, b) => new Date(b?.date) - new Date(a?.date))
//                     .map((track, idx) => (
//                       <div key={idx} className="tracking-item mb-3 p-3 border rounded">
//                         <div className="d-flex justify-content-between">
//                           <strong>{track.status}</strong>
//                           <small className="text-muted">{new Date(track.date).toLocaleString()}</small>
//                         </div>
//                         <p className="mb-0 text-muted">{track?.massage}</p>
//                       </div>
//                     ))
//                 ) : (
//                   <p className="text-muted">No tracking updates available.</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right column: Ordered Items */}
//           <div className="col-lg-4">
//             <div className="card shadow-sm">
//               <div className="card-header">
//                 <h5 className="mb-0">Items in this Order</h5>
//               </div>
//               <div className="card-body" style={{ maxHeight: "500px", overflowY: "auto" }}>
//                 {orderData.cartItems && orderData.cartItems.length > 0 ? (
//                   orderData.cartItems.map((item, index) => (
//                     <div key={index} className="mb-4 pb-3 border-bottom">
//                       <div className="d-flex gap-3">
//                         <img
//                           src={`https://api.cakenpetals.com/${item.image}`}
//                           alt={item.name}
//                           style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
//                         />
//                         <div className="flex-grow-1">
//                           <h6 className="mb-1">{item.name}</h6>
//                           <p className="mb-1 small">Quantity: {item.quantity}</p>
//                           <p className="mb-1 small">Weight: {item.weight}</p>
//                           <p className="mb-1 small">Price: ₹{item?.price}</p>
//                           {/* <p className="mb-1 small">
//                             Delivery: {item?.delivery?.date}
//                           </p> */}
//                           {item.massage && <p className="mb-0 small fst-italic">Note: {item.massage}</p>}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-muted">No items in this order.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="mt-4 d-flex gap-2">
//           <button className="btn btn-primary" onClick={handleUpdate}>
//             Update Order
//           </button>
//           <Link to="/all-orders" className="btn btn-outline-secondary">
//             Cancel
//           </Link>
//         </div>
//       </div>

//       {/* Hidden Invoice for PDF - Improved Design */}
//         <div>
//         <div
//           ref={invoiceRef}
//           style={{
//             display: "none",          // toggled to "block" inside handleDownloadPDF
//             padding: "30px",
//             fontFamily: "'Helvetica', Arial, sans-serif",
//             maxWidth: "700px",
//             margin: "0 auto",
//             color: "#333",
//             background: "#fff",       // white background needed for PDF
//           }}
//         >
//           {/* Header */}
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #f0ad4e", paddingBottom: "15px", marginBottom: "20px" }}>
//             <div>
//               <h1 style={{ fontSize: "24px", margin: "0", color: "#f0ad4e" }}>CAKE N PETALS STORE</h1>
//               <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#777" }}>Invoice</p>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <p style={{ margin: "0", fontWeight: "bold" }}>Order ID: {orderData._id}</p>
//               <p style={{ margin: "5px 0 0", fontSize: "12px" }}>Date: {formatDate(orderData?.createdAt)}</p>
//             </div>
//           </div>

//           {/* Addresses */}
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
//             <div style={{ width: "45%" }}>
//               <h4 style={{ fontSize: "14px", margin: "0 0 8px", color: "#f0ad4e" }}>Ship To:</h4>
//               <p style={{ margin: "2px 0", fontSize: "13px" }}>{fullName}</p>
//               <p style={{ margin: "2px 0", fontSize: "13px" }}>{address?.address}</p>
//               <p style={{ margin: "2px 0", fontSize: "13px" }}>{address?.city}, {address?.state} - {address?.postalCode}</p>
//               <p style={{ margin: "2px 0", fontSize: "13px" }}>Phone: {orderData?.phone}</p>
//             </div>
//             <div style={{ width: "45%", textAlign: "right" }}>
//               <h4 style={{ fontSize: "14px", margin: "0 0 8px", color: "#f0ad4e" }}>Seller Details:</h4>
//               <p style={{ margin: "2px 0", fontSize: "13px" }}>CAKE N PETALS STORE</p>
//               <p style={{ margin: "2px 0", fontSize: "13px" }}>support@cakenpetals.com</p>
//               <p style={{ margin: "2px 0", fontSize: "13px" }}>GST: xxxxxxxxxxx789</p>
//             </div>
//           </div>

//           {/* Items Table */}
//           <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "25px" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #f0ad4e" }}>
//                 <th style={{ padding: "10px", textAlign: "left" }}>Item</th>
//                 <th style={{ padding: "10px", textAlign: "center" }}>Qty</th>
//                 <th style={{ padding: "10px", textAlign: "right" }}>Unit Price</th>
//                 <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orderData.cartItems?.map((item, idx) => (
//                 <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>

//                   {/* ✅ FIXED: was {item.weight && <td>} — name never showed without weight */}
//                   <td style={{ padding: "10px" }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                       {/* Image src will be swapped to base64 before PDF render */}
//                       <img
//                         src={
//                           item?.image
//                             ? `https://api.cakenpetals.com/${item.image}`
//                             : "https://via.placeholder.com/60x60?text=No+Img"
//                         }
//                         alt={item?.name}
//                         style={{
//                           width: "60px", height: "60px",
//                           objectFit: "cover", borderRadius: "6px",
//                           border: "1px solid #eee", flexShrink: 0,
//                         }}
//                       />
//                       <div>
//                         <strong>{item.name}</strong>
//                         {item.weight && (
//                           <>
//                             <br />
//                             <span style={{ fontSize: "11px", color: "#777" }}>Weight: {item.weight}</span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </td>

//                   <td style={{ padding: "10px", textAlign: "center" }}>{item.quantity}</td>
//                   <td style={{ padding: "10px", textAlign: "right" }}>₹{item.price}</td>
//                   <td style={{ padding: "10px", textAlign: "right" }}>₹{(item.price * item.quantity).toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Subtotal:</td>
//                 <td style={{ padding: "10px", textAlign: "right" }}>₹{orderData?.totalPrice || orderData?.totalAmount}</td>
//               </tr>
//               <tr style={{ borderTop: "2px solid #f0ad4e" }}>
//                 <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontSize: "16px", fontWeight: "bold" }}>Grand Total:</td>
//                 <td style={{ padding: "10px", textAlign: "right", fontSize: "16px", fontWeight: "bold", color: "#f0ad4e" }}>
//                   ₹{orderData.totalPrice || orderData.totalAmount}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>

//           {/* Footer */}
//           <div style={{ marginTop: "30px", borderTop: "1px dashed #ccc", paddingTop: "15px", fontSize: "11px", color: "#777", textAlign: "center" }}>
//             <p>Thank you for shopping with CAKE N PETALS STORE. For any queries, contact cakenpetals111@gmail.com</p>
//             <p>This is a computer generated invoice, no signature required.</p>
//           </div>
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} />
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

  // ── Helper: format date ──
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  // ── Fetch order ──
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

  useEffect(() => { getApiData(); }, [id]);

  // ── Update order ──
  const handleUpdate = async () => {
    try {
      const updatedData = {
        orderStatus,
        paymentStatus,
        orderStatusMassage: orderStatusMessage,
        date: new Date(),
      };
      const res = await axios.put(`https://api.cakenpetals.com/api/checkout/${id}`, updatedData);
      toast.success("Order updated successfully!");
      setOrderData(res.data);
      navigate("/all-orders");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };

  // ══════════════════════════════════════════════════
  // KEY FIX: Convert remote image URL → base64 string
  // html2canvas cannot load cross-origin images,
  // so we fetch each image and convert it to a data URL
  // before generating the PDF.
  // ══════════════════════════════════════════════════
  const toBase64 = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.onerror = () => {
        // fallback: transparent 1×1 pixel
        resolve(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        );
      };
      img.src = url;
    });

  // ── Download PDF ──
  const handleDownloadPDF = async () => {
    // 1️⃣ Make invoice div temporarily visible so html2canvas can render it
    const el = invoiceRef.current;
    el.style.display = "block";

    // 2️⃣ Replace every <img> src with its base64 equivalent
    const imgs = el.querySelectorAll("img");
    const originalSrcs = [];
    await Promise.all(
      Array.from(imgs).map(async (img, i) => {
        originalSrcs[i] = img.src;
        img.src = await toBase64(img.src);
      })
    );

    // 3️⃣ Generate PDF
    const options = {
      margin: 0.5,
      filename: `${orderData?.shippingAddress?.firstName || "Order"}_${formatDate(orderData?.createdAt)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: false },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(options).from(el).save();

    // 4️⃣ Restore original src values & hide again
    Array.from(imgs).forEach((img, i) => { img.src = originalSrcs[i]; });
    el.style.display = "none";
  };

  // ── Print special note card ──
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

  if (!orderData) return <div className="alert alert-danger">Order not found.</div>;

  const isOrderStatusDisabled = orderStatus === "Delivered" || orderStatus === "Cancelled";
  const isPaymentStatusDisabled = paymentStatus === "Success";

  const address = orderData.shippingAddress || {
    firstName: orderData.name,
    lastName: "",
    address: orderData.address,
    city: orderData.city,
    state: orderData.state,
    postalCode: orderData.pin,
  };

  const fullName = `${address.firstName || ""} ${address.lastName || ""}`.trim() || orderData.name;

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

          {/* ── Left: Order details ── */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Order Details</h5>
                <button className="btn btn-light btn-sm" onClick={handleDownloadPDF}>
                  📄 Download Order Receipt
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
                      <td>{address.address}, {address.city}, {address.state} - {address.postalCode}</td>
                    </tr>
                    <tr><th>Order Date</th><td>{new Date(orderData.orderDate).toLocaleString()}</td></tr>
                    <tr>
                      <th>Order Delivery Date</th>
                      <td>{`${orderData?.delivery?.date} || ${orderData?.delivery?.time}`}</td>
                    </tr>
                    <tr><th>Total Amount</th><td>₹{orderData.totalPrice || orderData.totalAmount}</td></tr>
                    <tr>
                      <th>Order Status</th>
                      <td>
                        <select className="form-select" value={orderStatus}
                          onChange={(e) => setOrderStatus(e.target.value)}
                          disabled={isOrderStatusDisabled}>
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
                        <textarea className="form-control" rows="2" value={orderStatusMessage}
                          onChange={(e) => setOrderStatusMessage(e.target.value)}
                          placeholder="Add an optional message for the customer..." />
                      </td>
                    </tr>
                    <tr><th>Payment Mode</th><td>{orderData.paymentMode}</td></tr>
                    <tr>
                      <th>Payment Status</th>
                      <td>
                        <select className="form-select" value={paymentStatus}
                          onChange={(e) => setPaymentStatus(e.target.value)}
                          disabled={isPaymentStatusDisabled}>
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
                        <h6 className="mb-0">{orderData.specialNote.toName || "-"}</h6>
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

          {/* ── Right: Ordered Items ── */}
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
          <button className="btn btn-primary" onClick={handleUpdate}>Update Order</button>
          <Link to="/all-orders" className="btn btn-outline-secondary">Cancel</Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          HIDDEN INVOICE — for PDF generation
          display:none set here; handleDownloadPDF
          temporarily sets it to "block" before render
      ═══════════════════════════════════════════ */}
      <div>
        <div
          ref={invoiceRef}
          style={{
            display: "none",          // toggled to "block" inside handleDownloadPDF
            padding: "30px",
            fontFamily: "'Helvetica', Arial, sans-serif",
            maxWidth: "700px",
            margin: "0 auto",
            color: "#333",
            background: "#fff",       // white background needed for PDF
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #f0ad4e", paddingBottom: "15px", marginBottom: "20px" }}>
            <div>
              <h1 style={{ fontSize: "24px", margin: "0", color: "#f0ad4e" }}>CAKE N PETALS STORE</h1>
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
              <p style={{ margin: "2px 0", fontSize: "13px" }}>CAKE N PETALS STORE</p>
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

                  {/* ✅ FIXED: was {item.weight && <td>} — name never showed without weight */}
                  <td style={{ padding: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {/* Image src will be swapped to base64 before PDF render */}
                      <img
                        src={
                          item?.image
                            ? `https://api.cakenpetals.com/${item.image}`
                            : "https://via.placeholder.com/60x60?text=No+Img"
                        }
                        alt={item?.name}
                        style={{
                          width: "60px", height: "60px",
                          objectFit: "cover", borderRadius: "6px",
                          border: "1px solid #eee", flexShrink: 0,
                        }}
                      />
                      <div>
                        <strong>{item.name}</strong>
                        {item.weight && (
                          <>
                            <br />
                            <span style={{ fontSize: "11px", color: "#777" }}>Weight: {item.weight}</span>
                          </>
                        )}
                      </div>
                    </div>
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
                <td style={{ padding: "10px", textAlign: "right" }}>₹{orderData?.totalPrice || orderData?.totalAmount}</td>
              </tr>
              <tr style={{ borderTop: "2px solid #f0ad4e" }}>
                <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontSize: "16px", fontWeight: "bold" }}>Grand Total:</td>
                <td style={{ padding: "10px", textAlign: "right", fontSize: "16px", fontWeight: "bold", color: "#f0ad4e" }}>
                  ₹{orderData.totalPrice || orderData.totalAmount}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div style={{ marginTop: "30px", borderTop: "1px dashed #ccc", paddingTop: "15px", fontSize: "11px", color: "#777", textAlign: "center" }}>
            <p>Thank you for shopping with CAKE N PETALS STORE. For any queries, contact cakenpetals111@gmail.com</p>
            <p>This is a computer generated invoice, no signature required.</p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default EditOrder;

