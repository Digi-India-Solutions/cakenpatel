import React, { useEffect, useState, useRef } from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TbTruckDelivery } from "react-icons/tb";
import { IoMdCart } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
/* ICONS */
import { IoIosArrowDown } from "react-icons/io";
import { IoMenu, IoClose } from "react-icons/io5";

/* COMPONENTS */
import LocationPopup from "../LocationPopup/LocationPopup";

/* ASSETS */
import Banner from "../../images/pic/topBanner1.png";
import logo from "../../images/pic/logo2.png";

// ========================================================
// PERFORMANCE FIX: GLOBAL CACHE
// These variables sit outside the component so they don't get 
// destroyed when the user navigates to a new page. This stops 
// the continuous background API fetching.
// ========================================================
let cachedMegaCategories = null;
let cachedAllProducts = null;
let cachedCountries = null;

const Header = () => {
  const navigate = useNavigate();
  const loginvalue = sessionStorage.getItem("login");
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const menuRef = useRef(null);

  /* CATEGORY DATA (FROM API) */
  const [megaCategories, setMegaCategories] = useState(cachedMegaCategories || []);

  /* LOCATION */
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [countries, setCountries] = useState(cachedCountries || []);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [productSuggestions, setProductSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  /* MOBILE MENU */
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(null);

  /* DESKTOP MENU */
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(null);

  /* SEARCH */
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [allProducts, setAllProducts] = useState(cachedAllProducts || []);

  const toggleDropdown = (key) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  /* REFS */
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // 1. CACHED CATEGORY FETCH
  useEffect(() => {
    const fetchCategories = async () => {
      // If we already fetched this, don't ping the server again!
      if (cachedMegaCategories) return; 

      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/get-category-with-subcategory`
        );

        if (res.data?.data) {
          const formattedData = res.data.data.map((cat) => ({
            _id: cat._id,
            name: cat.mainCategoryName.charAt(0).toUpperCase() + cat.mainCategoryName.slice(1),
            subcategories: (cat?.subcategories || []).map((sub) => ({
              _id: sub?._id,
              name: sub?.subcategoryName?.charAt(0)?.toUpperCase() + sub?.subcategoryName?.slice(1),
              children: (sub.secondSubcategories || []).map((child) => ({
                name: child?.secondsubcategoryName?.charAt(0).toUpperCase() + child?.secondsubcategoryName?.slice(1),
                id: child._id,
              })),
            })),
          }));

          cachedMegaCategories = formattedData; // Save to global cache
          setMegaCategories(formattedData);
        }
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  // 2. CACHED ALL PRODUCTS FETCH (Massive Performance Saver)
  useEffect(() => {
    const fetchAllProducts = async () => {
      // If we already downloaded all products, don't do it again!
      if (cachedAllProducts) return;

      try {
        const res = await axios.get("https://api.cakenpetals.com/api/all-product");
        cachedAllProducts = res.data?.data || []; // Save to global cache
        setAllProducts(cachedAllProducts);
      } catch (err) {
        console.error("All products fetch error:", err);
      }
    };

    fetchAllProducts();
  }, []);

  // 3. SEARCH FILTER LOGIC
  useEffect(() => {
    if (!searchQuery.trim()) {
      setProductSuggestions([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    const filtered = allProducts.filter((product) => {
      const nameMatch = product.productName?.toLowerCase().includes(lowerQuery);
      const categoryMatch = product.categoryName?.mainCategoryName?.toLowerCase().includes(lowerQuery);
      const subcategoryMatch = product.subcategoryName?.subcategoryName?.toLowerCase().includes(lowerQuery);

      return nameMatch || categoryMatch || subcategoryMatch;
    });

    setProductSuggestions(filtered.slice(0, 6));
  }, [searchQuery, allProducts]);

  // 4. CACHED COUNTRIES FETCH
  useEffect(() => {
    const fetchCountries = async () => {
      if (cachedCountries) {
        // If cached, just set the default selected country
        const india = cachedCountries.find((c) => c.code === "IN");
        if (india) setSelectedCountry(india);
        return;
      }

      try {
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca2"
        );

        const formatted = res.data.map((item) => ({
          name: item.name.common,
          flag: item.flags.png,
          code: item.cca2,
        }));

        cachedCountries = formatted; // Save to global cache
        setCountries(formatted);

        const india = formatted.find((c) => c.code === "IN");
        if (india) setSelectedCountry(india);
      } catch (err) {
        console.error("Country fetch error:", err);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileNavOpen(false);
        setMobileCategoryOpen(null);
      }
    };

    if (mobileNavOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [mobileNavOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${searchQuery}`);
    setSearchQuery("");
  };

  const handleMobileCategoryToggle = (index) => {
    setMobileCategoryOpen((prev) => (prev === index ? null : index));
  };

  const handleDesktopMenuToggle = (index) => {
    setDesktopMenuOpen((prev) => (prev === index ? null : index));
  };

  const closeAllMobileMenus = () => {
    setMobileNavOpen(false);
    setMobileCategoryOpen(null);
  };

  return (
    <>
      {/* ================= TOP PROMO BANNER ================= */}
      <img src={Banner} alt="banner" className="header-topBanner" />

      {/* ================= HEADER ================= */}
      <div className="HeaderContainer">
        <header className="custom-navbar">
          <div className="container-fluid">
            <div className="top-header-wrapper">

              {/* ================= MOBILE MENU ICON ================= */}
              <button
                className="mobile-menu-btn d-lg-none"
                onClick={() => {
                  setMobileNavOpen((prev) => !prev);
                  setMobileCategoryOpen(null);
                }}
              >
                {mobileNavOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
              </button>

              {/* ================= LOGO ================= */}
              <Link to="/" className="brand-title">
                <img src={logo} alt="logo" className="logoImage" />
              </Link>

              {/* ================= DELIVERY ================= */}
              <div className="delivery-wrapper">
                <div
                  className="delivery-box"
                  onClick={() => setShowLocationModal(true)}
                >
                  {selectedCountry && (
                    <img
                      src={selectedCountry?.flag}
                      alt={selectedCountry?.name}
                      className="delivery-flag"
                    />
                  )}
                  <div className="DeliverSection">
                    <small>Deliver to</small>
                    <span className="delivery-country">
                      {selectedCountry?.name}
                    </span>
                  </div>
                  <IoIosArrowDown />
                </div>
              </div>

              {/* ================= SEARCH ================= */}
              <form className="search-container" onSubmit={handleSearchSubmit}>
                <div className="search-wrapper position-relative">

                  <input
                    type="search"
                    className="form-control searchInput"
                    placeholder="Search cakes, flowers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <button
                    type={searchQuery ? "button" : "submit"}
                    className="search-icon"
                    onClick={() => {
                      if (searchQuery) {
                        setSearchQuery("");
                        setProductSuggestions([]);
                      }
                    }}
                  >
                    {searchQuery ? (
                      ""
                    ) : (
                      <IoSearch className="iconFont text-dark" style={{ fontSize: "20px" }} />
                    )}
                  </button>

                  {/* 🔥 Product Suggestion Dropdown */}
                  {searchQuery && (
                    <div className="search-suggestions">
                      {loadingSuggestions && (
                        <div className="suggestion-item">Searching...</div>
                      )}

                      {!loadingSuggestions && productSuggestions.length === 0 && (
                        <div className="suggestion-item">No products found</div>
                      )}

                      {productSuggestions.map((product) => (
                        <div
                          key={product._id}
                          className="suggestion-item product-suggestion"
                          onClick={() => {
                            navigate(`/product-details/${product?.productName.replace(/\s+/g, "-")}`,
                              { state: { id: product?._id, status: 'product' } });
                            setSearchQuery("");
                            setProductSuggestions([]);
                          }}
                        >
                          <img
                            src={`https://api.cakenpetals.com/${product?.productImage?.[0]?.replace(/\\/g, "/")}`}
                            alt={product?.productName}
                            className="suggestion-image"
                          />
                          <div className="suggestion-name">
                            {product.productName}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>

              {/* ================= RIGHT ICONS ================= */}
              <div className="top-icons">
                {loginvalue && <Link to="/track-order" className="icon-box">
                  <TbTruckDelivery className="iconFont" />
                  <span className="navPageText">Track Order</span>
                </Link>}

                <Link to="/cart" className="icon-box position-relative">
                  <IoMdCart className="iconFont" />
                  <span className="navPageText">Cart</span>
                  {cart?.length > 0 && (
                    <span className="cart-count-badge">
                      {cart.length}
                    </span>
                  )}
                </Link>

                {loginvalue ? (
                  <Link to="/profile" className="icon-box">
                    <i className="bi bi-person-fill"></i>
                    <span className="navPageText">Account</span>
                  </Link>
                ) : (
                  <Link to="/login" className="icon-box">
                    <i className="bi bi-person-fill"></i>
                    <span className="navPageText">Login</span>
                  </Link>
                )}

                {/* ================= MENU DROPDOWN ================= */}
                <div
                  className="hdr-menu-trigger"
                  ref={menuRef}
                  onClick={() => toggleDropdown("menu")}
                >
                  <i className="bi bi-grid"></i>
                  <span className="navPageText">Menu</span>

                  {openIndex === "menu" && (
                    <div className="hdr-menu-dropdown" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                      
                      {/* NEW MENU ITEMS LISTED HERE */}
                      <Link to="/wedding-decor" className="hdr-menu-link">
                        Wedding Decor enquiry
                      </Link>
                      
                      <Link to="/corporate-gifts" className="hdr-menu-link">
                        Corporate gifts
                      </Link>
                      
                      <Link to="/wishlist" className="hdr-menu-link">
                        My favourites
                      </Link>

                      {/* Keeping Conditional Logic for Logged-In Users */}
                      {loginvalue && (
                        <Link to="/refer" className="hdr-menu-link">
                          Refer and Earn <span className="hdr-badge-new">New</span>
                        </Link>
                      )}
                      
                      {loginvalue && (
                        <Link to="/" className="hdr-menu-link">
                          Wallet Balance :-  <span className="hdr-badge-new">RS. {userData?.walletBalance}</span>
                        </Link>
                      )}

                      <Link to="/for-makeup-artists" className="hdr-menu-link">
                        For Make Up Artists
                      </Link>

                      <Link to="/for-schools-colleges" className="hdr-menu-link">
                        For School, Colleges
                      </Link>

                      <Link to="/faq" className="hdr-menu-link">
                        FAQs
                      </Link>

                      <Link to="/about-us" className="hdr-menu-link">
                        About Us
                      </Link>

                      <Link to="/sell-with-us" className="hdr-menu-link">
                        Sell With Us
                      </Link>

                      <Link to="/contact-us" className="hdr-menu-link">
                        Contact Us
                      </Link>

                      <a
                        href="https://wa.me/919953553051"
                        target="_blank"
                        rel="noreferrer"
                        className="hdr-menu-link hdr-whatsapp"
                      >
                        WhatsApp
                      </a>

                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ================= SEARCH ================= */}
              <form className="only_mobile" onSubmit={handleSearchSubmit}>
                <div className="search-wrapper position-relative">

                  <input
                    type="search"
                    className="form-control searchInput"
                    placeholder="Search cakes, flowers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <button
                    type={searchQuery ? "button" : "submit"}
                    className="search-icon"
                    onClick={() => {
                      if (searchQuery) {
                        setSearchQuery("");
                        setProductSuggestions([]);
                      }
                    }}
                  >
                    {searchQuery ? (
                      ""
                    ) : (
                      <IoSearch className="iconFont text-dark" style={{ fontSize: "20px" }} />
                    )}
                  </button>

                  {/* 🔥 Product Suggestion Dropdown */}
                  {searchQuery && (
                    <div className="search-suggestions">
                      {loadingSuggestions && (
                        <div className="suggestion-item">Searching...</div>
                      )}

                      {!loadingSuggestions && productSuggestions.length === 0 && (
                        <div className="suggestion-item">No products found</div>
                      )}

                      {productSuggestions.map((product) => (
                        <div
                          key={product._id}
                          className="suggestion-item product-suggestion"
                          onClick={() => {
                            navigate(`/product-details/${product?.productName.replace(/\s+/g, "-")}`,
                              { state: { id: product?._id, status: 'product' } });
                            setSearchQuery("");
                            setProductSuggestions([]);
                          }}
                        >
                          <img
                            src={`https://api.cakenpetals.com/${product?.productImage?.[0]?.replace(/\\/g, "/")}`}
                            alt={product?.productName}
                            className="suggestion-image"
                          />
                          <div className="suggestion-name">
                            {product.productName}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>

          {/* ================= DELIVERY ================= */}
          <div className="delivery-row d-lg-none">
            <div
              className="delivery-box"
              onClick={() => setShowLocationModal(true)}
            >
              {selectedCountry && (
                <img
                  src={selectedCountry.flag}
                  alt={selectedCountry.name}
                  className="delivery-flag"
                />
              )}
              <div className="DeliverSection">
                <small>Deliver to</small>
                <span className="delivery-country">
                  {selectedCountry?.name}
                </span>
              </div>
              <IoIosArrowDown />
            </div>
          </div>

        </header>

        {/* ================= MOBILE MENU ================= */}
        {mobileNavOpen && (
          <div className="mobile-menu-wrapper d-lg-none" ref={mobileMenuRef}>
            {megaCategories?.map((cat, index) => (
              <div key={cat?._id || index} className="mobile-cat">
                <div
                  className="mobile-cat-title"
                  onClick={() => handleMobileCategoryToggle(index)}
                >
                  {cat?.name}
                  <IoIosArrowDown
                    className={`arrow ${mobileCategoryOpen === index ? "rotate" : ""}`}
                  />
                </div>

                {mobileCategoryOpen === index && (
                  <div className="mobile-subcats">
                    {cat?.subcategories?.map((sub, i) => (
                      <details key={sub?._id || i} className="mobile-nested-accordion">
                        <summary className="mobile-subcat-summary">
                          <strong>{sub?.name}</strong>
                          <span className="plus-icon">+</span>
                        </summary>

                        <div className="mobile-children-links">
                          {sub?.children?.map((child, j) => (
                            <div
                              key={j}
                              onClick={() => {
                                navigate(`/${child?.name.replace(/\s+/g, "-").toLowerCase()}`,
                                  { state: { id: child?.id, status: 'subCategory' } });
                                setMobileNavOpen((prev) => !prev);
                                setMobileCategoryOpen(null);
                              }}
                              className="mega-item mega-child"
                            >
                              {child?.name}
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ================= LOCATION MODAL ================= */}
        {showLocationModal && (
          <LocationPopup
            onClose={() => setShowLocationModal(false)}
            countries={countries}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
        )}
      </div>

      {/* ================= DESKTOP MEGA NAV ================= */}
      <nav style={{ background: 'white' }} className="navbar navbar-expand-lg bottom-navbar d-none d-lg-block">
        <div className="container navbarContainer">
          <ul className="navbar-nav mx-auto">
            {megaCategories.map((cat, index) => (
              <li
                key={cat._id || index}
                className="nav-item mega-dropdown"
                onMouseEnter={() => setDesktopMenuOpen(index)}
                onMouseLeave={() => setDesktopMenuOpen(null)}
              >
                <span className="nav-link mega-toggle" style={{letterSpacing: '1px'}}>
                  {cat.name}
                </span>

                {/* THE DESKTOP FIX: Added "&& cat?.subcategories?.length > 0" */}
                {desktopMenuOpen === index && cat?.subcategories?.length > 0 && (
                  <div className="mega-menu">
                    <div className="mega-menu-inner">
                      {cat.subcategories?.map((sub, i) => (
                        <div key={sub._id || i} className="column-mega">
                          <p className="mega-item fw-bold mb-0 w-100">
                            {sub.name}
                          </p>
                          {sub.children?.map((child, j) => (
                            <div
                              key={j}
                              onClick={() => {
                                navigate(`/${child?.name.replace(/\s+/g, "-").toLowerCase()}`,
                                  { state: { id: child?.id, status: 'subCategory' } });
                                setDesktopMenuOpen(null);
                              }}
                              className="mega-item mega-child"
                            >
                              {child?.name}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;