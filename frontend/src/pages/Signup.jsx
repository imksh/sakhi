import React, { useState, useEffect } from "react";

import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { GoEyeClosed, GoEye } from "react-icons/go";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";

import { useAuthStore } from "../store/useAuthStore.js";
import Footer from "../components/Footer";
import { useUsersStore } from "../store/useUserStore";

export const Signup = () => {
  const { isSigningUp, signup } = useAuthStore();
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    otp: "",
  });
  const { tempEmail, verifyEmail } = useUsersStore();
  const [time, setTime] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
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
    if (input.password !== confirmPassword) {
      toast.error("Confirm your password");
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

    if (tempEmail[input.email].otp !== input.otp) {
      toast.error("Wrong OTP");
      return;
    }
    const data = {
      name: input.name,
      email: input.email,
      password: input.password,
      number: input.number,
      otp: input.otp,
      code: import.meta.env.VITE_PUBLIC_CODE,
    };
    await signup(data);
    setShow(false);
  };

  // const handleSendOTP = async (e) => {
  //   e.preventDefault();
  //   const success = validateForm();
  //   if (!success) return;
  //   const res = await verifyEmail(input);
  //   if (!res) return;
  //   setShow(true);
  //   setTime(59);
  // };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (!success) return;
    try {
      setIsChecking(true);
      const res = await verifyEmail(input.email, input.name);
      if (res) {
        setShow(true);
        setTime(59);
        setIsChecking(false);
      } else {
        toast.error("Email sending failed");
        setIsChecking(false);
      }
    } catch (error) {
      console.log(error);
      setIsChecking(false);
    }
  };

  return (
    <div className="pt-[10dvh]">
      <div
        className={`flex  justify-between w-full md:w-full md:p-10 mx-auto gap-24`}
      >
        <div className={`hidden md:flex flex-col items-center w-[50%] `}>
          <figure>
            <img src="/images/Login.png" alt="" className=" lg:w-[400px]" />
          </figure>
          <div className="flex flex-col">
            <p className="mx-auto font-bold text-2xl mb-4">
              ⚠️ Important Notice
            </p>
            <p>
              We’re currently running on a free server, so OTP delivery may be
              delayed or occasionally fail. If you don’t receive the OTP and
              want to try the app right away, you can log in using the demo
              credentials below:
            </p>
            <br />
            <p>
              <b>Email:</b> demo@sakhi.com{" "}
            </p>
            <p>
              <b>Password:</b> demo@123
            </p>
            <br />
            <p className="text-[14px] text-gray-500 mx-auto">
              We’re working on improving reliability. Thanks for your patience.
            </p>
          </div>
        </div>
        <div
          className={`md:border p-4 md:p-12 rounded min-h-[70dvh] mx-auto  min-w-[45%] h-fit`}
        >
          {show ? (
            <form
              className={`flex flex-col gap-2 relative items-center text-center`}
              onSubmit={handleSubmit}
            >
              <button
                className="absolute top-3 left-2 text-3xl font-bold"
                onClick={() => setShow(false)}
                type="button"
              >
                <IoMdArrowRoundBack className={``} />
              </button>
              <div className="flex flex-col justify-center items-center">
                <h3 className="text-3xl font-bold mt-2 mb-6">Verify Email</h3>
                <p>{`A verification email is sent on ${input.email}`}</p>
              </div>
              <div className={``}>
                <input
                  type="text"
                  name="otp"
                  placeholder="Verification code"
                  value={input.otp}
                  onChange={handleInputChange}
                  className="border p-3 rounded w-auto md:w-100 placeholder-gray-400 outline-blue-500"
                />
              </div>
              <div className="flex">
                <p>Resend otp in {time} seconds ‎ ‎ </p>
                {time == 0 && (
                  <p
                    className="underline text-blue-500"
                    onClick={handleSendOTP}
                  >
                    Resend
                  </p>
                )}
              </div>
              <div className={`mx-auto my-6`}>
                <button
                  disabled={isSigningUp || time === 0}
                  className={`bg-blue-500 mx-auto px-4 py-2 rounded-2xl text-white ${
                    time === 0 ? "bg-zinc-300" : "bg-[#4c91c7]"
                  }`}
                >
                  {!isSigningUp ? (
                    "Sign up"
                  ) : (
                    <Loader className="size-6 animate-spin" />
                  )}
                </button>
              </div>
              <div className={``}>
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="underline text-blue-500">
                    Sign in
                  </Link>
                </p>
              </div>
              <p className="text-sm text-gray-600 w-[90%] text-center mt-4">
                A verification email has been sent to {input.email}.
              </p>
            </form>
          ) : (
            <form className={`flex flex-col gap-2`} onSubmit={handleSendOTP}>
              <div>
                <h3 className="text-3xl my-2 font-bold">Create an account</h3>
              </div>
              <div className={``}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={input.name}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full placeholder-gray-400 outline-blue-500"
                />
              </div>
              <div className={``}>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={input.email}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full placeholder-gray-400 outline-blue-500"
                  />
                </div>
              </div>
              <div className={``}>
                <input
                  type="text"
                  name="number"
                  placeholder="Phone Number"
                  value={input.number}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full placeholder-gray-400 outline-blue-500"
                />
              </div>
              <div className={`relative flex items-center`}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={input.password}
                  onChange={handleInputChange}
                  className="border p-2 pr-8 rounded w-full placeholder-gray-400 outline-blue-500"
                />
                <button
                  className={`absolute right-2`}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <GoEye /> : <GoEyeClosed />}
                </button>
              </div>

              <div className={``}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`border p-2 rounded w-full placeholder-gray-400 outline-blue-500 ${
                    confirmPassword !== "" && confirmPassword !== input.password
                      ? "border-red-500 "
                      : ""
                  } `}
                />
              </div>

              <div className={`my-4 mx-auto`}>
                <button
                  className={`bg-blue-500 mx-auto px-4 py-2 rounded-2xl text-white`}
                  disabled={isChecking}
                >
                  {!isChecking ? (
                    "Send OTP"
                  ) : (
                    <Loader className="size-6 animate-spin" />
                  )}
                </button>
              </div>
              <div className={`mx-auto`}>
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="underline text-blue-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="flex md:hidden flex-col w-[80%] mx-auto mt-8">
        <h2 className="mx-auto font-bold text-xl mb-4">⚠️ Important Notice</h2>
        <p>
          We’re currently running on a free server, so OTP delivery may be
          delayed or occasionally fail. If you don’t receive the OTP and want to
          try the app right away, you can log in using the demo credentials
          below:
        </p>
        <br />
        <p>
          <b>Email:</b> demo@sakhi.com{" "}
        </p>
        <p>
          <b>Password:</b> demo@123
        </p>
        <br />
        <p className="text-[14px] text-gray-500 mx-auto text-center">
          We’re working on improving reliability. Thanks for your patience.
        </p>
      </div>
      <Footer />
    </div>
  );
};
