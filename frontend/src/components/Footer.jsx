import React from "react";
import Lottie from "lottie-react";
import infinity from "../assets/animations/infinity.json";

const Footer = ({ hide, name }) => {
  return (
    <div className=" flex flex-col items-center justify-center mt-20 gap-4 pb-8">
      <Lottie
        animationData={infinity}
        loop={true}
        style={{ width: 150, height: 150 }}
      />
      {!hide && (
        <p style={{ fontSize: 14 }} className="text-neutral-400">
          {name ? <p>{name}</p> : <p>© IdioticMinds | Crafted with ❤️</p>}
        </p>
      )}
    </div>
  );
};

export default Footer;
