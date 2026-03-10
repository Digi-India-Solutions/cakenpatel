import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const AddCountdown = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    categoryId: "",
  });

  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= FETCH SUBCATEGORIES ================= */

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:7000/api/get-main-category"
        );

        setSubcategories(res?.data?.data || []);
      } catch (error) {
        toast.error("Error fetching subcategories");
        console.error(error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryId) {
      toast.error("Please select subcategory");
      return;
    }

    if (!formData?.endTime) {
      toast.error("Please select countdown end time");
      return;
    }

    if (!formData?.startTime) {
      toast.error("Please select countdown start time");
      return;
    }

    setIsLoading(true);

    try {
      const body = {
        title: formData.title?.trim(),
        endTime: formData?.endTime,
        startTime: formData?.startTime,
        categoryId: formData?.categoryId,
        isActive,
      };

      const res = await axios.post(
        "http://localhost:7000/api/countdown/create-countdown",
        body
      );

      if (res.data?.success) {
        toast.success("Countdown created successfully");

        setTimeout(() => {
          navigate("/all-countdown");
        }, 800);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error creating countdown"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (pageLoading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  /* ================= UI ================= */
  const categoryLists = subcategories.map((sub) => ({
    value: sub._id,
    label: `${sub?.mainCategoryName}`,
  }));


  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>Manage Countdown</h4>
        </div>

        <div className="links">
          <Link to="/all-countdown" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form" style={{height:500}}>
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* CATEGORY */}
          {/* <div className="col-md-6">
            <label className="form-label">Main Category</label>
            <select
              name="categoryId"
              className="form-control"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select subcategory</option>
              {subcategories?.map((sub) => (
                <option key={sub?._id} value={sub?._id}>
                  {sub?.mainCategoryName}
                </option>
              ))}
            </select>
          </div> */}
          <div className="col-md-4">
            <label className="form-label"> Select Sub Category </label>

            <Select
              options={categoryLists}
              value={categoryLists.find(
                (opt) => opt.value === formData?.categoryId
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: selected?.value || "",
                }))
              }
              placeholder="Select Sub Category"
              isSearchable
              classNamePrefix="react-select"
            />
          </div>
          {/* TITLE */}
          {/* <div className="col-md-6">
            <label className="form-label">Countdown Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Order within"
              value={formData.title}
              onChange={handleChange}
            />
          </div> */}

          {/* START TIME */}
          <div className="col-md-4">
            <label className="form-label">Countdown Start Time</label>
            <input
              type="time"
              name="startTime"
              className="form-control"
              value={formData?.startTime}
              onChange={handleChange}
              required
            />
          </div>


          {/* END TIME */}
          <div className="col-md-4">
            <label className="form-label">Countdown End Time</label>
            <input
              type="time"
              name="endTime"
              className="form-control"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* ACTIVE */}
          <div className="col-12">
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: 18, height: 18 }}
              />
              <span style={{ fontWeight: 600 }}>
                {isActive ? "Show Countdown" : "Hide Countdown"}
              </span>
            </label>
          </div>

          {/* SUBMIT */}
          <div className="col-md-12 mt-3">
            <button type="submit" className="bt cursor-pointer" disabled={isLoading}>
              {isLoading ? "Saving..." : "Create Countdown"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCountdown;
