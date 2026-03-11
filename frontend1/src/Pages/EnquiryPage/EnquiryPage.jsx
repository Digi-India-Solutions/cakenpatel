import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./enquiry.css";

const EnquiryPage = ({ title, subtitle, images, enquiryType }) => {
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", message: "",
    enquiryType: enquiryType
  });
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(false);

  // Scroll to top when switching between these pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [title]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        enquiryType: formData.enquiryType,
        enquiryTitle: title,
        userId: localStorage.getItem("userId")
      }
      const res = await axios.post(
        "https://api.cakenpetals.com/api/event/enquiry/create",
        payload
      )
      console.log("res.data.data=>", res.data.success)
      if (res.data.success === true) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        Swal.fire({
          icon: "success",
          title: "Request Submitted!",
          text: "Our team will get back to you shortly.",
          confirmButtonColor: "#2e6a7c"
        });
        // Clear form
        setFormData({ name: "", phone: "", email: "", message: "", enquiryType });
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };



  const fetchEvents = async () => {
    try {
      const res = await axios.get("https://api.cakenpetals.com/api/event/active");

      if (res.data.success) {
        setEvents(res.data.data.filter((item) => item.EventTitle.toLowerCase().includes(title.toLowerCase()))); // ✅ store all events
      }
    } catch (err) {
      console.error("fetchEvents error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [title]);

  return (
    <div className="enquiry-page-wrapper">

      {/* HEADER SECTION */}
      <div className="enquiry-hero text-center">
        <div className="container">
          <h1 className="enquiry-title">{title}</h1>
          <p className="enquiry-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-5">

          {/* LEFT: ENQUIRY FORM */}
          <div className="col-lg-5">
            <div className="enquiry-form-island p-4 p-md-5">
              <h3 className="mb-4" style={{ fontSize: "22px", fontWeight: "700", color: "#111" }}>
                Request a Callback
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Full Name *</label>
                  <input
                    type="text"
                    className="form-control custom-enquiry-input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control custom-enquiry-input"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Email Address</label>
                  <input
                    type="email"
                    className="form-control custom-enquiry-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Your Requirements *</label>
                  <textarea
                    className="form-control custom-enquiry-input"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us what you are looking for..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn w-100 enquiry-submit-btn" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Enquiry"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: RESPONSIVE GALLERY */}
          <div className="col-lg-7">
            <h3 className="mb-4" style={{ fontSize: "22px", fontWeight: "700", color: "#111" }}>
              Our Previous Work
            </h3>
            <div className="enquiry-gallery-grid">
              {events.map((imgUrl, index) => (
                <div key={index} className="gallery-item">
                  <img src={`https://api.cakenpetals.com/${imgUrl?.image}`} alt={`${title} gallery ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnquiryPage;