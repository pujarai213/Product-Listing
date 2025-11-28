import React from "react";

const HeaderComponent = () => {
  return (
    <div className="w-full h-[40vh] relative">
      <img
        src="pic.jpg"
        alt="Header"
        className="w-full h-full object-cover brightness-75"
      />
      <h1 className="absolute bottom-0 left-0 text-white text-7xl font-extrabold drop-shadow-lg">
        SHOP the BEST.
      </h1>
    </div>
  );
};

export default HeaderComponent;
