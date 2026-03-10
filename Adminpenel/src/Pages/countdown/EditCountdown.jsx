import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const EditCountdown = () => {
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
  const { id } = useParams();

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= FETCH COUNTDOWN ================= */

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/countdown/get-single-countdown/${id}`
        );

        if (res.data?.success && res.data.data) {
          const data = res.data.data;

          setFormData({
            title: data.title || "",
            startTime: data.startTime || "",
            endTime: data.endTime || "",
            categoryId: data.categoryId?._id || data.categoryId || "",
          });

          setIsActive(Boolean(data.isActive));
        }
      } catch (error) {
        toast.error("Failed to load countdown");
        console.error(error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchCountdown();
  }, [id]);

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          // "https://api.cakenpetals.com/api/get-main-category"
           "https://api.cakenpetals.com/api/parent-product/get-parent-product"
        );
        setSubcategories(response.data?.data || []);
      } catch (error) {
        toast.error("Error fetching categories");
        console.error(error);
      }
    };

    fetchSubcategories();
  }, []);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryId) {
      toast.error("Please select category");
      return;
    }

    if (!formData.startTime) {
      toast.error("Please select start time");
      return;
    }

    if (!formData.endTime) {
      toast.error("Please select end time");
      return;
    }

    setIsLoading(true);

    try {
      const body = {
        title: formData.title?.trim(),
        startTime: formData.startTime, // ✅ time only
        endTime: formData.endTime,     // ✅ time only
        categoryId: formData.categoryId,
        isActive,
      };

      const res = await axios.post(
        `https://api.cakenpetals.com/api/countdown/update-countdown/${id}`,
        body
      );

      if (res.data?.success) {
        toast.success("Countdown updated successfully");

        setTimeout(() => {
          navigate("/all-countdown");
        }, 800);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update countdown"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (pageLoading) {
    return <p style={{ padding: 20 }}>Loading countdown...</p>;
  }

  /* ================= UI ================= */
  const categoryLists = subcategories.map((sub) => ({
    value: sub._id,
    label: `${sub?.parentProductName}`,
  }));


  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>Edit Countdown</h4>
        </div>

        <div className="links">
          <Link to="/all-countdown" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* CATEGORY */}
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
            <label className="form-label">Start Time</label>
            <input
              type="time"
              name="startTime"
              className="form-control"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* END TIME */}
          <div className="col-md-4">
            <label className="form-label">End Time</label>
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
            <button
              type="submit"
              className="bt cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Update Countdown"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCountdown;
