import React from "react";
import "./PriceOptionBox.css";

const PriceOptionBox = ({ weight, price, perUnit, discount }) => {
  return (
    <div className="price-option-box">
      {discount && <div className="price-tag">{discount}% off</div>}

      <p className="opt-weight">{weight}</p>
      <p className="opt-price">₹{price}</p>
      <p className="opt-perunit">₹ {perUnit}</p>
    </div>
  );
};

export default PriceOptionBox;
