import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllReels = () => {
  const [reels, setReels] = useState([]);
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


  /* ================= FETCH REELS ================= */
  useEffect(() => {
    const fetchReels = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          "http://localhost:7000/api/reel/get-reels"
        );
        setIsLoading(false);
        setReels(res.data?.data || []);
      } catch (error) {
        setIsLoading(false);
        toast.error("Error fetching reels");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReels();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This reel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `http://localhost:7000/api/reel/delete-reel/${id}`
      );

      setReels((prev) => prev.filter((item) => item._id !== id));

      Swal.fire("Deleted!", "Reel deleted successfully.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete reel.", "error");
      console.error(error);
    }
  };

  if (isLoading) {
    return <p className="text-center mt-5">Loading reels...</p>;
  }

  return (
    <>
      <ToastContainer />

      {/* ===== BREADCRUMB ===== */}
      <div className="bread">
        <div className="head">
          <h4>All Reels List</h4>
        </div>
        {hasAccessAdd('reels') && <div className="links">
          <Link to="/add-reels" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>}
      </div>

      {/* ===== TABLE ===== */}
      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Preview</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Status</th>
              {hasAccessEdit('reels') && <th>Edit</th>}
              {hasAccessDelete('reels') && <th>Delete</th>}
            </tr>
          </thead>

          <tbody>
            {reels.length > 0 ? (
              reels.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>

                  {/* VIDEO PREVIEW */}
                  <td>
                    <video
                      src={`http://localhost:7000/${item?.video}`}
                      width="60"
                      height="80"
                      muted
                    />
                  </td>

                  <td>{item?.productId?.productName}</td>
                  <td>{item?.productId?.Variant[0]?.finalPrice}</td>

                  <td>
                    {item.activeOnHome ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </td>

                  {hasAccessEdit('reels') && <td>
                    <Link
                      to={`/edit-reels/${item?._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>}

                  {hasAccessDelete('reels') && <td>
                    <button
                      className="bt delete"
                      onClick={() => handleDelete(item?._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No reels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllReels;
