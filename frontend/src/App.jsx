import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Signup } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore.js";
import { Loader } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useChatStore } from "./store/useChatStore";
import { Loading } from "./components/Loading";
import Start from "./pages/Start";
import { useUIStore } from "./store/useUIStore";
import AI from "./pages/AI";
import Footer from "../src/components/Footer";
import { ImagePreviewPage } from "./pages/ImagePreviewPage";
import Error404 from "./pages/Error404";
import { useUsersStore } from "./store/useUserStore.js";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth, logout } = useAuthStore();
  const { setMessages, setUser } = useChatStore();
  const { theme, colors } = useThemeStore();
  const { privateKey, getKey } = useUsersStore();

  const { setShowOption, setShowMsgOption } = useUIStore();

  const [height, setHeight] = useState(
    window.visualViewport ? window.visualViewport.height : window.innerHeight
  );

  //get private key
  useEffect(() => {
    if (!authUser) return;
    const flag = getKey();
    if (!flag) {
      setUser(null);
      localStorage.clear();
      toast.error("Private key is Missing");
      logout();
    }
  }, []);

  //handle resize
  useEffect(() => {
    const handleResize = () => {
      const vh = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;

      setHeight(vh);
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //handle theme
  useEffect(() => {
    document.body.style.backgroundColor = colors.surface;
    document.body.style.color = colors.text;
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, [theme]);

  //checking auth
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  //fetching messages
  useEffect(() => {
    if (!authUser) return;
    const fetch = async () => {
      await setMessages();
    };
    fetch();
  }, [authUser, privateKey]);

  //request notifications permissions
  useEffect(() => {
    if (!authUser) return;

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        subscribeUserToPush();
        console.log("Notification permission granted!");
      } else {
        console.log("Notification permission denied.");
      }
    });
  }, [authUser]);

  //subscribe to push
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  const subscribeUserToPush = async () => {
    const sw = await navigator.serviceWorker.ready;

    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY
      ),
    });

    const url =
      import.meta.env.VITE_ENV === "production"
        ? "https://sakhi-wt7s.onrender.com/api/auth/web-subscribe"
        : "http://localhost:5001/api/auth/web-subscribe";
    // const url = "http://localhost:5001/api/auth/web-subscribe";
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
      credentials: "include",
    });

    console.log("User subscribed to push notifications");
  };

  if (isCheckingAuth) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Footer hide={true} />
      </div>
    );
  }
  return (
    <div
      onClick={() => {
        setShowMsgOption("");
        setShowOption(false);
      }}
      style={{ height: height }}
    >
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/home" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/home"
          element={!authUser ? <Start /> : <Navigate to="/" />}
        />
        <Route path="/view/image" element={<ImagePreviewPage />} />
        <Route path="/ai" element={<AI />} />

        <Route path="/*" element={<Error404 />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
