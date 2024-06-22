"use client";

import { ChevronUp } from "tabler-icons-react";

const BtnScrollToTop = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="btn btn-circle"
    >
      <ChevronUp />
    </button>
  );
};

export default BtnScrollToTop;
