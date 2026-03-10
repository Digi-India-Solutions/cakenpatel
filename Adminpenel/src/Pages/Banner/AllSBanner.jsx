import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllSBanner = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const AdminData = JSON.parse(sessionStorage.getItem("AdminData"))

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://api.cakenpetals.com/api/get-banners"
      );
      if (response.data.success) {
        setBanners(response.data.data);
      } else {
        toast.error("Failed to load banners");
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("An error occurred while fetching banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`https://api.cakenpetals.com/api/delete-banner/${id}`);
        setBanners(banners.filter((banner) => banner._id !== id));
        toast.success("Banner deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete the banner");
    }
  };

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

  const handleStatus = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to change status?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      });

      if (result.isConfirmed) {
        await axios.put(`https://api.cakenpetals.com/api/banner/status-banner/${id}`, { bannerStatus: !banners?.find((banner) => banner?._id === id)?.status });
        fetchBanners();
        toast.success("Status changed successfully");
      }
    } catch (error) {
      toast.error("Failed to change the status");
    }
  }
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Banners</h4>
        </div>
        {hasAccessAdd("banners") && <div className="links">
          <Link to="/add-banner" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>}
      </div>

      {/* <div className="filteration">
        <div className="search">
          <label htmlFor="search">Search </label> &nbsp;
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search by name..."
          />
        </div>
      </div> */}

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Banner Type</th>
              <th scope="col">Show in home page</th>
              {hasAccessEdit("banners") && <th scope="col">Edit</th>}
              {hasAccessDelete("banners") && <th scope="col">Delete</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : banners.length > 0 ? (
              banners.map((banner, index) => (
                <tr key={banner._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{banner.bannerName}</td>
                  <td>
                    <img
                      src={`https://api.cakenpetals.com/${banner.bannerImage}`}
                      alt={banner.bannerName}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  <td>{banner.bannerType}</td>
                  <td>
                    <input
                      type="checkbox"
                      readOnly
                      onChange={(e) => handleStatus(banner._id, e.target.value)}
                      checked={banner?.bannerStatus === "True"}
                    />{" "}
                    {banner?.bannerStatus}
                  </td>
                  {hasAccessEdit("banners") && <td>
                    <Link to={`/edit-banner/${banner._id}`} className="bt edit">
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>}
                  {hasAccessDelete("banners") && <td>
                    <button
                      onClick={() => handleDelete(banner?._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No banners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllSBanner;
