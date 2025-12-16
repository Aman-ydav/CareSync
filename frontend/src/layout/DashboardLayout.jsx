import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import VerificationModal from "@/components/auth/VerificationModal";

const SIDEBAR_WIDTH = 256;

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  /* Detect screen size */
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    setIsDesktop(media.matches);

    const handler = (e) => setIsDesktop(e.matches);
    media.addEventListener("change", handler);

    return () => media.removeEventListener("change", handler);
  }, []);

  /* ESC key close */
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-background">
      <VerificationModal />

      {/* CLICK OUTSIDE (mobile + desktop) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (always overlay) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -SIDEBAR_WIDTH }}
            animate={{ x: 0 }}
            exit={{ x: -SIDEBAR_WIDTH }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-card border-r shadow-lg"
          >
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* CONTENT */}
      <motion.div
        animate={{
          marginLeft:
            sidebarOpen && isDesktop ? SIDEBAR_WIDTH : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative z-10 flex h-full flex-col"
      >
        {/* HEADER */}
        <DashboardHeader
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
        />

        {/* PAGE */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
            <Outlet />
          </div>
        </main>
      </motion.div>
    </div>
  );
}
