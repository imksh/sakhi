import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../components/Footer";
import { FaRegHeart, FaTelegramPlane } from "react-icons/fa";
import { motion } from "motion/react";
import Lottie from "lottie-react";
import infinity from "../assets/animations/infinity.json";

export default function Start() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-black">
      <div className=" relative pt-[10vh] w-full h-[90dvh] md:h-[95dvh] hero-section text-white grid grid-cols-1 md:flex px-[10%]">
        <div className="flex flex-col items-center md:items-baseline  -top-5 md:top-0 justify-baseline md:justify-center  w-full relative row-start-2">
          <motion.div whileHover={{ scale: 1.1 }}>
            <img src="/logo.png" alt="" className="w-10 animate-bounce" />
          </motion.div>
          <h2 className="font-extrabold text-5xl mb-2">Sakhi</h2>
          <p className="text-xl">Sakhi — A friend in every chat</p>
          <NavLink to="/signup" className="mt-8 w-fit">
            <motion.div
              animate={{
                y: [30, 0, 0, 30, 30],
                x: [-100, -30, -30, -100, -100],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.1 }}
              className="float-end "
            >
              <FaTelegramPlane size={22} className="" />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="px-8 py-3 bg-blue-700 hover:bg-blue-400 rounded-2xl"
            >
              Join Sakhi
            </motion.button>
          </NavLink>
        </div>
        <div className=" flex justify-center lg:justify-end w-full m-auto">
          <figure>
            <img
              src="/images/hero-img.png"
              alt="writing image"
              className="w-[200px] md:w-[400px]"
            />
          </figure>
        </div>
        <div className="hidden lg:flex custom-shape-divider-bottom-1756048651">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>

        <div className="flex lg:hidden custom-shape-divider-bottom-1766091905">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </div>
      <section className="bg-white py-20 px-[10%] flex flex-col items-center justify-center">
        <Lottie animationData={infinity} loop className="w-36 h-36 md:w-52 md:h-52" />
        <h3 className="text-4xl font-bold text-center  text-gray-900 mt-6 mb-4">
          SakhiAI
        </h3>
        <p className="text-center md:w-[50%]">
          Sakhi AI is your smart companion for quick answers, ideas, and
          everyday help. Ask questions, get guidance, and explore
          solutions—anytime, in simple language.
        </p>
        <p className="text-center md:w-[30%] text-[14px] text-gray-500 mt-2">⚠️ Note: We’re currently using a free server, so responses may be slightly slow at times. </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="px-8 py-3 bg-blue-700 hover:bg-blue-500 rounded-2xl text-white font-bold mt-6"
          onClick={()=>navigate("/ai")}
        >
          Chat
        </motion.button>
      </section>

      <section className="bg-white py-20 px-[10%]">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Why Sakhi?
        </h3>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">Private & Secure</h4>
            <p className="text-gray-600">
              Your conversations stay between you and your Sakhi. No noise, no
              leaks.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">Real-Time Messaging</h4>
            <p className="text-gray-600">
              Instant delivery with live online status and smooth experience.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">Simple & Human</h4>
            <p className="text-gray-600">
              No clutter. Just conversations that feel natural and personal.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20 px-[10%]">
        <h3 className="text-4xl font-bold text-center mb-12">
          How Sakhi Works
        </h3>

        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <span className="text-blue-600 text-5xl font-bold">1</span>
            <h4 className="text-xl font-semibold mt-4">Create an Account</h4>
            <p className="text-gray-600 mt-2">
              Sign up in seconds and set up your profile.
            </p>
          </div>

          <div>
            <span className="text-blue-600 text-5xl font-bold">2</span>
            <h4 className="text-xl font-semibold mt-4">Find Your People</h4>
            <p className="text-gray-600 mt-2">
              Search, connect, and start conversations instantly.
            </p>
          </div>

          <div>
            <span className="text-blue-600 text-5xl font-bold">3</span>
            <h4 className="text-xl font-semibold mt-4">Chat Freely</h4>
            <p className="text-gray-600 mt-2">
              Enjoy smooth, private, real-time chats.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-blue-600 py-20 px-[10%] text-white text-center">
        <h3 className="text-4xl font-bold mb-4">More Than Messages</h3>
        <p className="text-xl max-w-3xl mx-auto">
          Sakhi isn’t just a chat app. It’s a space where conversations feel
          safe, warm, and meaningful — just like a real friend.
        </p>
      </section>

      <section className="bg-white py-20 px-[10%] text-center">
        <h3 className="text-4xl font-bold mb-4">
          Start Your First Conversation
        </h3>
        <p className="text-gray-600 mb-8">
          Join Sakhi today and connect with people who matter.
        </p>
        <div className=" w-fit mx-auto flex justify-center items-center">
          <NavLink to="/signup">
            <motion.div
              animate={{
                y: [30, 0, 0, 30, 30],
                x: [-100, -30, -30, -100, -100],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.1 }}
              className="float-end text-white"
            >
              <FaTelegramPlane size={22} className="" />
            </motion.div>
            <button className="px-10 py-4 bg-blue-700 hover:bg-blue-500 text-white rounded-2xl text-lg">
              Get Started
            </button>
          </NavLink>
        </div>
      </section>
      <Footer />
    </div>
  );
}
