import React from "react";
import Lottie from "lottie-react";
import Err from "../assets/animations/error404.json";
import { useThemeStore } from "../store/useThemeStore";
import { useNavigate } from "react-router-dom";

function Error404() {
  const { theme, colors } = useThemeStore();
  const navigate = useNavigate();
  return (
    <>
      <div
        className={`z-[99] absolute top-0 left-0  w-full h-dvh flex justify-center items-center overflow-hidden`}
        style={{ backgroundColor: colors.surface }}
      >
        <Lottie animationData={Err} loop className="w-full" />
      </div>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 absolute z-[100] bottom-[10%] left-[10%]"
      >
        Home
      </button>
    </>
  );
}

export default Error404;
