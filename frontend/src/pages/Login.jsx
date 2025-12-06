import styles from "./Login.module.css";
import { useState, useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { TbLoader2 } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Loader } from "lucide-react";
import { GoEyeClosed, GoEye } from "react-icons/go";
import toast from "react-hot-toast";

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
  
  const handleSubmit = (e) => {
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
    <div className={styles.container}>
      <div className={styles.imageDiv}>
        <RiveComponent />
      </div>

      <div className={styles.loginForm}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            value={input.email}
            onChange={handleInputChange}
            placeholder="Email"
            onFocus={() => (isChecking.value = true)}
            onBlur={() => (isChecking.value = false)}
          />
          <div className={styles.password}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={input.password}
              onChange={handleInputChange}
              placeholder="Password"
              className={styles.inputPass}
              onFocus={() => (isHandsUp.value = true)}
              onBlur={() => (isHandsUp.value = false)}
            />
            <button className={styles.eyebtn} type="button" onClick={pass}>
              {showPassword ? <GoEye /> : <GoEyeClosed />}
            </button>
          </div>
          <button type="submit" className={styles.btn}>
            {!isLoggingIng ? (
              "Login"
            ) : (
              <Loader className="size-7 animate-spin" />
            )}
          </button>
        </form>
        <div className={{}}>
          <p>
            Didn't have an account?{" "}
            <Link to="/signup" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
