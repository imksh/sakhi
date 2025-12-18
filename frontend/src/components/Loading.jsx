import React from "react";

export const Loading = ({ name }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <figure>
        <img
          src="/logo.png"
          alt="logo"
          className="animate-bounce w-40 h-40 mx-auto"
        />
      </figure>
      <h2>Sakhi</h2>
      <p>{name || "Loading"}</p>
    </div>
  );
};
