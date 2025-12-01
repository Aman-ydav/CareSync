import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, resendVerificationCode, hideVerificationModal } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, X, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VerificationModal = () => {
  const dispatch = useDispatch();
  const { verification } = useSelector((state) => state.auth);
  const { showModal, email, verifying, resending } = verification;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [error, setError] = useState("");

  // Auto-focus inputs
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Countdown timer
  useEffect(() => {
    let interval;
    if (showModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showModal, timer]);

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle code input
  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Take only the last character
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit if all digits are entered
    if (index === 5 && value) {
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        handleSubmit(fullCode);
      }
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setCode(digits);
      
      // Focus the last input
      setTimeout(() => {
        inputRefs[5].current?.focus();
      }, 10);
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handle verification
  const handleSubmit = async (verificationCode = null) => {
    const fullCode = verificationCode || code.join("");
    
    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");
    try {
      await dispatch(verifyEmail({ email, code: fullCode })).unwrap();
      toast.success("Email verified successfully!");
      dispatch(hideVerificationModal());
    } catch (err) {
      setError(err || "Invalid verification code");
      // Clear code on error
      setCode(["", "", "", "", "", ""]);
      inputRefs[0].current?.focus();
    }
  };

  // Handle resend code
  const handleResend = async () => {
    try {
      await dispatch(resendVerificationCode(email)).unwrap();
      setTimer(300); // Reset timer
      setCode(["", "", "", "", "", ""]);
      setError("");
      inputRefs[0].current?.focus();
    } catch (err) {
      toast.error(err || "Failed to resend code");
    }
  };

  // Close modal
  const handleClose = () => {
    dispatch(hideVerificationModal());
    setCode(["", "", "", "", "", ""]);
    setError("");
  };

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md mx-4"
        >
          {/* Modal Container */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-primary">{email}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Enter the code below to verify your account
              </p>
            </div>

            {/* Timer */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Code expires in:{" "}
                  <span className={timer < 60 ? "text-red-600" : "text-primary"}>
                    {formatTime(timer)}
                  </span>
                </span>
              </div>
            </div>

            {/* Code Inputs */}
            <div className="mb-6">
              <Label className="block text-sm font-medium text-gray-700 mb-3">
                Enter 6-digit verification code
              </Label>
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    disabled={verifying}
                  />
                ))}
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleSubmit()}
                disabled={verifying || code.join("").length !== 6}
                className="w-full h-12 bg-primary hover:bg-primary/90"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Email
                  </>
                )}
              </Button>

              <Button
                onClick={handleResend}
                disabled={resending || timer > 240} // Can resend after 1 minute
                variant="outline"
                className="w-full h-11"
              >
                {resending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : timer > 240 ? (
                  `Resend code in ${formatTime(timer - 240)}`
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Verification Code
                  </>
                )}
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Didn't receive the email? Check your spam folder or try resending the code.
                <br />
                The code will expire in 5 minutes.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerificationModal;