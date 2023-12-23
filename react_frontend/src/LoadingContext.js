import React, { useContext, useEffect } from "react";
import { useReducer } from "react";

const initialLoadingState = {
  pageLoader: true,
  dialogueLoader: false,
  loadingMessage: "Loading...",
  isLoading: false,
};

const AppContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "PAGE_LOADED":
      return { ...state, pageLoader: false };
    case "PAGE_LOADING":
      return { ...state, pageLoader: true };
    case "OPEN_LOADING_DIALOGUE":
      return {
        ...state,
        isLoading: true,
        dialogueLoader: true,
        loadingMessage: action.message,
      };
    case "CLOSE_LOADING_DIALOGUE":
      return { ...state, isLoading: false, dialogueLoader: false };
    default:
      return state;
  }
};

const LoadingContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialLoadingState);
  const setPageLoaded = (isLoaded, message = "") => {
    if (isLoaded) dispatch({ type: "PAGE_LOADED", message });
    else dispatch({ type: "PAGE_LOADING", message });
  };
  const setDialogueLoading = (isLoading, message = "") => {
    if (isLoading)
      dispatch({ type: "OPEN_LOADING_DIALOGUE", message: message });
    else dispatch({ type: "CLOSE_LOADING_DIALOGUE" });
  };
  useEffect(() => {
    setPageLoaded(true);
  }, []);
  return (
    <AppContext.Provider
      value={{ setPageLoaded, setDialogueLoading, ...state }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useLoadingContext = () => {
  return useContext(AppContext);
};

export { useLoadingContext, LoadingContext };
