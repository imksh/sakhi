import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { FaRegHeart, FaTelegramPlane } from "react-icons/fa";
import { motion } from "motion/react";
import Lottie from "lottie-react";
import infinity from "../assets/animations/infinity.json";
import Security from "../assets/animations/security.json";
import { MdOutlineSecurity } from "react-icons/md";
import { useThemeStore } from "../store/useThemeStore";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const faqs = [
  {
    q: "What is Sakhi?",
    a: "Sakhi is a modern chatting app focused on privacy, smooth experience, and real-time messaging — built by Karan Sharma under IdioticMinds.",
  },
  {
    q: "Is Sakhi end-to-end encrypted?",
    a: "Yes. Messages are encrypted on your device using NaCl cryptography. Only you and the receiver can read them — not even our servers.",
  },
  {
    q: "How does message delivery and seen status work?",
    a: "Sakhi uses Socket.io for realtime delivery. You can see when a message is delivered and when it’s seen, with Messenger-style user icons.",
  },
  {
    q: "What is Chat Lock?",
    a: "Chat Lock lets you protect specific chats so nobody can read them even if they open your phone.",
  },
  {
    q: "How do typing indicators work?",
    a: "Typing indicators are realtime — when the other person types, you instantly see it.",
  },
  {
    q: "What is the difference between Public and Private accounts?",
    a: "Public accounts can be discovered through general search. Private accounts require typing the exact email to find them.",
  },
  {
    q: "Can I recover my encrypted messages if I lose my key or device?",
    a: "Right now, no. Message recovery will be added in the future — we're building a secure backup system.",
  },
  {
    q: "How do I sign up?",
    a: "Signup is done using Email OTP verification for security.",
  },
  {
    q: "Is Sakhi fully finished?",
    a: "No — Sakhi is in active development. More features, improvements, and mobile apps (Android + iOS using React Native) are coming soon.",
  },
  {
    q: "Is Sakhi free to use?",
    a: "Yes. Currently, Sakhi is free for everyone while it grows.",
  },
];

const reviewImg = 2;

export default function Start() {
  const navigate = useNavigate();
  const { theme, colors } = useThemeStore();
  const [openE2EE, setOpenE2EE] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = (idx) => {
    setOpen(open === idx ? null : idx);
  };
  const [reviewIndex, setReviewIndex] = useState(0);

  const [animateLeft, setAnimateLeft] = useState(false);
  const [animateRight, setAnimateRight] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimateLeft(false);
      setAnimateRight(false);
    }, 1000);
  }, [animateLeft, animateRight]);

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % (reviewImg + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [reviewImg]);

  return (
    <div className="" style={{ fontColor: colors.text }}>
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
        {/* <div className="hidden lg:flex custom-shape-divider-bottom-1756048651">
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
        </div> */}
        {theme === "light" ? (
          <img
            src="/images/waves.svg"
            alt=""
            className="absolute bottom-0 w-full left-0 rotate-x-180"
          />
        ) : (
          <img
            src="/images/waves-dark.svg"
            alt=""
            className="absolute bottom-0 w-full left-0 rotate-x-180"
          />
        )}
      </div>

      <section className=" py-20 px-[10%]">
        <h3 className="text-4xl font-bold text-center mb-12">Why Sakhi?</h3>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">
              End to End Encryption
            </h4>
            <p className="text-gray-600">
              Your messages are encrypted on your device and can only be read by
              the person you’re chatting with — nobody else.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">Real-Time Messaging</h4>
            <p className="text-gray-600">
              Instant delivery with live online status and smooth experience.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">Private & Secure</h4>
            <p className="text-gray-600">
              Your conversations stay between you and your Sakhi. No noise, no
              leaks.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">AI Assistance</h4>
            <p className="text-gray-600">
              Get smart, contextual suggestions while you chat — from quick
              replies to helpful tips, right when you need them.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">Simple & Human</h4>
            <p className="text-gray-600">
              No clutter. Just conversations that feel natural and personal.
            </p>
          </div>
          <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">
              Smooth animations & UI/UX
            </h4>
            <p className="text-gray-600">
              Enjoy a clean, modern interface with fluid animations that feel
              fast, natural, and distraction-free.
            </p>
          </div>
        </div>
      </section>

      <section className=" py-16 flex flex-col mx-auto w-[95%]">
        <h2 className="text-xl md:text-4xl font-bold text-center mx-auto my-6 md:mb-16">
          A Chat App That Actually Respects Privacy
        </h2>
        <div className="flex flex-col md:flex-row h-full ">
          <video
            src="/videos/demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className="w-full md:w-[55vw]  aspect-video mx-auto"
          />
          <div className=" mx-auto p-4 flex flex-col">
            <h3 className="text-xl md:text-3xl font-bold text-blue-500 flex items-center gap-2">
              Sakhi Protects You <MdOutlineSecurity />
            </h3>

            <p className="mt-2 mb-4">
              Every message you send is end-to-end encrypted — locked on your
              phone and unlocked only on your friend’s phone.
            </p>
            <p className="text-gray-600">
              No one else can read it. Not the server. Not the database. Not
              even us.
            </p>
            <Lottie
              animationData={Security}
              loop
              className="w-60 h-60 md:w-60 md:h-60 mt-8 mx-auto md:m-auto grow"
            />
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto mt-20">
          <button
            onClick={() => setOpenE2EE(!openE2EE)}
            className="w-full flex justify-between items-center p-4 rounded-2xl border shadow hover:shadow-lg transition"
          >
            <div className="text-left">
              <h3 className="text-lg font-bold">
                🔐 How End-to-End Encryption Works
              </h3>
              <p className="text-gray-500 text-sm">
                Learn how Sakhi keeps your chats private and secure.
              </p>
            </div>

            <span className="text-2xl">{openE2EE ? "−" : "+"}</span>
          </button>

          {openE2EE && (
            <div className="mt-3 p-4 rounded-2xl border ">
              <h3 className="mb-3">
                <b>Sakhi uses real end-to-end encryption.</b> Your messages are
                locked on your device and only unlocked on your friend’s device.
              </h3>

              <ul className="list-disc ml-6 space-y-2">
                <li>
                  When you sign up, your device creates a <b>public</b> and
                  <b> private</b> key.
                </li>
                <li>
                  Your <b>public key</b> is shared with contacts — your
                  <b> private key</b> never leaves your device.
                </li>
                <li>
                  Before sending, your message is encrypted using{" "}
                  <b>NaCl (TweetNaCl)</b> with a random <b>nonce</b>.
                </li>
                <li>
                  The server only stores encrypted data — not the actual
                  message.
                </li>
                <li>
                  Your friend decrypts it locally using their private key.
                </li>
              </ul>

              <div className="mt-4 p-3 rounded-xl border text-sm">
                ✔ Nobody in-between can read messages — not hackers, not ISPs,
                not even Sakhi.
              </div>

              <p className="mt-3 text-gray-600 text-sm">
                If anyone ever got access to the database, all they’d see is
                random encrypted text — not your chats.
              </p>

              <p className="mt-3 text-yellow-700 bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-sm">
                <b>Important:</b> if you lose your private key, old messages
                can’t be recovered. That’s what makes true encryption secure.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className=" py-20 px-[10%] flex flex-col items-center justify-center">
        <Lottie
          animationData={infinity}
          loop
          className="w-36 h-36 md:w-52 md:h-52"
        />
        <h3 className="text-4xl font-bold text-center  mt-6 mb-4">SakhiAI</h3>
        <p className="text-center md:w-[50%]">
          Sakhi AI is your smart companion for quick answers, ideas, and
          everyday help. Ask questions, get guidance, and explore
          solutions—anytime, in simple language.
        </p>
        <p className="text-center md:w-[30%] text-[14px] text-gray-500 mt-2">
          ⚠️ Note: We’re currently using a free server, so responses may be
          slightly slow at times.{" "}
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="px-8 py-3 bg-blue-700 hover:bg-blue-500 rounded-2xl text-white font-bold mt-6"
          onClick={() => navigate("/ai")}
        >
          Chat
        </motion.button>
      </section>

      <section className=" py-20 px-[10%]">
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

      <section className="max-w-4xl mx-auto p-6 mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`border rounded-xl p-4 cursor-pointer ${
                theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-700"
              }`}
              onClick={() => toggle(i)}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{item.q}</p>
                <span className="text-xl">{open === i ? "−" : "+"}</span>
              </div>

              {open === i && (
                <p
                  className={`mt-3 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  } leading-relaxed`}
                >
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          Built with ❤️ by <b>Karan Sharma</b> — IdioticMinds
        </p>
      </section>

      <section className="relative max-w-4xl mx-auto p-6 mt-10 flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Reviews With Images
        </h2>
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={() => {
              setAnimateLeft(true);
              setReviewIndex((prev) => (prev <= 0 ? reviewImg : prev - 1));
            }}
            className="bg-neutral-600/60 absolute left-5 text-white rounded-full p-2"
          >
            <motion.div
              animate={
                animateLeft
                  ? {
                      scale: 0.6,
                      x: [-10, 0],
                      y: [0, -10, 0],
                      rotate: "360deg",
                    }
                  : { scale: 1, x: 0, y: 0 }
              }
              transition={{ duration: 1 }}
            >
              <FaAngleLeft size={30} />
            </motion.div>
          </motion.button>
          <motion.button
            whileTap={{
              scale: 0.9,
            }}
            onClick={() =>
              navigate(
                `/view/image?src=${encodeURIComponent(
                  `/images/reviews/${reviewIndex}.jpg`
                )}`
              )
            }
          >
            <img
              src={`/images/reviews/${reviewIndex}.jpg`}
              alt="review image"
              className="max-h-[400px] object-contain object-center rounded"
            />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setAnimateRight(true);
              setReviewIndex((prev) => (prev >= reviewImg ? 0 : prev + 1));
            }}
            whileHover={{ scale: 1.1 }}
            className="bg-neutral-600/60 p-2 rounded-full text-white absolute right-5 cursor-pointer"
          >
            <motion.div
              animate={
                animateRight
                  ? {
                      scale: 0.6,
                      x: [10, 0],
                      y: [0, -10, 0],
                      rotate: "-360deg",
                    }
                  : { scale: 1, x: 0, y: 0 }
              }
              transition={{ duration: 1 }}
            >
              <FaAngleRight size={30} />
            </motion.div>
          </motion.button>
        </div>
      </section>

      <section className=" py-20 px-[10%] text-center">
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
