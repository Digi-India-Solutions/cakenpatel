// import React, { useEffect } from "react";
// import './footerpages.css'
// const TermsConditions = () => {
//     useEffect(()=>{
//         window.scrollTo({
//             top:0,
//             behavior:'smooth'
//         })
//     })
//  const data = [
//   {
//     heading: "General Information",
//     listItems: [
//       "These Terms & Conditions govern your access to and use of the CAKENPETALS website and services.",
//       "CAKENPETALS is a premium cake and dessert brand dedicated to creating beautifully designed, handcrafted cakes using high-quality ingredients.",
//     ],
//   },
//   {
//     heading: "Acceptance of Terms",
//     listItems: [
//       "By accessing our website or placing an order, you agree to be bound by these Terms & Conditions.",
//       "If you do not agree with any part of these terms, please refrain from using our website or services.",
//     ],
//   },
//   {
//     heading: "Orders & Customization",
//     listItems: [
//       "All orders placed with CAKENPETALS are subject to availability and confirmation.",
//       "Custom designs are created based on customer preferences; minor variations in color, texture, or design may occur due to the handcrafted nature of our cakes.",
//       "Once an order is confirmed, changes or cancellations may not be possible depending on the preparation stage.",
//     ],
//   },
//   {
//     heading: "Pricing & Payments",
//     listItems: [
//       "All prices listed are in INR and inclusive/exclusive of applicable taxes as mentioned at checkout.",
//       "Full payment is required at the time of order placement to confirm your order.",
//       "We accept secure payments via cards, UPI, wallets, and other supported payment methods.",
//     ],
//   },
//   {
//     heading: "Ingredients & Allergens",
//     listItems: [
//       "CAKENPETALS uses fresh and premium-quality ingredients to ensure exceptional taste and quality.",
//       "Some products may contain allergens such as nuts, dairy, gluten, or eggs.",
//       "Customers are responsible for reviewing product descriptions and informing us of any allergies before placing an order.",
//     ],
//   },
//   {
//     heading: "Delivery & Pickup",
//     listItems: [
//       "We offer delivery within selected service areas. Delivery charges and timelines are displayed at checkout.",
//       "Customers may also opt for store pickup at the selected time slot.",
//       "CAKENPETALS is not responsible for delays caused by incorrect address details, weather conditions, traffic, or unforeseen circumstances.",
//     ],
//   },
//   {
//     heading: "Cancellations & Refunds",
//     listItems: [
//       "Cancellations are allowed within a limited time after order placement, provided preparation has not begun.",
//       "As cakes are perishable and custom-made, refunds are applicable only in cases of damaged or incorrect orders.",
//       "Any issues must be reported within 12 hours of delivery along with clear photographic evidence.",
//     ],
//   },
//   {
//     heading: "Intellectual Property",
//     listItems: [
//       "All content on the CAKENPETALS website, including logos, images, designs, and text, is the intellectual property of CAKENPETALS.",
//       "Unauthorized use, reproduction, or distribution of our content is strictly prohibited.",
//     ],
//   },
//   {
//     heading: "Limitation of Liability",
//     listItems: [
//       "CAKENPETALS shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website, except as required by law.",
//     ],
//   },
//   {
//     heading: "Updates to Terms",
//     listItems: [
//       "CAKENPETALS reserves the right to modify these Terms & Conditions at any time without prior notice.",
//       "Continued use of our website after changes are posted signifies your acceptance of the updated terms.",
//     ],
//   },
// ];


//   return (
//     <>
//         <div className="termsConditions">
//       <div className="container">
//         <div className="termsConditionsContent">
//         <h3>CAKENPETALS</h3>
// <h1>Terms & Conditions</h1>

//           <hr />
//           <p className="introText">
//   Welcome to <span className="highlighted">CAKENPETALS</span>. By using our
//   website and placing orders with us, you agree to follow the terms and
//   conditions outlined below. These terms help ensure a smooth, delightful,
//   and transparent experience for every celebration.
// </p>

//           <div className="lastUpdate">
//             Last Updated:{" "}
//             <span>{new Date("2024-01-12").toLocaleDateString()}</span>
//           </div>
//           {data.map((item, index) => (
//             <section key={index} className="termsSection">
//               <h4>{item.heading}</h4>
//               <ul>
//                 {item.listItems.map((listItem, listIndex) => (
//                   <li key={listIndex}>{listItem}</li>
//                 ))}
//               </ul>
//             </section>
//           ))}
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default TermsConditions;


import React, { useEffect } from "react";
import './footerpages.css'

const TermsConditions = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  const data = [
    {
      heading: "1. Introduction",
      listItems: [
        "Welcome to Cakenpetals.com. These Terms and Conditions govern your access to and use of our website and services.",
        "By placing an order or using our platform, you agree to be bound by these terms.",
        "Cakenpetals is a sole proprietorship business operating under the laws of India and engaged in providing cakes, flowers, plants, and gifting solutions."
      ],
    },
    {
      heading: "2. Eligibility",
      listItems: [
        "You must be at least 18 years of age or using the platform under parental/guardian supervision.",
        "The information provided by you must be accurate and complete.",
        "You agree to use the website in compliance with applicable laws and regulations."
      ],
    },
    {
      heading: "3. Orders and Acceptance",
      listItems: [
        "All orders are subject to availability and acceptance.",
        "Order confirmation will be sent via email or SMS.",
        "We reserve the right to cancel or refuse any order due to product unavailability, incorrect pricing, or suspected fraudulent activity.",
        "In case of cancellation from our side, payments will be refunded as per our refund policy."
      ],
    },
    {
      heading: "4. Pricing and Payments",
      listItems: [
        "All prices are in Indian Rupees (INR) and inclusive/exclusive of applicable taxes as mentioned.",
        "We reserve the right to change prices without prior notice.",
        "Payments must be made through authorised payment methods available on our website.",
        "We are not responsible for payment gateway failures or transaction delays beyond our control."
      ],
    },
    {
      heading: "5. Delivery Policy",
      listItems: [
        "• The order will be delivered within 5 hours.",
        "There is no return policy. Replacement will be provided within 6 hours of purchase.",
        "Delivery timelines are estimates and may vary due to unforeseen circumstances.",
        "Same-day delivery orders must be placed before the specified cut-off time.",
        "We do not guarantee delivery at a specific time unless explicitly mentioned.",
        "If the recipient is unavailable, we may attempt re-delivery or contact the customer."
      ],
    },
    {
      heading: "6. Product Information",
      listItems: [
        "Product images are for representation purposes only; actual products may vary slightly.",
        "Perishable products should be consumed within the recommended time.",
        "Customised orders once confirmed cannot be modified or cancelled."
      ],
    },
    {
      heading: "7. Cancellation and Refund",
      listItems: [
        "Orders can be cancelled before preparation or dispatch.",
        "Once prepared or dispatched, cancellation may not be possible.",
        "Refunds, if applicable, will be processed via the original payment method within a reasonable timeframe.",
        "For detailed terms, refer to our Refund Policy.",
        "There is no return / refund policy.",
      ],
    },
    {
      heading: "8. User Responsibilities",
      listItems: [
        "You agree not to use the website for unlawful purposes.",
        "You will not provide false or misleading information.",
        "You will not attempt to harm, hack, or disrupt the website.",
        "Any misuse may result in suspension or termination of access."
      ],
    },
    {
      heading: "9. Intellectual Property",
      listItems: [
        "All content including logos, text, images, graphics, and designs is the property of Cakenpetals.",
        "Unauthorised use or reproduction is strictly prohibited."
      ],
    },
    {
      heading: "10. Limitation of Liability",
      listItems: [
        "We are not liable for indirect or consequential damages arising from the use of our services.",
        "We are not responsible for delays caused by natural events or circumstances beyond our control.",
        "Minor variations in product appearance do not qualify for claims.",
        "Maximum liability shall not exceed the total value of the order placed."
      ],
    },
    {
      heading: "11. Privacy",
      listItems: [
        "Your use of our website is governed by our Privacy Policy.",
        "By using our services, you consent to the collection and use of your information as outlined."
      ],
    },
    {
      heading: "12. Modifications to Terms",
      listItems: [
        "We reserve the right to update or modify these Terms at any time without prior notice.",
        "Continued use of the website indicates acceptance of updated terms."
      ],
    },
    {
      heading: "13. Governing Law and Jurisdiction",
      listItems: [
        "These Terms shall be governed by the laws of India.",
        "Any disputes shall be subject to the jurisdiction of competent courts where Cakenpetals operates."
      ],
    },
    {
      heading: "14. Contact Information",
      listItems: [
        "For any queries regarding these Terms and Conditions, contact us at:",
        "Email: Wecarecakenpetals@gmail.com"
      ],
    },
  ];

  return (
    <div className="termsConditions">
      <div className="container">
        <div className="termsConditionsContent">

          <h3>CAKENPETALS</h3>
          <h1>Terms & Conditions</h1>
          <hr />

          <p className="introText">
            Welcome to <span className="highlighted">Cakenpetals</span>.
            These Terms and Conditions govern your access to and use of our
            website and services. By placing an order or using our platform,
            you agree to comply with these terms.
          </p>

          <div className="lastUpdate">
            Last Updated:{" "}
            <span>{new Date("2024-12-01").toLocaleDateString()}</span>
          </div>

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

export default TermsConditions;