import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import MobileNav from "./MobileNav";
import { AnimatePresence } from "framer-motion";

const AppLayout = () => {
  const location = useLocation();
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Close sidebar when route change
  useEffect(() => {
    setShowMobileNav(false);
  }, [location.pathname]);

  // Prevent scroll behind mobile sidebar
  useEffect(() => {
    if (showMobileNav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showMobileNav]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">

      {/* FIXED HEADER */}
      <Header onMenuToggle={() => setShowMobileNav(v => !v)} />

      {/* MOBILE NAV + Overlay */}
      <AnimatePresence>
        {showMobileNav && (
          <>
            {/* Background Dim Layer */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setShowMobileNav(false)}
            />

            {/* Slide-in Mobile Nav */}
            <MobileNav onClose={() => setShowMobileNav(false)} />
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT SCROLLS */}
      <main className="flex-1 overflow-y-auto pt-16 py-6 md:py-10">
        <div className="mx-auto max-w-7xl w-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AppLayout;
