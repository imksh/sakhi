import React, { useState, useEffect } from "react";

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
    <div className="pt-[10dvh]">
      <div className={`flex  justify-between w-full md:w-[80%] md:p-10 mx-auto mt-10`}>
        <div className={`hidden md:flex`}>
          <figure>
            <img src="/images/Login.png" alt="" className=" lg:w-[400px]" />
          </figure>
        </div>
        <div className={`border p-4 md:p-12 rounded min-h-[70dvh] mx-auto  min-w-[45%]`}>
          {show ? (
            <form
              className={`flex flex-col gap-2 relative items-center`}
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
                  className="border p-3 rounded w-100"
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
                  className="border p-2 rounded w-full"
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
                    className="border p-2 rounded w-full"
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
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className={`relative flex items-center`}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={input.password}
                  onChange={handleInputChange}
                  className="border p-2 pr-8 rounded w-full"
                />
                <button
                  className={`absolute right-2`}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <GoEye /> : <GoEyeClosed />}
                </button>
              </div>

              <div className={`my-4 mx-auto`}>
                <button
                  className={`bg-blue-500 mx-auto px-4 py-2 rounded-2xl text-white`}
                  disabled={isSigningUp}
                >
                  {!isSigningUp ? (
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
    </div>
  );
};
