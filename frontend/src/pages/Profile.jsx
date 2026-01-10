import React, { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { useAuthStore } from "../store/useAuthStore.js";
import { FaCamera } from "react-icons/fa";
import { useThemeStore } from "../store/useThemeStore";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";

import Lottie from "lottie-react";
import infinity from "../assets/animations/infinity.json";
import Footer from "../components/Footer";
import { motion } from "motion/react";

export const Profile = () => {
  const navigate = useNavigate();
  const {
    authUser,
    isUpdatingProfile,
    updateProfile,
    updateVisibility,
    logout,
    onlineUsers,
  } = useAuthStore();
  const { setUser } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [visible, setVisible] = useState(true);
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Img = reader.result;
      setSelectedImg(base64Img);
      await updateProfile({ profilePic: base64Img });
    };
  };

  const handleVisibility = (e) => {
    e.preventDefault();
    updateVisibility({ visible });
  };

  const { setTheme } = useThemeStore();
  const light = () => {
    setTheme("light");
  };
  const dark = () => {
    setTheme("dark");
  };

  const exit = () => {
    setUser(null);
    localStorage.clear();
    logout();
  };
  return (
    <div className="pt-[10dvh] flex flex-col items-center relative h-dvh overflow-auto hide-scrollbar">
      <div className="bg-blue-500 text-white px-4 h-[10dvh] flex items-center justify-between fixed top-0 left-0 w-full z-99 shrink-0 ">
        <div className="flex gap-2 items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={() => navigate("/")}
            className="flex gap-2 items-center"
          >
            <IoMdArrowRoundBack size={24} />
            <h2 className="font-bold">Profile</h2>
          </motion.button>
        </div>
      </div>
      <div className="mt-10 relative w-fit">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{
            scale: 0.9,
          }}
          className=""
        >
          <img
            src={selectedImg || authUser.profilePic || "/images/avtar.png"}
            alt=""
            className="w-36 h-36 lg:w-56 lg:h-56 object-cover rounded-full border-4 border-blue-500 cursor-pointer"
            onClick={() =>
              navigate(
                `/view/image?src=${encodeURIComponent(authUser.profilePic)}`
              )
            }
          />
        </motion.div>
        <motion.label
          whileHover={{ scale: 1.1 }}
          whileTap={{
            scale: 0.9,
          }}
          htmlFor="upload"
          className="absolute right-0 lg:right-3 bottom-6 bg-blue-500 p-2 lg:p-3 rounded-full text-white cursor-pointer"
        >
          <motion.div
            whileHover={{ x: [-5, 0, 5, 0], y: [-5, 0, 5, 0] }}
            transition={{ duration: 1 }}
            className=""
          >
            <FaCamera className="" />
          </motion.div>

          <input
            type="file"
            id="upload"
            style={{ display: "none" }}
            disabled={isUpdatingProfile}
            onChange={handleUpload}
          />
        </motion.label>
      </div>
      <p style={{ marginTop: "10px" }}>
        {isUpdatingProfile
          ? "Uploding..."
          : "Click on the icon to update your display picture"}
      </p>
      <div className="flex flex-col items-baseline md:w-[30%] w-[90%] mt-8 gap-4">
        <div className="flex flex-col w-full">
          <p className="flex items-center gap-2">
            <IoPerson className="" /> Name
          </p>
          <p className="border p-3 mt-2 rounded w-full">{authUser.name}</p>
        </div>
        <div className="flex flex-col w-full">
          <p className="flex items-center gap-2">
            <MdOutlineEmail className="" /> Email
          </p>
          <p className="border p-3 mt-2 rounded w-full">{authUser.email}</p>
        </div>
        <div className="flex flex-col w-full">
          <p className="flex items-center gap-2">
            <IoPerson className="" />
            Phone Number
          </p>
          <p className="border p-3 mt-2 rounded w-full">
            {authUser.number || "0000000000"}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:w-[30%] w-[90%] border my-4 p-4 rounded gap-2">
        <h2 className="font-bold mb-3 text-[20px]">Account Information</h2>
        <div className=" flex justify-between">
          <p className="font-bold">Member since</p>
          <p>{authUser.createdAt?.split("T")[0]}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-bold">Account Status</p>
          <p
            style={onlineUsers.includes(authUser._id) ? { color: "green" } : {}}
          >
            {onlineUsers.includes(authUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:w-[30%] w-[90%] border my-4 p-4 rounded gap-2">
        <form onSubmit={handleVisibility} className="">
          <div>
            <label for="visible" className="text-xl font-bold block">
              Account Visibility
            </label>
            <motion.select
              whileHover={{ scale: 1.1 }}
              whileTap={{
                scale: 0.9,
              }}
              id="visible"
              name="visible"
              className="shadow px-4 py-2 rounded-2xl border flex mt-2 cursor-pointer"
              onChange={(e) => setVisible(e.target.value === "true")}
            >
              <option value={true}>Public</option>
              <option value={false}>Private</option>
            </motion.select>
          </div>
          <br />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.9,
            }}
            className="px-4 py-2 bg-blue-500 rounded-2xl text-white float-end"
          >
            Update
          </motion.button>
        </form>
      </div>
      <div className="flex flex-col md:w-[30%] w-[90%] border my-4 p-4 rounded gap-2">
        <h2 className="text-xl font-bold block">Themes</h2>
        <div className={`flex justify-around my-6`}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.9,
            }}
            className={`bg-white text-black border px-6 py-2 rounded-xl`}
            onClick={light}
          >
            Light
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.9,
            }}
            className={`bg-gray-700 text-white   px-6 py-2 rounded-xl`}
            onClick={dark}
          >
            Dark
          </motion.button>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{
          scale: 0.9,
        }}
        className={`bg-red-500 py-3 rounded-2xl font-bold hover:bg-red-600 my-8 w-[80%] md:w-[25%]`}
        onClick={exit}
        style={{ color: "#fff" }}
      >
        Logout
      </motion.button>
      <div className="my-10">
        <Footer />
      </div>
    </div>
  );
};
