import styles from "./Navbar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { LuLogOut, LuSettings, LuLogIn } from "react-icons/lu";
import { IoPerson } from "react-icons/io5";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from '../store/useChatStore';
import {useState,useEffect} from "react"

export const Navbar = () => {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isHomePage = location.pathname === "/";
  const {selectedUser}=useChatStore();
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if(isHomePage && selectedUser && width<700) return null;
  return (
    <div className={styles.nav}>
      <div className={styles.name}>
        <NavLink to="/">
          <div className={styles.logo}>
            <figure>
              <img src="logo.png" alt="logo" />
            </figure>
            <h1>Sakhi</h1>
          </div>
        </NavLink>
      </div>
      <div className={styles.lists}>
        <ul>
          {authUser && (
            <li>
              <NavLink to="/profile">
                {({ isActive }) => (
                  <span className={isActive ? styles.active : styles.inactive}>
                    <img src={authUser.profilePic || "./images/avtar.png"} alt={authUser.name} />
                  </span>
                )}
              </NavLink>
            </li>
          )}
          {!authUser && (
            <li>
              {isLoginPage ? (
                <NavLink to="/signup">
                  {({ isActive }) => (
                    <span
                      className={isActive ? styles.active : styles.inactive}
                    >
                      <LuLogIn className={styles.icon} />
                      <span className={styles.hide}> Signup</span>
                    </span>
                  )}
                </NavLink>
              ) : (
                <NavLink to="/login">
                  {({ isActive }) => (
                    <span
                      className={isActive ? styles.active : styles.inactive}
                    >
                      <LuLogIn className={styles.icon} />
                      <span className={styles.hide}> Login</span>
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
