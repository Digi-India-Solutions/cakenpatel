import React, { useEffect, useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCcAmazonPay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Swel from 'sweetalert2';
import insta from "../../images/fa-insta.png"
import facebook from "../../images/facebook_logo.svg"
import linkedin from "../../images/linkdin_logo.svg"
import xtwiter from "../../images/twitter-x.svg"

// ========================================================
// PERFORMANCE FIX: GLOBAL CACHE
// Prevents the footer from re-downloading categories from
// the server every time a user navigates to a new page.
// ========================================================
let cachedFooterCategories = null;

const Footer = () => {
  const navigate = useNavigate();

  // Use cached data immediately if we have it
  const [categories, setCategories] = useState(cachedFooterCategories || []);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      // PERFORMANCE FIX: If data is already cached, do not ping the server!
      if (cachedFooterCategories) return;

      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/get-category-with-subcategory`
        );

        if (
          res.data.message ===
          "Categories with subcategories retrieved successfully"
        ) {
          cachedFooterCategories = res.data.data; // Save to global cache
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Footer API Error:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubscribe = async (e) => {
    if (!email) {
      Swel.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Email is required',
      })
      return
    }

    try {
      const res = await axios.post(
        `https://api.cakenpetals.com/api/subscribe-email/add-subscribe`,
        {
          email: email,
        }
      );
      console.log("ZZZZZXXXXXX==>", res)
      if (res.data.success === true) {
        Swel.fire({
          icon: 'success',
          title: 'Success',
          text: 'Email subscribed successfully',
        })
        setEmail('')
      } else {
        Swel.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data.message,
        })
      }
    } catch (error) {
      console.log("Footer API Error:==>", error);
    }
  };

  return (
    <footer className="fnp-footer">
      {/* ================= TOP FOOTER ================= */}
      <div className="container">
        <div className="row footer-top">

          {/* Policy Info */}
          <div className="col-lg-3 col-md-4 footer-column col-sm-6 col-6">
            <h3 className="" style={{ color: 'white', fontWeight: 'bold' }}>Policy Info</h3>
            <ul className="text-light">
              <li className="text-light"><Link to="/terms-&-conditions">Terms & Conditions</Link></li>
              <li><Link to="/cancellation-refund-policy">Cancellation & Refund Policy</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              {/* <li><Link to="#">Terms of Use</Link></li>
              <li><Link to="#">Disclaimer</Link></li> */}
            </ul>
          </div>

          {/* About Company */}
          <div className="col-lg-3 col-md-4 footer-column col-sm-6 col-6">
            <h3 className="" style={{ color: 'white', fontWeight: 'bold' }}>About Company</h3>
            <ul>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/refer">Refer and Earn</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* API CATEGORY SECTION */}
          {/* <div className="col-lg-2 col-md-4 footer-column col-sm-6 col-6">
            <h3 className="text-dark" style={{color:'white', fontWeight:'bold'}}>Our Bakery</h3>
            <ul className="footer-scroll">
              {categories.map((cat) =>
                cat.subcategories.map((sub, index) => (
                  <li key={index}>
                    
                    <div onClick={() => {
                      navigate(`/product-related/${sub.subcategoryName.replace(/\s+/g, "-")}`,
                        { state: { id: sub?._id, status: 'category' } });
                    }}
                      style={{ cursor: 'pointer' }}
                    >
                      {sub?.subcategoryName?.charAt(0).toUpperCase() + sub?.subcategoryName?.slice(1)}
                    </div>

               
                  </li>
                ))
              )}
            </ul>
          </div> */}

          {/* Need Help */}
          <div className="col-lg-3 col-md-4 footer-column col-sm-6 col-6">
            <h3 className="" style={{ color: 'white', fontWeight: 'bold' }}>Need Help ?</h3>
            <ul>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/wishlist">Whislist</Link></li>
            </ul>
          </div>

          {/* International */}
          {/* <div className="col-lg-2 col-md-4 footer-column col-sm-6 col-6">
            <h6 className="text-dark">International Presence</h6>
            <ul>
              <li>Dubai</li>
              <li>Qatar</li>
              <li>Saudi Arabia</li>
              <li>Singapore</li>
            </ul>
          </div> */}

          {/* Subscribe */}
          <div className="col-lg-3 footer-column col-md-8 col-6">
            <h3 className="" style={{ color: 'white', fontWeight: 'bold' }}>Subscribe Now</h3>
            <p className="subscribe-text">
              Get updates on promotions and offers coupons.
            </p>

            <div className="subscribe-box">
              <input type="email" onChange={(e) => setEmail(e.target.value)} required placeholder="Enter email address" />
              <button onClick={() => handleSubscribe()}>
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>

          <div className="social-icons" >
            <a href="#"><img src={insta} /></a>
            <a href="#"><img src={facebook} /></a>
            <a href="#"><img src={linkedin} /></a>
            <a href="#"><img src={xtwiter} /></a>
          </div>

        </div>
      </div>

      {/* ================= MIDDLE INFO ================= */}
      <div className="footer-middle">
        <div className="container text-center">
          <p>
            Company Name: CAKENPETALS | FFSAI - 12725052000957 |
            Regd. Office: A 23 sanjay nagar ghaziabad - 201002
          </p>
          {/* CIN: Hat jaaega Footer se &
            FFSAI - 12725052000957 */}
          <p>
            Telephone No.: +91-9211929555 | Grievance Officer: Support Team
          </p>
          {/* <Link to="#" className="csr-link">
           Corporate Social Responsibility (CSR) Policy
            Designed By Kreative Captains Pvt.Ltd
          </Link> */}
          <Link to="https://kreativecaptains.com" className="csr-link" >
            {/* Corporate Social Responsibility (CSR) Policy */}
            Designed By Kreative Captains Pvt.Ltd
          </Link>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="footer-bottom">
        <div className="container d-flex justify-content-between align-items-center flex-wrap">

          {/* <p className="mb-0">
            © 2024 Cake Bakery. All rights reserved.
          </p> */}

          {/* <div className="payment-icons">
            <FaCcAmazonPay className="fs-3 " />
          </div> */}

        </div>
      </div>
    </footer>
  );
};

export default Footer;