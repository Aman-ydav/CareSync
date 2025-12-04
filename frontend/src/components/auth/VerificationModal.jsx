import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, resendVerificationCode, hideVerificationModal } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
import { Loader2, Mail, X, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VerificationModal = () => {
  const dispatch = useDispatch();
  const { verification } = useSelector((state) => state.auth);
  const { showModal, email, verifying, resending } = verification;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300);
  const [error, setError] = useState("");

  // refs
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Guard to ensure auto-send happens exactly once per modal open
  const sentOnceRef = useRef(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!showModal) {
      setCode(["", "", "", "", "", ""]);
      setTimer(300);
      setError("");
      sentOnceRef.current = false;
    }
  }, [showModal]);

  // Auto-send verification email when modal opens - only once per open
  useEffect(() => {
    if (showModal && email && !sentOnceRef.current) {
      // call auto resend but only if not currently resending
      if (!resending) {
        handleAutoResend();
      }
      sentOnceRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, email]); // intentionally omit handleAutoResend to avoid re-creating effect

  useEffect(() => {
    let interval;
    if (showModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showModal, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAutoResend = useCallback(async () => {
    try {
      // prevent accidental double-calls
      if (sentOnceRef.current && resending) return;
      await dispatch(resendVerificationCode(email)).unwrap();
      toast.success("Verification code sent to your email!");
      setTimer(300);
      setCode(["", "", "", "", "", ""]);
      setError("");
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    } catch (err) {
      toast.error(err || "Failed to send verification code");

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, email]);

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    if (index === 5 && value) {
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        handleSubmit(fullCode);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setCode(digits);
      setTimeout(() => inputRefs[5].current?.focus(), 10);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

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
      setCode(["", "", "", "", "", ""]);
      inputRefs[0].current?.focus();
    }
  };

  const handleResend = async () => {
    // extra guard: don't allow resend while resending or if timer not yet expired enough
    if (resending) return;
    try {
      await dispatch(resendVerificationCode(email)).unwrap();
      setTimer(300);
      setCode(["", "", "", "", "", ""]);
      setError("");
      inputRefs[0].current?.focus();
      toast.success("New verification code sent!");
    } catch (err) {
      toast.error(err || "Failed to resend code");
    }
  };

  const handleClose = () => {
    dispatch(hideVerificationModal());
    setCode(["", "", "", "", "", ""]);
    setError("");
    sentOnceRef.current = false;
  };

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md mx-4"
        >
          <div className="bg-white dark:bg-card rounded-xl shadow-2xl p-6 border border-border dark:border-border/50">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted dark:hover:bg-muted/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground dark:text-muted-foreground" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 mb-4 border border-primary/20 dark:border-primary/30">
                <Mail className="w-8 h-8 text-primary dark:text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground dark:text-foreground mb-2">
                Verify Your Email
              </h2>
              <p className="text-muted-foreground dark:text-muted-foreground">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-primary dark:text-primary">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">
                Enter the code below to verify your account
              </p>
            </div>

            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted dark:bg-muted/50 rounded-full border border-border dark:border-border/50">
                <AlertCircle className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                <span className="text-sm font-medium text-foreground dark:text-foreground">
                  Code expires in:{" "}
                  <span className={timer < 60 ? "text-destructive dark:text-destructive" : "text-primary dark:text-primary"}>
                    {formatTime(timer)}
                  </span>
                </span>
              </div>
            </div>

            <div className="mb-6">
              <Label className="block text-sm font-medium text-foreground dark:text-foreground mb-3">
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
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-border dark:border-border focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all bg-white dark:bg-card text-foreground dark:text-foreground"
                    disabled={verifying}
                  />
                ))}
              </div>
              {error && <p className="mt-2 text-sm text-destructive dark:text-destructive text-center">{error}</p>}
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleSubmit()}
                disabled={verifying || code.join("").length !== 6}
                className="w-full h-12 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 text-primary-foreground dark:text-primary-foreground"
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
                disabled={resending || timer > 240}
                variant="outline"
                className="w-full h-11 border-border dark:border-border text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted"
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

            <div className="mt-6 pt-4 border-t border-border dark:border-border/50">
              <p className="text-xs text-muted-foreground dark:text-muted-foreground text-center">
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
