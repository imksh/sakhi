import React, { useState } from "react";
import styles from "./Profile.module.css";
import { MdOutlineEmail } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { useAuthStore } from "../store/useAuthStore.js";
import { FaCamera } from "react-icons/fa";
import { useThemeStore } from "../store/useThemeStore";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useChatStore } from '../store/useChatStore';

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
  const{setSelectedUser}=useChatStore();
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

  const exit= () =>{
    setSelectedUser(null)
    localStorage.clear();
     logout()
  }
  return (
    <div className={styles.container}>
      <button onClick={() => navigate("/")}>
        <IoMdArrowRoundBack className={styles.backBtn} />
      </button>
      <div className={styles.imageDiv}>
        <div className={styles.imageContainer}>
          <img
            src={selectedImg || authUser.profilePic || "/images/avtar.png"}
            alt=""
          />
        </div>
        <label htmlFor="upload" className={styles.upload}>
          <FaCamera className={styles.camera} />
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
      <div className={styles.info}>
        <div className={styles.box}>
          <p>
            <IoPerson className={styles.icon} /> Name
          </p>
          <p className={styles.name}>{authUser.name}</p>
        </div>
        <div className={styles.box}>
          <p>
            <MdOutlineEmail className={styles.icon} /> Email
          </p>
          <p className={styles.name}>{authUser.email}</p>
        </div>
        <div className={styles.box}>
          <p>
            <IoPerson className={styles.icon} />
            Phone Number
          </p>
          <p className={styles.name}>{authUser.number}</p>
        </div>
      </div>
      <div className={styles.moreInfo}>
        <h2>Account Information</h2>
        <div className={styles.moreInfoSection}>
          <p>Member since</p>
          <p>{authUser.createdAt?.split("T")[0]}</p>
        </div>
        <div className={styles.moreInfoSection}>
          <p>Account Status</p>
          <p
            style={onlineUsers.includes(authUser._id) ? { color: "green" } : {}}
          >
            {onlineUsers.includes(authUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className={`${styles.moreInfo} ${styles.visible}`}>
        <form onSubmit={handleVisibility} className={styles.visible}>
          <div>
            <label for="visible" className="text-xl font-bold">
              Account Visibility
            </label>
            <select
              id="visible"
              name="visible"
              className={styles.dropdown}
              onChange={(e) => setVisible(e.target.value === "true")}
            >
              <option value={true}>Public</option>
              <option value={false}>Private</option>
            </select>
          </div>
          <br />
          <button className={styles.btn}>Update</button>
        </form>
      </div>
      <div className={`${styles.moreInfo}`}>
        <h2>Themes</h2>
        <div className={` ${styles.theme}`}>
          <button className={styles.btn} onClick={light}>
            Light
          </button>
          <button className={styles.btn} onClick={dark}>
            Dark
          </button>
        </div>
      </div>
      <button
        className={styles.logout}
        onClick={exit}
        style={{ color: "#fff" }}
      >
        Logout
      </button>
    </div>
  );
};
