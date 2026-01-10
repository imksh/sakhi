import React from "react";
import Lottie from "lottie-react";
import infinity from "../assets/animations/infinity.json";
import { motion } from "motion/react";

const Footer = ({ hide, name }) => {
  return (
    <div className=" flex flex-col items-center justify-center mt-20 gap-4 pb-8">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{
          scale: 0.9,
        }}
        className="cursor-pointer"
      >
        <Lottie
          animationData={infinity}
          loop={true}
          style={{ width: 150, height: 150 }}
        />
      </motion.div>
      {!hide && (
        <p style={{ fontSize: 14 }} className="text-neutral-400">
          {name ? <p>{name}</p> : <p>© IdioticMinds | Crafted with ❤️</p>}
        </p>
      )}
    </div>
  );
};

export default Footer;
