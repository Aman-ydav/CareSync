import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { AnimatePresence, motion } from "framer-motion";
import VerificationModal from "@/components/auth/VerificationModal";

const sidebarMotion = {
  initial: { x: "-100%" },
  animate: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
  exit: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full flex bg-background overflow-hidden">


        <VerificationModal />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Animated only on mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            {...sidebarMotion}
            className="
              fixed inset-y-0 left-0 z-50 w-64
              border-r bg-card shadow
              md:hidden
            "
          >
            <DashboardSidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* STATIC Sidebar on Desktop (no animation) */}
      <aside
        className="
          hidden md:block
          w-64 border-r bg-card
        "
      >
        <DashboardSidebar />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-40 md:ml-64">
          <DashboardHeader
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* Scrollable Page Area */}
        <main
          className="
            flex-1 overflow-y-auto
            pt-16 px-4 py-4
            md:px-6 md:py-6
            bg-muted/30
          "
        >
          <div className="mx-auto max-w-6xl w-full">

            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
