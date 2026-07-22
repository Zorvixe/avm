import { useEffect, useState } from "react";
import {
  TicketPercent,
  Copy,
  CheckCircle,
} from "lucide-react";
import "./MyCoupons.css";

const API_URL = "http://localhost:5000";

function MyCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${API_URL}/coupons/get`);
      const data = await response.json();

      if (data.success) {
        // Show only active & visible coupons
        const activeCoupons = data.data.filter(
          (coupon) =>
            coupon.is_active &&
            !coupon.hidden
        );

        setCoupons(activeCoupons);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);

    setCopied(code);

    setTimeout(() => {
      setCopied("");
    }, 2000);
  };

  return (
    <div className="my-coupons-page">

      <div className="my-coupons-header">
        <h1>My Coupons</h1>
        <p>Use these coupons during checkout to save more.</p>
      </div>

      {coupons.length === 0 ? (

        <div className="no-coupons">
          <TicketPercent size={55} />
          <h3>No Coupons Available</h3>
        </div>

      ) : (

        <div className="coupon-grid">

          {coupons.map((coupon) => (

            <div
              className="coupon-card"
              key={coupon.id}
            >

              <div className="coupon-top">

                <div className="coupon-icon">
                  <TicketPercent size={24} />
                </div>

                <button
                  className="copy-btn"
                  onClick={() =>
                    copyCoupon(coupon.code)
                  }
                >
                  {copied === coupon.code ? (
                    <>
                      <CheckCircle size={18} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy
                    </>
                  )}
                </button>

              </div>

              <h2>{coupon.code}</h2>

              <h3>
                {coupon.discount_type === "percentage"
                  ? `${coupon.discount_value}% OFF`
                  : `₹${coupon.discount_value} OFF`}
              </h3>

              <div className="coupon-info">

                <p>
                  <strong>Minimum Order</strong>
                  <span>₹{coupon.min_order}</span>
                </p>

                <p>
                  <strong>Maximum Discount</strong>
                  <span>
                    {coupon.max_discount
                      ? `₹${coupon.max_discount}`
                      : "Unlimited"}
                  </span>
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyCoupons;