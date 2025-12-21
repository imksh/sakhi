import { useState } from "react";
import { IoArrowBack, IoDownload } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";

export const ImagePreviewPage = () => {
  const [zoom, setZoom] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const src = params.get("src");
  const uri = src;

  const imageUrl = decodeURIComponent(uri);

  const downloadImage = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);

      a.href = objectUrl;
      a.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  return (
    <div className="h-dvh bg-black flex flex-col absolute top-0 left-0  w-full z-99 hide-scrollbar max-w[500px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-4 h-[10dvh] bg-blue-500 fixed w-full ">
        <button
          onClick={() => navigate(-1)}
          className="z-10 bg-black/50 p-2 rounded-full "
        >
          <IoArrowBack size={24} className="text-white" />
        </button>

        <button
          onClick={() => downloadImage(imageUrl)}
          className="z-10 bg-black/50 p-2 rounded-full"
        >
          <IoDownload size={24} className="text-white" />
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center mt-[10dvh]   hide-scrollbar h-[90dvh] overflow-auto">
        <button onClick={() => setZoom((z) => !z)}>
          <img
            src={imageUrl}
            alt="preview"
            className={`w-full  h-[90dvh] object-contain transform origin-top transition-transform duration-300 ease-in-out cursor-zoom-in ${
              zoom ? "scale-200 cursor-zoom-out" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};
