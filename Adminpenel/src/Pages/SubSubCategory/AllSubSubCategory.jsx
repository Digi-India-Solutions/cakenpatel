import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import noImage from "../../asses/logo512.png";

const AllSubSubCategory = () => {
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  /* ================= FETCH SUB-SUBCATEGORIES ================= */
  useEffect(() => {
    const fetchSubSubcategories = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          "https://api.cakenpetals.com/api/second-sub-category/get-second-sub-category"
        );
        setIsLoading(false);
        setSubSubcategories(res.data?.data || []);
      } catch (error) {
        setIsLoading(false);
        toast.error("Error fetching Child categories");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubSubcategories();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This Child category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `https://api.cakenpetals.com/api/second-sub-category/delete-second-sub-category/${id}`
      );

      setSubSubcategories((prev) =>
        prev.filter((item) => item._id !== id)
      );

      Swal.fire("Deleted!", "Child category deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete Child category.", "error");
      console.error(error);
    }
  };

  if (isLoading) {
    return <p className="text-center mt-5">Loading Child categories...</p>;
  }

const filteredSecondSubCategory = subSubcategories.filter((subSubcategorie) =>
  subSubcategorie?.secondsubcategoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  subSubcategorie?.subCategoryId?.subcategoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  subSubcategorie?.mainCategoryId?.mainCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
);


  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>All Child category List</h4>
        </div>
        {hasAccessAdd('subCategory') &&
          <div className="links">
            <Link to="/add-sub-subcategory" className="add-new">
              Add New <i className="fa-solid fa-plus"></i>
            </Link>
          </div>}
      </div>
      <div className="filteration">
        <div className="search">
          <label htmlFor="search">Search</label> &nbsp;
          <input
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Image</th>
              <th>Main Category</th>
              <th>Sub Category</th>
              <th>Child Category</th>
              {hasAccessEdit('subCategory') && <th>Edit</th>}
              {hasAccessDelete('subCategory') && <th>Delete</th>}
            </tr>
          </thead>

          <tbody>
            {filteredSecondSubCategory?.length > 0 ? (
              filteredSecondSubCategory?.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td><img src={`https://api.cakenpetals.com/${item?.image}`} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noImage;
                  }} alt={item?.secondsubcategoryName} style={{ width: "50px", height: "50px" }} /></td>
                  <td>{item?.mainCategoryId?.mainCategoryName || "—"}</td>

                  <td>{item?.subCategoryId?.subcategoryName || "—"}</td>

                  <td>{item?.secondsubcategoryName}</td>

                  {hasAccessEdit('subCategory') && <td>
                    <Link
                      to={`/edit-sub-subcategory/${item._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>}

                  {hasAccessDelete('subCategory') && <td>
                    <button
                      className="bt delete"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No Child categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllSubSubCategory;
