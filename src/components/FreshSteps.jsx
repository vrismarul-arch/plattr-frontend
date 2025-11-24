import React, { useEffect } from "react";
import {
  WhatsAppOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "./FreshSteps.css";

const steps = [
  {
    id: 1,
    title: "Message Us",
    desc: (
      <>
        WhatsApp “Hi” to{" "}
        <a
          href="https://wa.me/919150948143"
          target="_blank"
          rel="noopener noreferrer"
          className="step-link"
        >
          91509 48143
        </a>
      </>
    ),
    icon: <WhatsAppOutlined />,
    color: "#25D366",
  },
  {
    id: 2,
    title: "Pick Your Plan",
    desc: "Choose One-time, Weekly, or Monthly",
    icon: <ShoppingOutlined />,
    color: "#FF9800",
  },
  {
    id: 3,
    title: "Get it Delivered",
    desc: "Freshly prepared and delivered to your doorstep",
    icon: <ShoppingCartOutlined />,
    color: "#00BCD4",
  },
];

const FreshSteps = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("show");
        });
      },
      { threshold: 0.2 }
    );

    const hiddenEls = document.querySelectorAll(".flow-step");
    hiddenEls.forEach((el) => observer.observe(el));
  }, []);

  return (
    <section className="steps-section">
      <h2 className="steps-heading">
        <span>Your daily freshness</span> <br /> in 3 easy steps
      </h2>

      <div className="steps-flow">
        {steps.map((step, i) => (
          <div className="flow-step hidden" key={i}>
            <div
              className="flow-icon"
              style={{ backgroundColor: step.color }}
            >
              {step.icon}
            </div>
            <div className="flow-card">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
            {i < steps.length - 1 && <div className="flow-line" />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FreshSteps;
