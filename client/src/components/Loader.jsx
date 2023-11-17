import React from "react";
import { FadeLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="d-flex justify-content-center">
      <FadeLoader />
    </div>
  );
};

export default Loader;
