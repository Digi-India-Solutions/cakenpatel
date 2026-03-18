import React from "react";
import "./App.css";
import "./allResponsive.css";
import "./responsive.css";
// import { HashRouter as Router } from 'react-router-dom';
// import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./Components/Header/Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import AboutUs from "./Components/AboutUs/AboutUs";
import ContactUs from "./Pages/ContactUs/ContactUs";
import AllCakes from "./Pages/AllCakes/AllCakes";
import SubSubCat from "./Pages/SubSubCategories/SubSubCategories";
import AllCandles from "./Pages/AllCandles/AllCandles";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import Cart from "./Pages/Cart/Cart";
import Login from "./Pages/Login/Login";
// import AllProducts from "./Components/AllProducts/AllProducts";
import TermsConditions from "./Pages/FooterPages/TermsConditions";
import PrivacyPolicy from "./Pages/FooterPages/PrivacyPolicy";
import FAQ from "./Pages/FooterPages/FAQ";
import AllProducts from "./Pages/AllProducts/AllProducts";
import CheckOut from "./Pages/checkout/Checkout";
import SuccessPage from "./Pages/successpage/SuccessPage";
import Profile from "./Pages/Profile/Profile";
import OrderTracking from "./Pages/OrderTracking/OrderTracking";
import QA from "./Pages/Faq/Faq"
import ReferAndEarn from "./Pages/ReferEarn/ReferEarn";
import SubSubcategory from "./Pages/SubSubCategories/SubSubCategories"
import Wishlist from './Components/Wishlist/Wishlist'
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import AllProductByChildCategory from "./Pages/AllProductByChildCategory/AllProductByChildCategory";
import CancellationRefund from "./Pages/FooterPages/CancellationRefund";
import EggLess from "./Components/EggLess/EggLess";
import WhatsAppChat from "./Components/WhatsApp/WhatsApp";

// ✅ NEW IMPORT FOR REUSABLE ENQUIRY COMPONENT
import EnquiryPage from "./Pages/EnquiryPage/EnquiryPage";
import SellWithUs from "./Pages/SellWithUs/SellWithUs";

const App = () => {

  // =======================================================
  // PLACEHOLDER IMAGE ARRAYS FOR THE 4 PAGES
  // You can replace these URLs with actual paths to your local 
  // images (e.g., import pic1 from '../../images/pic1.jpg') later
  // =======================================================
  const weddingImages = [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
  ];

  const corporateImages = [
    "https://images.unsplash.com/photo-1513885045260-6b3086b24c17?w=600&q=80",
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
  ];

  const makeupImages = [
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80",
    "https://images.unsplash.com/photo-1512496015851-a1dc8a47cd43?w=600&q=80",
    "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600&q=80",
  ];

  const schoolImages = [
    "https://images.unsplash.com/photo-1523580494112-071d4581a59c?w=600&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80",
  ];

  return (
    <>
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
        <ScrollToTop />
        <Header />
        <EggLess />
        <WhatsAppChat />
        <Routes >
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/cancellation-refund-policy" element={<CancellationRefund />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/product-related/:subcatname" element={<AllCakes />} />
          <Route path="/:subcatname" element={<AllProductByChildCategory />} />
          <Route path="/sub-subcategory/:subcatname" element={<SubSubcategory />} />
          <Route path="/candle/all-candles" element={<AllCandles />} />
          <Route path="/product-details/:name" element={<ProductDetails />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/terms-&-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/frequently-asked-questions" element={<FAQ />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/faq" element={<QA />} />
          <Route path="/refer" element={<ReferAndEarn />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* ========================================= */}
          {/* NEW REUSABLE ENQUIRY ROUTES */}
          {/* ========================================= */}
          
          <Route path="/wedding-decor" element={
            <EnquiryPage 
              title="Wedding Decor Enquiry" 
              subtitle="Transform your special day into a magical experience with our premium wedding decor services." 
              images={weddingImages} 
              enquiryType="wedding" 
            />
          } />

          <Route path="/corporate-gifts" element={
            <EnquiryPage 
              title="Corporate Gifting Solutions" 
              subtitle="Build lasting relationships with your clients and employees through our curated premium gift hampers." 
              images={corporateImages} 
              enquiryType="corporate" 
            />
          } />

          <Route path="/for-makeup-artists" element={
            <EnquiryPage 
              title="Partner with Us - Makeup Artists" 
              subtitle="Exclusive floral and hamper packages tailored specifically for bridal and professional makeup artists." 
              images={makeupImages} 
              enquiryType="makeup_artist" 
            />
          } />

          <Route path="/for-schools-colleges" element={
            <EnquiryPage 
              title="School & College Events" 
              subtitle="Bulk orders, farewell gifts, and event decor specifically priced for educational institutions." 
              images={schoolImages} 
              enquiryType="education" 
            />
          } />

          {/* This route will need its own distinct page built later */}
          <Route path="/sell-with-us" element={<SellWithUs />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;