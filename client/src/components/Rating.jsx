import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function Rating({ value, text }) {
  const stars = [1, 2, 3, 4, 5].map((num) => {
    const icon =
      value >= num ? (
        <FaStar key={num} />
      ) : value >= num - 0.5 ? (
        <FaStarHalfAlt key={num} />
      ) : (
        <FaRegStar key={num} />
      );
    return icon;
  });

  return (
    <span className="rating__star d-flex gap-2 align-items-center">
      {stars}
      <span className="fs-6 text-secondary">{text}</span>
    </span>
  );
}
