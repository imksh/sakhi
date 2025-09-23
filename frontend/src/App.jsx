import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Signup } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore.js";
import { Loader } from "lucide-react";
import { Toaster,toast } from "react-hot-toast";
import { useChatStore } from './store/useChatStore';
import { NoChat } from './components/NoChat';

const App = () => {
  const { authUser, isCheckingAuth, checkAuth,onlineUsers } = useAuthStore();
  const{allUsers} = useChatStore();
  const {theme} = useThemeStore();
  useEffect(() => {
    if (theme === "dark") {
      document.body.style.backgroundColor = "#1d232b";
    } else {
      document.body.style.backgroundColor = "#fff";
    }
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, [theme]);

  useEffect(() => {
    checkAuth();
    console.log("online: ",onlineUsers);
    
  }, [checkAuth,onlineUsers]);

   useEffect(() => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      subscribeUserToPush();
      console.log("Notification permission granted!");
    } else {
      console.log("Notification permission denied.");
    }
  });
}, []);


  function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
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

  await fetch("https://sakhi-6j3g.onrender.com/api/auth/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  console.log("User subscribed to push notifications");
};



 
useEffect(() => {
  if (!authUser || !Array.isArray(authUser.contacts) || !allUsers.length) return;

  const onlineContacts = authUser.contacts.filter(contactId =>
    onlineUsers.includes(contactId)
  );

  const u = [...new Set(onlineContacts)];

  u.forEach(contactId => {
    const contact = allUsers.find(u => u._id === contactId);
    if (contact) {
      toast.success(`${contact.name} is online`);
    }
  });
}, [onlineUsers]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen" data-theme={theme} >
        <div className="flex flex-col ">
        <NoChat name="Hang tight, almost there! ⏳" />
        <div className="h-3"></div>
        <Loader className="size-10 animate-spin self-center" />
        </div>
      </div>
    );
  }
  return (
    <div data-theme={theme} style={{marginTop:"10vh"}}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
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
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
