import React, { useEffect } from "react";
import "./footerpages.css";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Privacy Policy content for cakenpetals
  const privacyPolicyContent = [
    {
      heading: "Introduction",
      text: "At cakenpetals, your privacy matters to us. We are committed to protecting your personal information and ensuring transparency in how we collect, use, and safeguard your data when you interact with our website and services.",
    },
    {
      heading: "Information We Collect",
      list: [
        "Personal information such as your name, email address, phone number, and delivery details.",
        "Order-related information including products purchased, customization requests, and payment details.",
        "Technical data such as IP address, browser type, device information, and cookies for analytics purposes.",
      ],
    },
    {
      heading: "How We Use Your Information",
      list: [
        "To process, prepare, and deliver your cake orders accurately.",
        "To communicate order updates, confirmations, and customer support responses.",
        "To improve our website, products, and overall customer experience.",
        "To send promotional offers and updates, only if you choose to receive them.",
      ],
    },
    {
      heading: "Cookies Policy",
      text: "cakenpetals uses cookies to enhance your browsing experience, understand user preferences, and analyze website traffic. You can control or disable cookies through your browser settings at any time.",
    },
    {
      heading: "Data Sharing and Disclosure",
      text: "We only share your personal information with trusted third-party partners such as payment gateways and delivery services, strictly for order fulfillment and operational purposes. Your data is never sold or misused.",
    },
    {
      heading: "Data Security",
      text: "We follow industry-standard security practices to protect your personal information from unauthorized access, loss, misuse, or disclosure.",
    },
    {
      heading: "Your Rights",
      text: "You have the right to access, update, or request deletion of your personal information. If you wish to exercise these rights, please contact us using the details provided below.",
    },
    {
      heading: "Policy Updates",
      text: "We may update this Privacy Policy occasionally to reflect changes in our practices or legal requirements. Any updates will be posted on this page, and we encourage you to review it periodically.",
    },
    {
      heading: "Contact Us",
      text: "If you have any questions or concerns regarding this Privacy Policy or your personal data, please contact us at 99535 53051,  privacy@cakenpetals.com.",
    },
  ];

  return (
    <div className="privacyPolicy">
      <div className="container">
        <div className="privacyPolicyContent">
          <h3>cakenpetals</h3>
          <h1>Privacy Policy</h1>
          <hr />

          {privacyPolicyContent.map((section, index) => (
            <div key={index} className="privacySection">
              <h4>{section.heading}</h4>

              {section.text && <p>{section.text}</p>}

              {section.list && (
                <ul>
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
