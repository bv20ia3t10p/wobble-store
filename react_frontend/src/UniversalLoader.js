import React from "react";
import { useLoadingContext } from "./LoadingContext";
import "./stylesheets/universalLoader.css";

const UniversalLoader = () => {
  const { loadingMessage, isLoading } = useLoadingContext();
  return (
    <div className={`universalLoader ${isLoading ? "" : "finished"}`}>
      <div className="loader"></div>
      <h1 className="title">{loadingMessage}</h1>
    </div>
  );
};

export default UniversalLoader;
