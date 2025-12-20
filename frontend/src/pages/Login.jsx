import { useState, useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { TbLoader2 } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Loader } from "lucide-react";
import { GoEyeClosed, GoEye } from "react-icons/go";
import toast from "react-hot-toast";
import Footer from '../components/Footer';
export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { authUser, isLoggingIng, login } = useAuthStore();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const STATE_MACHINE = "Login Machine";
  const { rive, RiveComponent } = useRive({
    src: "/animations/loginBear.riv",
    stateMachines: STATE_MACHINE,
    autoplay: true,
  });

  const isHandsUp = useStateMachineInput(rive, STATE_MACHINE, "isHandsUp");
  const isChecking = useStateMachineInput(rive, STATE_MACHINE, "isChecking");
  const trigSuccess = useStateMachineInput(rive, STATE_MACHINE, "trigSuccess");
  const trigFail = useStateMachineInput(rive, STATE_MACHINE, "trigFail");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!input.email.trim()) return toast.error("Email is required");
    if (!input.password.trim()) return toast.error("Password is required");
    if (input.password.length < 6)
      return toast.error("Password should be at least 6 character");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (!success) return;
    if (authUser) {
      trigSuccess?.fire();
    } else {
      trigFail?.fire();
    }
    login(input);
  };

  const pass = () => {
    if (showPassword) {
      isHandsUp.value = true;
    } else {
      isHandsUp.value = false;
    }
    setShowPassword(!showPassword);
  };

  return (
    <div className="pt-[10dvh]">
      <div className="w-52 h-52 rounded-full overflow-hidden mx-auto my-8">
        <RiveComponent />
      </div>

      <div className="flex flex-col mx-auto justify-center items-center gap-3">
        <h2 className="text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            name="email"
            value={input.email}
            onChange={handleInputChange}
            placeholder="Email"
            onFocus={() => (isChecking.value = true)}
            onBlur={() => (isChecking.value = false)}
            className="border p-2 rounded placeholder-gray-400 outline-blue-500"
          />
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={input.password}
              onChange={handleInputChange}
              placeholder="Password"
              onFocus={() => (isHandsUp.value = true)}
              onBlur={() => (isHandsUp.value = false)}
              className="border p-2 pr-8 rounded placeholder-gray-400 outline-blue-500"
            />
            <button className="absolute right-2" type="button" onClick={pass}>
              {showPassword ? <GoEye /> : <GoEyeClosed />}
            </button>
          </div>
          <button
            type="submit"
            className="px-8 py-2 bg-blue-500 w-fit mx-auto rounded-2xl text-white mt-2"
          >
            {!isLoggingIng ? (
              "Login"
            ) : (
              <Loader className="size-7 animate-spin" />
            )}
          </button>
        </form>
        <div className="cursor-pointer">
          <p>
            Didn't have an account?{" "}
            <Link to="/signup" className="underline text-blue-500">
              Register
            </Link>
          </p>
        </div>
      </div>
      <div className="flex flex-col w-[80%] max-w-[500px] mx-auto mt-8">
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
