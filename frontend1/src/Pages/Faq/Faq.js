import React from "react";
import "./faq.css";

const QA = () => {
  return (
    <section className="faq-section">
      <div className="container">
        <div className="row align-items-start">

          {/* LEFT FAQ */}
          <div className="col-lg-8">
            <h2 className="faq-title">Frequently asked questions</h2>

            <div className="accordion" id="faqAccordion">

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq1"
                  >
                    How do I place an order?
                  </button>
                </h2>
                <div id="faq1" className="accordion-collapse collapse show">
                  <div className="accordion-body">
                    You can place an order directly from our website by adding
                    products to cart and completing checkout.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq2"
                  >
                    What payment methods are accepted?
                  </button>
                </h2>
                <div id="faq2" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    We accept Credit Card, Debit Card, UPI and Net Banking.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq3"
                  >
                    Can I cancel my order?
                  </button>
                </h2>
                <div id="faq3" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    Orders can be cancelled before dispatch. Please contact
                    support as soon as possible.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq4"
                  >
                    How long does delivery take?
                  </button>
                </h2>
                <div id="faq4" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    Delivery usually takes 3–5 working days depending on
                    location.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SUPPORT CARD */}
          <div className="col-lg-4">
            <div className="faq-support-card">
              <div className="support-icon">🎧</div>
              <h5>Have more questions?</h5>
              <p>
                Cant find the answer you are looking for? Please chat to our
                friendly team.
              </p>
              <button className="btn btn-warning w-100">
                Get in touch
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default QA;
