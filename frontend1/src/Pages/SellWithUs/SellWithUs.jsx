import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./sellwithus.css";

const SellWithUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Request Submitted!",
        text: "Our team will contact you shortly to onboard you as a seller.",
        confirmButtonColor: "#2e6a7c",
      });
      setFormData({ name: "", phone: "", email: "", city: "", message: "" });
      setLoading(false);
    }, 1200);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const stats = [
    { icon: "bi-people-fill", top: "7+ Millions", bottom: "Happy Customers" },
    { icon: "bi-buildings-fill", top: "300+", bottom: "Cities Coverage" },
    { icon: "bi-wallet2", top: "Timely", bottom: "Payments" },
  ];

  const benefits = [
    { title: "Low Cost", desc: "One of the most cost-effective online businesses to partner with. Zero listing fees." },
    { title: "Growth Guaranteed", desc: "Our wide network ensures your products reach thousands of new customers daily." },
    { title: "Transparency", desc: "We believe in fair, transparent business practices, providing opportunities to scale." },
    { title: "Dedicated Manager", desc: "Get a dedicated account manager to handle orders and process issues smoothly." },
    { title: "Timely Payment", desc: "Payments are processed strictly on time via NEFT for absolute authenticity." },
  ];

  const faqs = [
    { q: "Why Should You Choose CakenPetals as Your Seller?", a: "We have earned customer trust and reputation. We provide you with an extensive network to take your products to customers all over India." },
    { q: "How Do I Sell My Product on CakenPetals?", a: "Fill out the form above. Our vendor onboarding team will contact you to explain the procedure and verify your details." },
    { q: "Do You Charge For Listing Products?", a: "No! Listing your catalogue online with us is absolutely free of charge." },
    { q: "How do you make the Payment?", a: "Payments are securely processed directly to your bank account via NEFT." },
    { q: "When Can I start selling?", a: "Upon completion of your seller profile and verification of your required documents, you can start immediately." },
    { q: "What Products Can I Sell?", a: "You can sell premium cakes, flowers, plants, and gift items. We only accept quality products in excellent condition." },
  ];

  return (
    <div className="sell-page-wrapper bg-light pb-5">
      {/* BREADCRUMB */}
      <section className="breadCrumb bg-white border-bottom">
        <div className="container py-3">
          <Link to="/" style={{ color: "#007185", fontWeight: "500" }}>Home</Link>
          <span style={{ margin: "0 8px", color: "#666" }}>&gt;</span>
          <span style={{ color: "#666" }}>Sell With Us</span>
        </div>
      </section>

      {/* HERO SECTION */}
      <div className="sell-hero text-center py-5">
        <div className="container">
          <h1 className="fw-bold text-dark mb-3">Partner with CakenPetals</h1>
          <p className="text-muted fs-5">Join India's fastest-growing premium gifting platform.</p>
        </div>
      </div>

      <div className="container">
        {/* TOP SPLIT SECTION */}
        <div className="row g-5 align-items-start mb-5">
          
          {/* LEFT: INFO & STATS */}
          <div className="col-lg-6">
            <h2 className="SuperTitle mb-3">Sell with Us</h2>
            <p className="text-muted mb-5 lh-lg">
              In a diverse country like India, premium cakes, fresh flowers, and thoughtful gifts will never go out of fashion. Partner with us and scale your business to new heights.
            </p>
            
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-box d-flex align-items-center gap-3 p-3 bg-white shadow-sm rounded-3 mb-3">
                  <div className="stat-icon-wrapper" style={{ backgroundColor: "#e8f4f8", color: "#2e6a7c", padding: "15px", borderRadius: "10px" }}>
                    <i className={`bi ${stat.icon} fs-3`}></i>
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold" style={{ color: "#111" }}>{stat.top}</h5>
                    <span className="text-muted" style={{ fontSize: "14px" }}>{stat.bottom}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: LEAD FORM */}
          <div className="col-lg-6">
            <div className="sell-form-island p-4 p-md-5 bg-white shadow rounded-4">
              <h3 className="mb-4 fw-bold">Enter your Details</h3>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">Your Name *</label>
                    <input type="text" className="form-control custom-input" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">Phone Number *</label>
                    <input type="tel" className="form-control custom-input" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">Email *</label>
                    <input type="email" className="form-control custom-input" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">City *</label>
                    <input type="text" className="form-control custom-input" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary small">What do you sell? *</label>
                    <textarea className="form-control custom-input" name="message" rows="3" value={formData.message} onChange={handleChange} required></textarea>
                  </div>
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn w-100 sell-submit-btn" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* BENEFITS SECTION */}
        <div className="mt-5 pt-5 border-top">
          <h2 className="SuperTitle text-center mb-5">Benefits of Partnering</h2>
          <div className="row g-4">
            {benefits.map((b, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="benefit-card p-4 bg-white shadow-sm rounded-4 h-100">
                  <h5 className="fw-bold mb-3" style={{ color: "#2e6a7c" }}>{b.title}</h5>
                  <p className="text-muted small lh-lg mb-0">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs SECTION */}
        <div className="mt-5 pt-5 border-top mb-5">
          <h2 className="SuperTitle text-center mb-5">Frequently Asked Questions</h2>
          <div className="faq-container mx-auto" style={{ maxWidth: "800px" }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item bg-white shadow-sm rounded-3 mb-3 overflow-hidden">
                <div 
                  className="faq-question p-4 d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleFaq(i)}
                  style={{ cursor: "pointer" }}
                >
                  <h6 className="mb-0 fw-bold" style={{ color: activeFaq === i ? "#2e6a7c" : "#333" }}>{faq.q}</h6>
                  <i className={`bi ${activeFaq === i ? "bi-dash-lg" : "bi-plus-lg"} fs-5`} style={{ color: "#df4444" }}></i>
                </div>
                <div className={`faq-answer px-4 pb-4 ${activeFaq === i ? "d-block" : "d-none"}`}>
                  <p className="text-muted small mb-0 lh-lg">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellWithUs;
