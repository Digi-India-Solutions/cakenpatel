import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const BASE_URL = "https://api.cakenpetals.com";

const AddEvents = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(null); // image preview

    const [formData, setFormData] = useState({
        EventTitle: "", image: null, ActiveonHome: false,
    });

    const eventTitleList = [
        { name: 'Wedding Decor Enquiry' },
        { name: 'Corporate Gifting Solutions' },
        { name: 'Partner with Us - Makeup Artists' },
        { name: 'School & College Events' }
    ]

    const eventTitleOptions = eventTitleList.map((sub) => ({
        value: sub.name,
        label: sub.name,
    }));

    // ── Handlers ────────────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "file") {
            const file = files[0];
            setFormData((prev) => ({ ...prev, image: file }));
            // Show preview
            if (file) setPreview(URL.createObjectURL(file));
        } else if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ── Validation ─────────────────────────────────────────────────────────
        if (!formData.EventTitle.trim()) {
            toast.error("Event Title is required");
            return;
        }
        if (!formData.image) {
            toast.error("Event Image is required");
            return;
        }

        try {
            setIsLoading(true);

            const data = new FormData();
            data.append("EventTitle", formData.EventTitle.trim());
            data.append("image", formData.image);
            data.append("ActiveonHome", formData.ActiveonHome);

            const res = await axios.post(`${BASE_URL}/api/event/create`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(res.data.message || "Event created successfully!");
            setTimeout(() => navigate("/all-events"), 1500);

        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating event");
            console.error("AddEvents error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <>
            <ToastContainer />

            {/* Breadcrumb */}
            <div className="bread">
                <div className="head">
                    <h4>Add Event</h4>
                </div>
                <div className="links">
                    <Link to="/all-events" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            {/* Form */}
            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>

                    {/* Event Title */}
                    {/* <div className="col-md-6">
                        <label htmlFor="EventTitle" className="form-label">
                            Event Title <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            id="EventTitle"
                            name="EventTitle"
                            className="form-control"
                            placeholder="Enter event title"
                            value={formData.EventTitle}
                            onChange={handleChange}
                            required
                        />
                    </div> */}

                    <div className="col-md-6">
                        <label className="form-label">Select Event Title</label>
                        <Select
                            options={eventTitleOptions}
                            value={eventTitleOptions.find(
                                (opt) => opt.value === formData?.EventTitle
                            )}
                            onChange={(selected) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    EventTitle: selected?.value || "",
                                }))
                            }
                            placeholder="Select Event Title"
                            isSearchable
                            classNamePrefix="react-select"
                        />
                    </div>

                    {/* Event Image */}
                    <div className="col-md-6">
                        <label htmlFor="image" className="form-label">
                            Event Image <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            className="form-control"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleChange}
                            required
                        />
                        <small className="text-muted">Accepted: JPG, PNG, WebP. Max 5MB.</small>

                        {/* Image Preview */}
                        {preview && (
                            <div className="mt-2">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{
                                        width: "120px", height: "120px",
                                        objectFit: "cover", borderRadius: "8px",
                                        border: "1px solid #ddd"
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Active on Home */}
                    <div className="col-md-6">
                        <label className="form-label d-block">Active on Homepage</label>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="ActiveonHome"
                                name="ActiveonHome"
                                className="form-check-input"
                                checked={formData.ActiveonHome}
                                onChange={handleChange}
                            />
                            <label htmlFor="ActiveonHome" className="form-check-label">
                                Show this event on homepage
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="col-12 text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={isLoading ? "not-allowed" : "allowed"}
                        >
                            {isLoading ? "Please Wait..." : "Add Event"}
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
};

export default AddEvents;