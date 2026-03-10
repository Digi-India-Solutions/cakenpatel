import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

const AllRecommendedCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:7000/api/recommended-category/get-recommended-category"
      );
      setLoading(false);
      setCategories(res.data?.data || []);
    } catch {
      setLoading(false);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete?",
      text: "This category will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(
      `http://localhost:7000/api/recommended-category/delete-recommended-category/${id}`
    );

    setCategories((prev) => prev.filter((c) => c._id !== id));
    toast.success("Deleted successfully");
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Recommended Categories</h4>
        </div>
        {hasAccessAdd('recommendedCategory') && <div className="links">
          <Link to="/add-recommended-category" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>}
      </div>
      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Status</th>
              {(hasAccessDelete('recommendedCategory') || hasAccessEdit('recommendedCategory')) && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {categories.length ? (
              categories.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>
                    <img
                      src={`http://localhost:7000/${item.image}`}
                      width="50"
                      alt=""
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>
                    <span className={`badge ${item.ActiveonHome ? "bg-success" : "bg-secondary"}`}>
                      {item.ActiveonHome ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    {hasAccessEdit('recommendedCategory') && <Link
                      to={`/edit-recommended-category/${item._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>}
                    &nbsp;
                    {hasAccessDelete('recommendedCategory') && <button
                      onClick={() => handleDelete(item._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No categories found</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllRecommendedCategory;
