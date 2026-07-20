import { useState, useEffect } from "react";
import "./Stats.css"
function Counter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 20);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <h2>
      {count}
      {suffix}
    </h2>
  );
}

export default function Stats() {
  return (
    <section className="stats-section">

      <div className="stat-card">
        <Counter end={42} suffix="%" />
        <p>YIELD INCREASE</p>
      </div>

      <div className="stat-card">
        <Counter end={150} suffix="k+" />
        <p>FARMERS SERVED</p>
      </div>

      <div className="stat-card">
        <Counter end={24} suffix="+" />
        <p>GLOBAL MARKETS</p>
      </div>

      <div className="stat-card">
        <Counter end={99.8} suffix="%" />
        <p>PRODUCT PURITY</p>
      </div>

    </section>
  );
}