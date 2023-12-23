import React from "react";
import "./stylesheets/loading.css";
import { useLoadingContext } from "./LoadingContext";

const PageLoader = () => {
  const { pageLoader } = useLoadingContext();
  return (
    <div className={`loadingScreen ${pageLoader ? "finished" : ""}`}>
      <h1 className="title">Loading</h1>
      <div className="rainbow-marker-loader"></div>
    </div>
  );
};

export default PageLoader;
