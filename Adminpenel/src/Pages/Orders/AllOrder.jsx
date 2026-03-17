import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllOrder = () => {
  const AdminData = JSON.parse(sessionStorage.getItem("AdminData"))
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://api.cakenpetals.com/api/checkouts");
      //console.log(response);
      setOrders(response.data);
      setFilteredOrders(response.data); // Initialize filtered orders
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (confirmation.isConfirmed) {
        await axios.delete(`https://api.cakenpetals.com/api/checkout/${orderId}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        setFilteredOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        toast.success("Order deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
    }
  };

  // Filter orders based on search query
  // const handleSearch = (e) => {
  //   const query = (e.target.value || "").toLowerCase().trim();
  //   setSearchQuery(query);

  //   if (!query) {
  //     setFilteredOrders(orders);
  //     return;
  //   }

  //   const filtered = orders.filter((order) => {
  //     // 1. Search in basic fields
  //     const basicMatch = [
  //       order._id,
  //       order.name,
  //       order.phone,
  //       order.email,
  //       order.city,
  //       order.pin,
  //       order.paymentMode,
  //       order.paymentStatus,
  //       order.orderStatus,
  //       order.totalPrice,
  //       order.transactionId,
  //     ].some((val) =>
  //       val?.toString().toLowerCase().includes(query)
  //     );

  //     // 2. Search in delivery
  //     const deliveryMatch =
  //       order.delivery?.date?.toLowerCase().includes(query) ||
  //       order.delivery?.time?.toLowerCase().includes(query);

  //     // 3. Search in special notes
  //     const noteMatch = Object.values(order.specialNote || {}).some((val) =>
  //       val?.toString().toLowerCase().includes(query)
  //     );

  //     // 4. Search in cart items
  //     const cartMatch = order.cartItems?.some((item) =>
  //       [item.name, item.weight, item.price]
  //         .some((val) =>
  //           val?.toString().toLowerCase().includes(query)
  //         )
  //     );

  //     // 5. Search in tracking orders
  //     const trackingMatch = order.trackingOrders?.some((track) =>
  //       [track.status, track.massage]
  //         .some((val) =>
  //           val?.toString().toLowerCase().includes(query)
  //         )
  //     );

  //     return (
  //       basicMatch || deliveryMatch || noteMatch || cartMatch || trackingMatch
  //     );
  //   });

  //   setFilteredOrders(filtered);
  // };

  const deepSearch = (obj, query) => {
    if (!obj) return false;

    if (
      typeof obj === "string" ||
      typeof obj === "number" ||
      typeof obj === "boolean"
    ) {
      return obj.toString().toLowerCase().includes(query);
    }

    if (Array.isArray(obj)) {
      return obj.some((item) => deepSearch(item, query));
    }

    if (typeof obj === "object") {
      return Object.values(obj).some((val) => deepSearch(val, query));
    }

    return false;
  };

  const handleSearch = (e) => {
    const query = (e.target.value || "").toLowerCase().trim();
    setSearchQuery(query);

    if (!query) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) =>
      deepSearch(order, query)
    );

    setFilteredOrders(filtered);
  };

  console.log("orders==>", orders)
  useEffect(() => {
    fetchOrders();
  }, []);

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

  const filterByDate = (orders, filter) => {
    if (!filter) return orders;

    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.orderDate);

      switch (filter) {
        case "today":
          return orderDate.toDateString() === now.toDateString();

        case "yesterday": {
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          return orderDate.toDateString() === yesterday.toDateString();
        }

        case "thisWeek": {
          const firstDay = new Date(now);
          firstDay.setDate(now.getDate() - now.getDay()); // Sunday

          return orderDate >= firstDay && orderDate <= now;
        }

        case "thisMonth":
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );

        case "thisYear":
          return orderDate.getFullYear() === now.getFullYear();

        default:
          return true;
      }
    });
  };

  useEffect(() => {
    let result = [...orders];

    // Apply date filter
    result = filterByDate(result, dateFilter);

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      result = result.filter((order) => deepSearch(order, query));
    }

    setFilteredOrders(result);
  }, [orders, searchQuery, dateFilter]);


  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Orders</h4>
        </div>
        <div className="links">
          {/* Additional links or actions can be placed here */}
        </div>
      </div>

      <div className="filteration">
        <div className="selects">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">All Orders</option>
            <option value="today">Today's Orders</option>
            <option value="yesterday">Yesterday's Orders</option>
            <option value="thisWeek">This Week's Orders</option>
            <option value="thisMonth">This Month's Orders</option>
            <option value="thisYear">This Year's Orders</option>
          </select>
        </div>
        <div className="search">
          <label htmlFor="search">Search </label>&nbsp;
          <input
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Order ID</th>
              <th scope="col">Items</th>
              <th scope="col">Final Price</th>
              <th scope="col">Order Status</th>
              <th scope="col">Payment Mode</th>
              <th scope="col">Payment Status</th>
              <th scope="col">Order Date</th>
              {hasAccessDelete("orders") && <th scope="col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {hasAccessEdit("orders") ? <Link to={`/order-details/${order._id}`}>{order._id}</Link> : <Link >{order?._id}</Link>}
                  </td>
                  <td>{order.cartItems.length}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.paymentMode}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  {hasAccessDelete("orders") && <td>
                    <button
                      className="bt delete"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllOrder;
