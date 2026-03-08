import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MODULE_NAME = "ParentProduct";

const AllParentProduct = () => {
  const [parentProducts, setParentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ safe session parsing
  const adminData = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("AdminData")) || {};
    } catch {
      return {};
    }
  }, []);

  // ✅ unified permission checker
  const hasAccess = (type) => {
    return (
      adminData?.role === "Admin" ||
      adminData?.permissions?.[MODULE_NAME]?.[type] === true
    );
  };

  // ✅ fetch data
  useEffect(() => {
    const fetchParentProducts = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          "https://api.cakenpetals.com/api/parent-product/get-parent-product"
        );
        setIsLoading(false);
console.log("edit-perant-product=>" ,response.data.data)
        setParentProducts(response?.data?.data || []);
      } catch (error) {
        setIsLoading(false);
        toast.error("Error fetching Parent Products");
        console.error("Error fetching Parent Products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParentProducts();
  }, []);

  // ✅ delete handler
  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      await axios.delete(
        `https://api.cakenpetals.com/api/parent-product/delete-parent-product/${id}`
      );

      // ✅ optimistic update
      setParentProducts((prev) =>
        prev.filter((item) => item?._id !== id)
      );

      toast.success("Parent Product deleted successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error deleting Parent Product"
      );
      console.error("Error deleting Parent Product:", error);
    }
  };

  // ✅ loading state
  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <h5>Loading Parent Products...</h5>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bread">
        <div className="head">
          <h4>All Parent Product List</h4>
        </div>

        {hasAccess("write") && (
          <div className="links">
            <Link to="/add-perant-product" className="add-new">
              Add New <i className="fa-solid fa-plus"></i>
            </Link>
          </div>
        )}
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Name</th>
              {hasAccess("update") && <th>Edit</th>}
              {hasAccess("delete") && <th>Delete</th>}
            </tr>
          </thead>

          <tbody>
            {parentProducts.length > 0 ? (
              parentProducts.map((item, index) => (
                <tr key={item?._id}>
                  <td>{index + 1}</td>

                  {/* ⚠️ adjust if your backend field differs */}
                  <td>{item?.parentProductName}</td>

                  {hasAccess("update") && (
                    <td>
                      <Link
                        to={`/edit-perant-product/${item?._id}`}
                        className="bt edit"
                      >
                        Edit <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </td>
                  )}

                  {hasAccess("delete") && (
                    <td>
                      <button
                        className="bt delete"
                        onClick={() => handleDelete(item?._id)}
                      >
                        Delete <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No Parent Products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllParentProduct;