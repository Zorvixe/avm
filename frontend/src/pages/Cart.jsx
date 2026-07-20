import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  // Increase Quantity
  const increaseQty = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    setCartItems(updated);

    localStorage.setItem("cart", JSON.stringify(updated));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Decrease Quantity
  const decreaseQty = (id) => {
    const updated = cartItems
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updated);

    localStorage.setItem("cart", JSON.stringify(updated));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Remove Product
  const removeItem = (id) => {
    const updated = cartItems.filter(
      (item) => item.id !== id
    );

    setCartItems(updated);

    localStorage.setItem("cart", JSON.stringify(updated));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>

        <Link to="/products" className="shop-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="cart-page">
      <h1>Shopping Cart</h1>

      {cartItems.map((item) => (
        <div className="cart-card" key={item.id}>
          <img
            src={item.image}
            alt={item.title}
          />

          <div className="cart-info">
            <h3>{item.title}</h3>

            <p>{item.npk}</p>

            <h2>₹{item.price}</h2>
          </div>

          <div className="qty-box">
            <button
              onClick={() => decreaseQty(item.id)}
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => increaseQty(item.id)}
            >
              +
            </button>
          </div>

          <h3>
            ₹{item.price * item.quantity}
          </h3>

          <button
            className="remove-btn"
            onClick={() => removeItem(item.id)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="cart-total">
        <h2>Total : ₹{total}</h2>

        <Link to="/checkout">
  <button className="checkout-btn">
    Proceed to Checkout
  </button>
</Link>
      </div>
    </section>
  );
}

export default Cart;