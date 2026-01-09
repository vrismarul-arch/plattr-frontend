import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollToTopLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return <Outlet />;
};

export default ScrollToTopLayout;
