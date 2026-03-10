import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllCakeBanners = () => {
  const [banners, setBanners] = useState([]);
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


  /* ================= FETCH BANNERS ================= */
  useEffect(() => {
    fetchCakeBanners();
  }, []);

  const fetchCakeBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:7000/api/cake-banner/get-cake-banner"
      );
      setLoading(false);
      setBanners(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch cake banners", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Cake Banner?",
      text: "This banner will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `http://localhost:7000/api/cake-banner/delete-cake-banner/${id}`
      );

      setBanners((prev) => prev.filter((b) => b._id !== id));

      Swal.fire("Deleted!", "Cake banner removed.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to delete cake banner", "error");
      console.error(error);
    }
  };


  if (loading) {
    return <p className="text-center mt-5">Loading level banners...</p>;
  }

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>All level Banners</h4>
        </div>
        {hasAccessAdd('cakeBanner') && <div className="links">
          <Link to="/add-cake-banner" className="add-new">
            Add level Banner
          </Link>
        </div>}
      </div>

      <section className="main-table">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Banner Slot</th>
              <th>Preview</th>
              {hasAccessEdit('cakeBanner') && <th>Edit</th>}
              {hasAccessDelete('cakeBanner') && <th>Delete</th>}
            </tr>
          </thead>

          <tbody>
            {banners.length > 0 ? (
              banners.map((banner, index) => (
                <tr key={banner._id}>
                  <td>{index + 1}</td>
                  <td>{banner?.titel}</td>
                  <td className="text-capitalize">
                    {banner?.bannerKey === "cakeBanner1"
                      ? "Level 1"
                      : banner?.bannerKey === "cakeBanner2" ? "Level 2" :
                        banner?.bannerKey === "cakeBanner3" ? "Level 3" :
                          "Level 4"}
                  </td>

                  <td>
                    <img
                      src={`http://localhost:7000/${banner?.cakeBanner}`}
                      alt="Cake Banner"
                      style={{
                        width: "220px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </td>

                {hasAccessEdit('cakeBanner') &&  <td>
                    <Link
                      to={`/edit-cake-banner/${banner?._id}`}
                      className="bt edit"
                    >
                      Edit
                    </Link>
                  </td>}

                 {hasAccessDelete('cakeBanner') && <td>
                    <button
                      className="bt delete"
                      onClick={() => handleDelete(banner?._id)}
                    >
                      Delete
                    </button>
                  </td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No cake banners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllCakeBanners;
