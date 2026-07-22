import "./Checkout.css";
import { useEffect, useState } from "react";
import { useNavigate,  Link  } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { CheckCircle ,TicketPercent } from "lucide-react";

function Checkout() {
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [formData, setFormData] = useState({
 customer_name: "",
  customer_phone: "",
  customer_email: "",

  house_no: "",
  street_area: "",
  landmark: "",

  city: "",
  district: "",
  state: "",
  pincode: "",

  payment_method: "Cash on Delivery",
  notes: "",
});

useEffect(() => {
  const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));

  if (buyNowItem) {
    setCartItems([buyNowItem]);
  } else {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }

  setPageLoading(false);
}, []);

useEffect(() => {
  fetchCoupons();
}, []);

const fetchCoupons = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/coupons/available"
    );

    const data = await response.json();

    if (data.success) {
      setCoupons(data.data);
    }
  } catch (error) {
    console.log(error);
  }
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

 

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const deliveryCharge = subtotal > 0 ? 100 : 0;

  const total = subtotal + deliveryCharge - discount;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const completeOrderSuccess = (orderId) => {
  localStorage.setItem("customer_phone", formData.customer_phone);
  localStorage.setItem("customer_name", formData.customer_name);

  localStorage.removeItem("cart");
  localStorage.removeItem("buyNowItem");

  window.dispatchEvent(new Event("cartUpdated"));

  setPlacedOrderId(orderId || null);
  setOrderSuccess(true);
};

const applyCoupon = (coupon) => {
  if (subtotal < Number(coupon.min_order)) {
    alert(
      `Minimum order should be ₹${coupon.min_order} to use this coupon.`
    );
    return;
  }

  let couponDiscount = 0;

  if (coupon.discount_type === "percentage") {
    couponDiscount =
      (subtotal * Number(coupon.discount_value)) / 100;

    if (
      coupon.max_discount &&
      couponDiscount > Number(coupon.max_discount)
    ) {
      couponDiscount = Number(coupon.max_discount);
    }
  } else {
    couponDiscount = Number(coupon.discount_value);
  }

  setSelectedCoupon(coupon);
  setCouponCode(coupon.code);
  setDiscount(couponDiscount);

  alert(`${coupon.code} Applied Successfully`);
};

const removeCoupon = () => {
  setSelectedCoupon(null);
  setCouponCode("");
  setDiscount(0);

  alert("Coupon Removed Successfully");
};

  const placeCodOrder = async (orderData) => {
    const response = await fetch(
      "http://localhost:5000/orders/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Order failed");
    }

    completeOrderSuccess(data.orderId || data.data?.id);
  };

  const placeRazorpayOrder = async (orderData) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error("Unable to load Razorpay checkout. Please try again.");
    }

    const keyResponse = await fetch("http://localhost:5000/settings/public/razorpay-key");
    const keyData = await keyResponse.json();

    if (!keyData.success || !keyData.key_id) {
      throw new Error("Razorpay key is not configured in admin settings.");
    }

    const orderResponse = await fetch("http://localhost:5000/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });
    const razorpayOrderData = await orderResponse.json();

    if (!razorpayOrderData.success) {
      throw new Error(razorpayOrderData.message || "Unable to create Razorpay order");
    }

    await new Promise((resolve, reject) => {
      const options = {
        key: keyData.key_id,
        amount: razorpayOrderData.order.amount,
        currency: razorpayOrderData.order.currency || "INR",
        name: "TerraVita",
        description: "Order Payment",
        order_id: razorpayOrderData.order.id,
        prefill: {
          name: formData.customer_name,
          email: formData.customer_email,
          contact: formData.customer_phone,
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch("http://localhost:5000/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                orderDetails: {
                  ...orderData,
                  payment_method: "Razorpay",
                  payment_status: "Completed",
                },
              }),
            });
            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              reject(new Error(verifyData.message || "Payment verification failed"));
              return;
            }

            completeOrderSuccess(verifyData.orderId);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled")),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  };

  const placeOrder = async () => {
if (
  !formData.customer_name ||
  !formData.customer_phone ||
  !formData.house_no ||
  !formData.street_area ||
  !formData.city ||
  !formData.district ||
  !formData.state ||
  !formData.pincode
) {
  alert("Please fill all required fields.");
  return;
}


  
const fullAddress = [
  formData.house_no,
  formData.street_area,
  formData.landmark,
  formData.city,
  formData.district,
  formData.state,
  formData.pincode,
]
.filter(Boolean)
.join(", ");

const orderData = {
  ...formData,
  address: fullAddress,
  payment_status:
    formData.payment_method === "Razorpay"
      ? "Completed"
      : "Pending",
      coupon_code: couponCode,
      discount: discount,
  total_amount: total,
  items: cartItems,
};

  try {
    if (placingOrder) return;

setPlacingOrder(true);

    if (formData.payment_method === "Razorpay") {
      await placeRazorpayOrder(orderData);
    } else {
      await placeCodOrder(orderData);
    }
  } catch (error) {
    console.log(error);
    alert(error.message || "Order failed");
    setPlacingOrder(false);
  }
};
if (orderSuccess) {
  return (
    <div className="order-success-overlay">
      <div className="order-success-box">

        <CheckCircle
          className="order-success-icon"
        />

        <h1 className="order-success-title">
          Order Placed Successfully!
        </h1>

        <p className="order-success-text">
          Thank you for shopping with TerraVita.
          <br />
          Your order {placedOrderId ? `#${placedOrderId}` : ""} has been received and will be processed shortly.
        </p>

        <div className="order-success-actions">

          <Link
            to="/myorders"
            className="order-success-orders-btn"
          >
            My Orders
          </Link>

          <Link
            to="/products"
            className="order-success-shop-btn"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
}
  return (
    <>
    <section className="checkout-page">
      <h1 className="checkout-heading">
        Checkout
      </h1>

      <div className="checkout-wrapper">

        {/* Left */}

        <div className="checkout-left">

          <div className="checkout-card">

            <h2>Shipping Address</h2>

            <div className="form-grid">

              <input
                type="text"
                name="customer_name"
                placeholder="Full Name"
                value={formData.customer_name}
                onChange={handleChange}
              />

              <input
                type="tel"
                name="customer_phone"
                placeholder="Phone Number"
                value={formData.customer_phone}
                onChange={handleChange}
              />

            <input
              type="email"
              name="customer_email"
              placeholder="Email (Optional)"
              value={formData.customer_email}
              onChange={handleChange}
            />
                          <input
              type="text"
              name="house_no"
              placeholder="House / Flat No."
              value={formData.house_no}
              onChange={handleChange}
            />

            <input
              type="text"
              name="street_area"
              placeholder="Street / Area / Colony"
              value={formData.street_area}
              onChange={handleChange}
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark (Optional)"
              value={formData.landmark}
              onChange={handleChange}
            />



              <input
                type="text"
                name="city"
                placeholder="Village / City"
                value={formData.city}
                onChange={handleChange}
              />

              <input
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
              <textarea
                name="notes"
                placeholder="Order Notes (Optional)"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />

            </div>

          </div>

          <div className="checkout-card">

            <h2>Payment Method</h2>

            <label className="payment-option">
              <input
                type="radio"
                name="payment_method"
                value="Cash on Delivery"
                checked={
                  formData.payment_method ===
                  "Cash on Delivery"
                }
                onChange={handleChange}
              />
              Cash on Delivery
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="payment_method"
                value="Razorpay"
                checked={
                  formData.payment_method ===
                  "Razorpay"
                }
                onChange={handleChange}
              />
              Razorpay
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="payment_method"
                value="UPI"
                checked={
                  formData.payment_method ===
                  "UPI"
                }
                onChange={handleChange}
              />
              UPI
            </label>

          </div>

        </div>

        {/* Right */}

        <div className="checkout-right">

          <div className="summary-card">

            <h2>Order Summary</h2>

            {cartItems.map((item) => (

              <div
                className="summary-item"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.title}
                />

                <div>

                  <h4>{item.title}</h4>

                  <p>Qty : {item.quantity}</p>

                </div>

                <span>
                  ₹{item.price * item.quantity}
                </span>

              </div>

            ))}

          <div className="available-coupons">

            <h3>
              <TicketPercent size={18} />
              Available Coupons
            </h3>

            {coupons.length === 0 ? (

              <p>No coupons available.</p>

            ) : (

              coupons.map((coupon) => (

                <div
                  className="coupon-box"
                  key={coupon.id}
                >

                  <div className="coupon-details">

                    <h4>{coupon.code}</h4>

                    <p>
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}% OFF`
                        : `₹${coupon.discount_value} OFF`}
                    </p>

                    <small>
                      Minimum Order ₹{coupon.min_order}
                    </small>

                  </div>

                  {selectedCoupon?.id === coupon.id ? (

                    <button
                      type="button"
                      className="remove-coupon-btn"
                      onClick={removeCoupon}
                    >
                      Remove
                    </button>

                  ) : (

                    <button
                      type="button"
                      className="apply-coupon-btn"
                      onClick={() => applyCoupon(coupon)}
                    >
                      Apply
                    </button>

                  )}

                </div>

              ))

            )}

          </div>
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="price-row">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge}</span>
            </div>
           <div className="price-row">
  <span>Coupon Discount</span>

  <span style={{ color: "green" }}>
    - ₹{discount}
  </span>
</div>

<div className="price-row total-row">
  <span>Total</span>
  <span>₹{total}</span>
</div>

           <button
  className="place-order-btn"
  onClick={placeOrder}
  disabled={placingOrder}
>
  {placingOrder ? "Placing Order..." : "Place Order"}
</button>

          </div>

        </div>

      </div>
    </section>
     
    </>
  );
}

export default Checkout;
