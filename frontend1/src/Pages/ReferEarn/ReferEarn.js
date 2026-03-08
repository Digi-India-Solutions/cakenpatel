import React from "react";
import "./referAndEarn.css";
import pic from "../../images/pic/refer.png";
import Swal from "sweetalert2";

const ReferAndEarn = () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const handleCopy = async () => {
    if (!userData?.referralCode) return;

    try {
      await navigator.clipboard.writeText(userData.referralCode);

      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Referral code copied to clipboard",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const shareWhatsApp = () => {
    if (!userData?.referralCode) return;

    const message = `🎂 Hey! Use my referral code *${userData.referralCode}* and get ₹100 cashback on your first cake order!

Order now: ${window.location.origin}`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  const shareFacebook = () => {
    const shareUrl = `${window.location.origin}`;

    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="refer-page">
      <div className="container">
        {/* HEADER */}
        <div className="refer-header text-center">
          <h2>Refer & Earn 🎂</h2>
          <p>
            Invite your friends and earn sweet rewards on every successful
            order!
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="refer-card row align-items-center">
          {/* LEFT */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img
              src={pic}
              alt="Refer"
              className="img-fluid refer-img"
            />
          </div>

          {/* RIGHT */}
          <div className="col-lg-6">
            <h4>How it works</h4>

            <ul className="refer-steps">
              <li>
                <span>1</span> Share your referral code with friends
              </li>
              <li>
                <span>2</span> Your friend places their first cake order
              </li>
              <li>
                <span>3</span> You earn ₹100 wallet cashback 🎉
              </li>
            </ul>

            {/* REFERRAL CODE */}
            <div className="referral-box">
              <p>Your Referral Code</p>
              <div className="code-box">
                <span>{userData?.referralCode}</span>
                <button onClick={handleCopy}>Copy</button>
              </div>
            </div>

            {/* SHARE BUTTONS */}
            <div className="share-buttons">
              <button className="btn btn-success" onClick={shareWhatsApp}>
                Share on WhatsApp
              </button>
              <button className="btn btn-primary" onClick={shareFacebook}>
                Share on Facebook
              </button>
            </div>
          </div>
        </div>

        {/* TERMS */}
        <div className="refer-terms">
          <h6>Terms & Conditions</h6>
          <ul>
            <li>Referral reward is credited after successful delivery.</li>
            <li>Applicable only on first order of referred user.</li>
            <li>Wallet amount can be used on cake orders only.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;
