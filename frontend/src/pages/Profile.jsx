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
  const { setSelectedUser } = useChatStore();
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
    setSelectedUser(null);
    localStorage.clear();
    logout();
  };
  return (
    <div className="pt-[10dvh] flex flex-col items-center relative">
      <button
        onClick={() => navigate("/")}
        className="absolute left-[5%] top-[15dvh]"
      >
        <IoMdArrowRoundBack className="" size={30} />
      </button>
      <div className="mt-10 relative w-fit">
        <div className="">
          <img
            src={selectedImg || authUser.profilePic || "/images/avtar.png"}
            alt=""
            className="w-36 h-36 lg:w-56 lg:h-56 object-cover rounded-full border-4 border-blue-500"
          />
        </div>
        <label
          htmlFor="upload"
          className="absolute right-0 lg:right-3 bottom-6 bg-blue-500 p-2 lg:p-3 rounded-full text-white"
        >
          <FaCamera className="" />
          <input
            type="file"
            id="upload"
            style={{ display: "none" }}
            disabled={isUpdatingProfile}
            onChange={handleUpload}
          />
        </label>
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
            <select
              id="visible"
              name="visible"
              className="shadow px-4 py-2 rounded-2xl border flex mt-2"
              onChange={(e) => setVisible(e.target.value === "true")}
            >
              <option value={true}>Public</option>
              <option value={false}>Private</option>
            </select>
          </div>
          <br />
          <button className="px-4 py-2 bg-blue-500 rounded-2xl text-white float-end">
            Update
          </button>
        </form>
      </div>
      <div className="flex flex-col md:w-[30%] w-[90%] border my-4 p-4 rounded gap-2">
        <h2 className="text-xl font-bold block">Themes</h2>
        <div className={`flex justify-around my-6`}>
          <button
            className={`bg-white text-black border px-6 py-2 rounded-xl`}
            onClick={light}
          >
            Light
          </button>
          <button
            className={`bg-gray-700 text-white   px-6 py-2 rounded-xl`}
            onClick={dark}
          >
            Dark
          </button>
        </div>
      </div>
      <button
        className={`bg-red-500 py-3 rounded-2xl font-bold hover:bg-red-600 my-8 w-[80%] md:w-[25%]`}
        onClick={exit}
        style={{ color: "#fff" }}
      >
        Logout
      </button>
      <div className="my-10">
        <Footer />
      </div>
    </div>
  );
};
