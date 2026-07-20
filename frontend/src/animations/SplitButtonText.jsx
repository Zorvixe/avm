import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

const SplitButtonText = ({
  text,
  className = "",
  delay = 0.03,
  duration = 0.45,
  ease = "power3.out",
  from = { y: "100%" },
  to = { y: "0%" },
  hoverTo = { y: "-100%" },
  tag = "span",
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars;

    gsap.set(chars, from);

    gsap.to(chars, {
      ...to,
      duration,
      ease,
      stagger: delay,
    });

    const parentButton = textRef.current.closest("button");

    const mouseEnter = () => {
      gsap.to(chars, {
        ...hoverTo,
        duration: 0.35,
        ease: "power2.out",
        stagger: delay,
      });

      gsap.set(chars, {
        y: "100%",
        delay: 0.35,
      });

      gsap.to(chars, {
        y: "0%",
        duration: 0.35,
        ease: "power2.out",
        stagger: delay,
        delay: 0.36,
      });
    };

    parentButton?.addEventListener("mouseenter", mouseEnter);

    return () => {
      parentButton?.removeEventListener("mouseenter", mouseEnter);
      split.revert();
    };
  }, []);

  const Tag = tag;

  return (
    <Tag
      ref={textRef}
      className={className}
      style={{
        display: "inline-block",
        overflow: "hidden",
      }}
    >
      {text}
    </Tag>
  );
};

export default SplitButtonText;