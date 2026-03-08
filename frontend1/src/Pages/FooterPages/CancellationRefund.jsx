import React, { useEffect } from "react";
import "./footerpages.css";

const CancellationRefund = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const data = [
    {
      heading: "1. Order Cancellation Policy",
      listItems: [
        "A) Cancellation Before Preparation:",
        "• Orders may be cancelled only before the preparation process has started.",
        "• Cancellation requests must be made immediately after placing the order.",
        "• If approved, a full refund will be processed to the original payment method.",
        "",
        "B) Cancellation After Preparation or Dispatch:",
        "• Once the order has entered preparation or has been dispatched for delivery, cancellation will not be permitted.",
        "• Customised, personalised, or special occasion cakes cannot be cancelled once confirmed."
      ],
    },
    {
      heading: "2. Delivery Responsibility & Customer Obligations",
      listItems: [
        "Customers must provide:",
        "• Complete and accurate delivery address.",
        "• Correct contact number of the recipient.",
        "• Proper delivery instructions (if any).",
        "It is the customer’s responsibility to ensure that the recipient is available at the time of delivery."
      ],
    },
    {
      heading: "3. Non-Refundable & Non-Reattempt Conditions",
      listItems: [
        "Refund or reattempt delivery will not be applicable in the following cases:",
        "• Incorrect or incomplete delivery address provided.",
        "• Wrong contact number shared.",
        "• Recipient not answering calls or being unavailable.",
        "• Delivery delay caused by the recipient.",
        "• Recipient refuses to accept the delivery.",
        "• Surprise deliveries where the recipient denies acceptance.",
        "In such situations, the order will be considered completed from our side and no refund shall be issued.",
        "Re-delivery, if feasible, will be at our sole discretion and subject to additional charges."
      ],
    },
    {
      heading: "4. Damaged or Incorrect Product",
      listItems: [
        "• You must inform us within 2 hours of delivery.",
        "• Clear photos of the product and packaging must be shared.",
        "After verification, we may offer replacement or partial/full refund depending on the issue.",
        "Complaints raised after the specified time window may not be entertained."
      ],
    },
    {
      heading: "5. Non-Delivery Due to Our Fault",
      listItems: [
        "If an order is not delivered due to an error solely from our side, we will offer:",
        "• Re-delivery at no extra charge, or",
        "• Full refund to the original payment method."
      ],
    },
    {
      heading: "6. Refund Processing Timeline",
      listItems: [
        "• Approved refunds will be processed to the original payment method only.",
        "• The amount may take 5–7 business days (or as per bank/payment provider timelines) to reflect."
      ],
    },
    {
      heading: "7. Force Majeure",
      listItems: [
        "Cakenpetals shall not be responsible for delays or failure in delivery due to:",
        "• Natural disasters.",
        "• Government restrictions.",
        "• Transportation breakdown.",
        "• Strikes or public disturbances.",
        "In such cases, refunds or re-delivery will be evaluated at our discretion."
      ],
    },
    {
      heading: "8. Final Decision",
      listItems: [
        "All cancellation and refund decisions will be made by Cakenpetals management after reviewing each case.",
        "The decision shall be final and binding.",
        "Note: A 5% charge will apply to cancellations. Any discounted or exempted amount is non-refundable."
      ],
    },
    {
      heading: "9. Contact Us",
      listItems: [
        "For any cancellation or refund-related queries:",
        "📧 wecarecakenpetals@gmail.com",
        "📞 9211929555"
      ],
    },
  ];

  return (
    <div className="termsConditions">
      <div className="container">
        <div className="termsConditionsContent">

          <h3>CAKENPETALS</h3>
          <h1>Cancellation & Refund Policy</h1>
          <hr />

          <p className="introText">
            At <span className="highlighted">Cakenpetals</span>, we take pride in delivering freshly prepared cakes, flowers, and gifts with care and commitment.
            As most of our products are perishable and made-to-order, this policy outlines the conditions under which cancellations,
            refunds, and re-delivery requests will be considered.
            By placing an order with us, you agree to the terms mentioned below.
          </p>

          {data.map((item, index) => (
            <section key={index} className="termsSection">
              <h4>{item.heading}</h4>
              <ul>
                {item.listItems.map((listItem, listIndex) => (
                  <li key={listIndex}>{listItem}</li>
                ))}
              </ul>
            </section>
          ))}

        </div>
      </div>
    </div>
  );
};

export default CancellationRefund;