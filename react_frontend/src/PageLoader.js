import React from "react";
import "./stylesheets/loading.css";
import { useLoadingContext } from "./LoadingContext";

const PageLoader = () => {
  const { pageLoader } = useLoadingContext();
  return (
    <div class={`loadingScreen ${pageLoader ? "finished" : ""}`}>
      <h1 class="title">Loading</h1>
      <div class="rainbow-marker-loader"></div>
    </div>
  );
};

export default PageLoader;
