import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const BASE_URL = "https://api.cakenpetals.com";

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [preview, setPreview] = useState(null); // new image preview
    const [currentImage, setCurrentImage] = useState(""); // existing DB image

    const [formData, setFormData] = useState({
        EventTitle: "",
        image: null, // new file (optional)
        ActiveonHome: false,
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


    // ── Load existing event ────────────────────────────────────────────────────
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/event/${id}`);
                if (res.data.success) {
                    const ev = res.data.data;
                    setFormData({
                        EventTitle: ev.EventTitle || "",
                        image: null,
                        ActiveonHome: ev.ActiveonHome || false,
                    });
                    setCurrentImage(ev.image || "");
                }
            } catch (err) {
                toast.error("Failed to load event data");
                console.error(err);
            } finally {
                setPageLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    // ── Handlers ───────────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            const file = files[0];
            setFormData((prev) => ({ ...prev, image: file }));
            if (file) setPreview(URL.createObjectURL(file));
        } else if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.EventTitle.trim()) {
            toast.error("Event Title is required");
            return;
        }

        try {
            setIsLoading(true);
            const data = new FormData();
            data.append("EventTitle", formData.EventTitle.trim());
            data.append("ActiveonHome", formData.ActiveonHome);
            if (formData.image) data.append("image", formData.image); // only if changed

            const res = await axios.put(`${BASE_URL}/api/event/update/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(res.data.message || "Event updated successfully!");
            setTimeout(() => navigate("/all-events"), 1500);

        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating event");
            console.error("EditEvent error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="text-center py-5">
                <span className="spinner-border spinner-border-sm me-2" /> Loading event...
            </div>
        );
    }

    return (
        <>
            <ToastContainer />

            <div className="bread">
                <div className="head"><h4>Edit Event</h4></div>
                <div className="links">
                    <Link to="/all-events" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

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
                            Event Image{" "}
                            <small className="text-muted">(leave empty to keep current)</small>
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            className="form-control"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleChange}
                        />
                        <small className="text-muted">Accepted: JPG, PNG, WebP. Max 5MB.</small>

                        {/* Show new preview OR existing image */}
                        <div className="mt-2 d-flex gap-3 align-items-center flex-wrap">
                            {currentImage && !preview && (
                                <div>
                                    <p className="mb-1" style={{ fontSize: "12px", color: "#666" }}>Current image:</p>
                                    <img
                                        src={`${BASE_URL}/${currentImage}`}
                                        alt="current"
                                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
                                    />
                                </div>
                            )}
                            {preview && (
                                <div>
                                    <p className="mb-1" style={{ fontSize: "12px", color: "#666" }}>New image:</p>
                                    <img
                                        src={preview}
                                        alt="new preview"
                                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "2px solid #4caf50" }}
                                    />
                                </div>
                            )}
                        </div>
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
                            {isLoading ? "Please Wait..." : "Update Event"}
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
};

export default EditEvent;