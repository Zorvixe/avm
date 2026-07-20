import "./AnimatedWave.css";
import { useNavigate } from "react-router-dom";
import SplitButtonText from "./SplitButtonText";
function AnimatedWave() {
   const navigate = useNavigate();
  return (
    <div className="wave-wrapper">
      <svg
        viewBox="0 0 1440 850"
        preserveAspectRatio="xMidYMid slice"
        className="wave-svg"
      >
        {/* Single Animated Wave */}
        <path fill="#c4e7b8">
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
M0,120 C300,180 560,60 850,140 C1120,220 1300,80 1440,120 L1440,900 L0,900 Z;
M0,120 C260,40 520,220 820,100 C1120,40 1280,220 1440,120 L1440,900 L0,900 Z;
M0,120 C280,220 560,40 840,160 C1090,80 1300,180 1440,120 L1440,900 L0,900 Z;
M0,120 C300,180 560,60 850,140 C1120,220 1300,80 1440,120 L1440,900 L0,900 Z"
          />
        </path>

        {/* Content */}
        <foreignObject
          x="220"
          y="140"
          width="1000"
          height="650"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="svg-content"
          >
            <span className="svg-tag">
              NURTURING NATURE • GROWING FUTURE
            </span>

            <h1>
              Premium <span>Fertilizers</span>
            </h1>

            <p>
              Our premium fertilizers are carefully formulated to provide essential nutrients that promote healthy plant growth and improve soil fertility. We are committed to helping farmers achieve higher crop yields through innovative and sustainable agricultural solutions. With a focus on quality, performance, and environmental responsibility, our products support stronger roots, healthier plants, and better harvests. Whether for field crops, fruits, vegetables, or plantations, our fertilizer range is designed to meet diverse farming needs. By combining advanced technology with years of agricultural expertise, we empower growers to cultivate productive farms while protecting the health of future generations.
            </p>

         <button
  className="split-btn"
  onClick={() => navigate("/products")}
>
  <SplitButtonText
    text="Explore Products"
    delay={0.03}
    duration={0.5}
    ease="power3.out"
  />
</button>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

export default AnimatedWave;