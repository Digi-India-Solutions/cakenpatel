import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllSubCategory = () => {
  const [subcategories, setSubcategories] = useState([]);
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

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://api.cakenpetals.com/api/get-subcategory"
        );
        setIsLoading(false);
        setSubcategories(response.data.data); // assuming the data is in response.data.data
      } catch (error) {
        setIsLoading(false);
        toast.error("Error fetching subcategories");
        console.error("Error fetching subcategories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(
          `https://api.cakenpetals.com/api/delete-subcategory/${id}`
        );
        setSubcategories(
          subcategories.filter((subcategory) => subcategory._id !== id)
        );
        Swal.fire("Deleted!", "Your subcategory has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error deleting the subcategory.",
          "error"
        );
        console.error("Error deleting subcategory:", error);
      }
    }
  };

  if (isLoading) {
    return <p>Loading subcategories...</p>; // Loading state
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Sub Category List</h4>
        </div>
        {hasAccessAdd('category') && <div className="links">
          <Link to="/add-subcategory" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>}
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              {/* <th scope="col"> Image</th> */}
              {/* <th scope="col"> Banner</th> */}
              <th scope="col">Main Category Name</th>
              <th scope="col">Sub Category Name</th>
              {hasAccessEdit('category') && <th scope="col">Edit</th>}
              {hasAccessDelete('category') && <th scope="col">Delete</th>}
            </tr>
          </thead>
          <tbody>
            {subcategories.length > 0 ? (
              subcategories.map((subcategory, index) => (
                <tr key={subcategory._id}>
                  <th scope="row">{index + 1}</th>
                  {/* <th><img src={`https://api.cakenpetals.com/${subcategory?.image}`} alt={subcategory?.subcategoryName} /></th> */}
                  {/* <th><img src={`https://api.cakenpetals.com/${subcategory?.banner}`} alt={subcategory.subcategoryName} /></th> */}
                  <td>{subcategory?.categoryName?.mainCategoryName}</td>
                  <td>{subcategory.subcategoryName}</td>
                  {hasAccessEdit('category') && <td>
                    <Link
                      to={`/edit-subcategory/${subcategory._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>}
                  {hasAccessDelete('category') && <td>
                    <button
                      className="bt delete"
                      onClick={() => handleDelete(subcategory._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No sub categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllSubCategory;
