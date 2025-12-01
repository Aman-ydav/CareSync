import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import VerificationModal from "./VerificationModal"; // ADDED

const AuthModal = ({ type }) => {
  const navigate = useNavigate();

  // Close modal function
  const closeModal = () => {
    navigate("/");
  };

  // ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Outside click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // Switch login <-> register
  const switchAuthType = (newType) => {
    if (type === newType) return;

    navigate(`/${newType}`, {
      replace: true,
    });
  };

  // Prevent body scroll
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  return (
    <>
    
      <VerificationModal />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-1 right-0 p-2 text-primary hover:text-ring transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Main container */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden max-h-[85vh] flex">

              {/* ============================
                  LEFT PANEL — Branding
              ============================ */}
              <div className="hidden md:flex w-2/5 bg-linear-to-b from-primary/10 to-primary/5 p-6">
                <div className="flex flex-col justify-center w-full">

                  {/* LOGO */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-4 rounded-xl bg-white shadow-md">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold text-center text-primary mb-2">
                    CareSync
                  </h1>
                  <p className="text-sm text-center text-gray-600 mb-8">
                    A smart digital hospital — appointments, doctors, and OPD profile access.
                  </p>

                  {/* Features */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        ✔️
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">Book Appointments</h3>
                        <p className="text-xs text-gray-600">
                          Quickly book a doctor appointment anytime.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        🏥
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">View Doctor Profiles</h3>
                        <p className="text-xs text-gray-600">
                          Check qualifications, specialization & timings.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        📄
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">OPD Records</h3>
                        <p className="text-xs text-gray-600">
                          Access your OPD visits, prescriptions & medical notes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom text */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-500">
                      A modern digital hospital experience for everyone.
                    </p>
                  </div>
                </div>
              </div>

              {/* ============================
                  RIGHT PANEL — FORMS
              ============================ */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto hide-scrollbar">
                
                {/* Toggle buttons */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
                  <button
                    onClick={() => switchAuthType("login")}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      type === "login"
                        ? "bg-white shadow-sm text-primary border border-primary/20"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => switchAuthType("register")}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      type === "register"
                        ? "bg-white shadow-sm text-primary border border-primary/20"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form transition */}
                <div className="relative min-h-[480px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={type}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="w-full"
                    >
                      {type === "login" ? (
                        <LoginForm 
                          switchToRegister={() => switchAuthType("register")}
                          onClose={closeModal}
                        />
                      ) : (
                        <RegisterForm 
                          switchToLogin={() => switchAuthType("login")}
                          onClose={closeModal}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AuthModal;
