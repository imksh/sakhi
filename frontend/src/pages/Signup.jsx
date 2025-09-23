import React, { useState, useEffect } from "react";
import styles from "./Signup.module.css";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { GoEyeClosed, GoEye } from "react-icons/go";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";

import { useAuthStore } from "../store/useAuthStore.js";

export const Signup = () => {
  const { isSigningUp, signup, verifyEmail } = useAuthStore();
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    otp: "",
  });
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (time === 0) return;
    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [time]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "number") {
      if (newValue.startsWith("+91")) {
        newValue = newValue.substring(3);
      }
      if (newValue.startsWith("0")) {
        newValue = newValue.substring(1);
      }
      newValue = newValue.replace(/\s/g, "");
    }

    setInput((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const validateForm = () => {
    if (!input.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!input.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!input.number.trim()) {
      toast.error("Phone Number is required");
      return false;
    }
    if (input.number.length !== 10) {
      toast.error("Wrong phone number");
      return false;
    }
    if (!input.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (input.password.length < 6) {
      toast.error("Password should be at least 6 character");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.otp.trim()) {
      toast.error("otp is required");
      return false;
    }
    await signup(input);
    setShow(false);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (!success) return;
    const res = await verifyEmail(input);
    if (!res) return;
    setShow(true);
    setTime(59);
  };
  return (
    <div className={styles.container}>
      <div className={styles.section1}>
        <figure>
          <img src="/images/Login.png" alt="" />
        </figure>
      </div>
      <div className={styles.section2}>
        {show ? (
          <form className={`${styles.form} relative`} onSubmit={handleSubmit}>
            <button
              className="absolute top-3 left-2 text-3xl font-bold"
              onClick={() => setShow(false)}
              type="button"
            >
              <IoMdArrowRoundBack className={styles.backBtn} />
            </button>
            <div className="flex flex-col justify-center items-center">
              <h3>Verify Email</h3>
              <p>{`A verification email is sent on ${input.email}`}</p>
            </div>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="otp"
                placeholder="Verification code"
                value={input.otp}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex">
              <p>Resend otp in {time} seconds ‎ ‎ </p>
              {time == 0 && (
                <p className="link link-primary" onClick={handleSendOTP}>
                  Resend
                </p>
              )}
            </div>
            <div className={styles.button}>
              <button
                className={`${styles.btn} ${
                  time === 0 ? "bg-zinc-300" : "bg-[#4c91c7]"
                }`}
                disabled={isSigningUp || time === 0}
              >
                {!isSigningUp ? (
                  "Sign up"
                ) : (
                  <Loader className="size-6 animate-spin" />
                )}
              </button>
            </div>
            <div className={styles}>
              <p>
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
            <p className="text-sm text-gray-600 w-[90%] text-center absolute bottom-5">
              A verification email has been sent to {input.email}. If you don’t
              see it, please check your Spam or Junk folder.
            </p>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleSendOTP}>
            <div>
              <h3>Create an account</h3>
            </div>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={input.name}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.inputbox}`}>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={input.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.inputbox}>
              <input
                type="text"
                name="number"
                placeholder="Phone Number"
                value={input.number}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.inputbox} ${styles.password}`}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={input.password}
                className={styles.inputPass}
                onChange={handleInputChange}
              />
              <button
                className={styles.eyebtn}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <GoEye /> : <GoEyeClosed />}
              </button>
            </div>

            <div className={styles.button}>
              <button
                className={`${styles.btn} bg-[#4c91c7]`}
                disabled={isSigningUp}
              >
                {!isSigningUp ? (
                  "Send OTP"
                ) : (
                  <Loader className="size-6 animate-spin" />
                )}
              </button>
            </div>
            <div className={styles}>
              <p>
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
