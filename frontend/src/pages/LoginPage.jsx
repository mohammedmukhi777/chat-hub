import { useState } from "react";
import { auth } from "../services/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import api from "../services/api";
import useAuthStore from "../context/authStore";
import toast from "react-hot-toast";

function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const { setAuth } = useAuthStore();

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch {
        // ignore clear error
      }
      window.recaptchaVerifier = null;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal",
        callback: () => console.log("Recaptcha verified"),
        "expired-callback": () => {
          toast.error("reCAPTCHA expired. Please try again.");
        },
      }
    );
    window.recaptchaVerifier.render();
  };

  const sendOTP = async () => {
    if (!phone || phone.length < 10) return toast.error("Enter a valid phone number with country code e.g. +91...");
    try {
      setLoading(true);
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone.trim(), window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep("otp");
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("Firebase Send OTP Error:", error);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch {
          // ignore
        }
      }
      if (error?.code === "auth/billing-not-enabled") {
        toast.error("Firebase SMS requires Blaze plan or test numbers configured in Firebase Console.");
      } else if (error?.code === "auth/quota-exceeded") {
        toast.error("Daily SMS quota exceeded. Use test numbers in Firebase Console.");
      } else if (error?.code === "auth/invalid-phone-number") {
        toast.error("Invalid phone format. Must start with + followed by country code (e.g. +91XXXXXXXXXX).");
      } else if (error?.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please wait a few minutes.");
      } else {
        toast.error(error?.message || "Failed to send OTP. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length < 6) return toast.error("Enter a valid 6-digit OTP");
    try {
      setLoading(true);
      const result = await confirmationResult.confirm(otp.trim());
      const idToken = await result.user.getIdToken();
      const res = await api.post("/auth/verify", { idToken });
      setAuth(res.data.user, res.data.token);
      toast.success("Welcome to Chat Hub!");
    } catch (error) {
      console.error("Firebase Verify OTP Error:", error);
      if (error?.code === "auth/invalid-verification-code") {
        toast.error("Incorrect OTP code. Please try again.");
      } else if (error?.code === "auth/code-expired") {
        toast.error("OTP code has expired. Please request a new one.");
      } else {
        toast.error(error?.message || "Invalid OTP. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="bg-[#13131a] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-indigo-500/30">
              <span className="text-3xl md:text-4xl">💬</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Chat Hub</h1>
            <p className="text-gray-400 mt-1.5 text-xs md:text-sm">Sign in or register a new number</p>
          </div>

          {/* Quick Notice */}
          <div className="mb-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-3 text-center">
            <p className="text-indigo-300 text-xs leading-relaxed">
              ✨ New to Chat Hub? Enter your phone number to automatically create your account.
            </p>
          </div>

          {step === "phone" ? (
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Phone Number (with country code)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                  className="w-full bg-white/5 text-white rounded-2xl px-4 py-3.5 outline-none border border-white/10 focus:border-indigo-500 focus:bg-white/10 transition-all placeholder-gray-600 text-sm"
                />
                <p className="text-gray-500 text-xs mt-1.5">Include country code (e.g. +91 for India, +1 for US)</p>
              </div>
              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20 text-sm"
              >
                {loading ? "Sending OTP..." : "Continue with OTP →"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && verifyOTP()}
                  maxLength={6}
                  className="w-full bg-white/5 text-white rounded-2xl px-4 py-3.5 outline-none border border-white/10 focus:border-indigo-500 focus:bg-white/10 transition-all text-center text-2xl tracking-[0.5em] placeholder-gray-600"
                />
              </div>
              <button
                onClick={verifyOTP}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20 text-sm"
              >
                {loading ? "Verifying..." : "Verify OTP ✓"}
              </button>
              <button
                onClick={() => setStep("phone")}
                className="w-full text-gray-500 hover:text-gray-300 text-sm transition py-2"
              >
                ← Change number
              </button>
            </div>
          )}

          <div id="recaptcha-container" className="mt-4 flex justify-center scale-90" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;