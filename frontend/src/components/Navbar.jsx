import { NavLink, useLocation } from "react-router-dom";
import { LuLogOut, LuSettings, LuLogIn } from "react-icons/lu";
import { IoPerson } from "react-icons/io5";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";
import { useThemeStore } from "../store/useThemeStore.js";

export const Navbar = () => {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isHomePage = location.pathname === "/";
  const isErrorPage = location.pathname === "/error404";
  const isStartPage = location.pathname === "/start";
  const { user } = useChatStore();
  const [width, setWidth] = useState(window.innerWidth);
  const { theme, setTheme, colors } = useThemeStore();

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isHomePage && user && width < 700) return null;
  return (
    <div
      className={`fixed h-[10dvh] w-full bg-blue-500 flex text-white justify-between items-center ${
        authUser ? "px-4" : "px-4 lg:px-14"
      } z-50`}
    >
      <div className="flex">
        <NavLink to="/">
          <div className="flex gap-2 lg:gap-4 items-center">
            <figure>
              <img src="logo.png" alt="logo" className="w-10 lg:w-12" />
            </figure>
            <h1 className="lg:text-2xl font-bold">Sakhi</h1>
          </div>
        </NavLink>
      </div>
      <div className="flex items-center gap-2">
        <ul className="flex items-center gap-4">
          {authUser && (
            <li className="flex md:hidden">
              <NavLink to="/profile">
                {({ isActive }) => (
                  <motion.div className="">
                    <img
                      src={authUser.profilePic || "./images/avtar.png"}
                      alt={authUser.name}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover"
                    />
                  </motion.div>
                )}
              </NavLink>
            </li>
          )}
          {!authUser && (
            <>
              <li>
                {isLoginPage ? (
                  <NavLink to="/signup">
                    {({ isActive }) => (
                      <span className="flex items-center gap-2">
                        <LuLogIn className="" size={20} />
                        <span className=""> Signup</span>
                      </span>
                    )}
                  </NavLink>
                ) : (
                  <NavLink to="/login">
                    {({ isActive }) => (
                      <span className="flex items-center gap-2">
                        <LuLogIn className="" size={20} />
                        <span className=""> Login</span>
                      </span>
                    )}
                  </NavLink>
                )}
              </li>
              {!isStartPage && (
                <li className="flex items-center">
                  {theme === "light" ? (
                    <button onClick={() => setTheme("dark")}>
                      <MdOutlineDarkMode size={24} />
                    </button>
                  ) : (
                    <button onClick={() => setTheme("light")}>
                      <BsBrightnessHigh size={24} />
                    </button>
                  )}
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
