import React from "react";
import Lottie from "react-lottie";
import animationData from "../../Assets/animations/24151-ecommerce-animation.json";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold">Server is starting, can take 1 min</h1>
      <Lottie options={defaultOptions} width={300} height={300} />
    </div>
  );
};

export default Loader;