import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
// import TopBarProgress from "react-topbar-progress-indicator";
import LoadingBar from "react-top-loading-bar";

export const CustomSwitch = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [prevLoc, setPrevLoc] = useState("");

  const location = useLocation();

  useEffect(() => {
    setProgress(30);
    setPrevLoc(location.pathname);
    if (location.pathname === prevLoc) {
      setPrevLoc("");
      //thanks to ankit sahu
    }
  }, [location]);

  useEffect(() => {
    setProgress(100);
  }, [prevLoc]);

  return (
    <>
      {progress >= 0 && (
        <LoadingBar
          color="linear-gradient(-45deg, #E250E5, #4B50E6, #E250E5, #4B50E6)"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
      )}
      <Routes>{children}</Routes>
    </>
  );
};
