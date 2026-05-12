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
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: () => console.log("Recaptcha verified"),
        }
      );
      window.recaptchaVerifier.render();
    }
  };

  const sendOTP = async () => {
    if (!phone || phone.length < 10) return toast.error("Enter a valid phone number");
    try {
      setLoading(true);
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep("otp");
      toast.success("OTP sent!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length < 6) return toast.error("Enter a valid OTP");
    try {
      setLoading(true);
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      const res = await api.post("/auth/verify", { idToken });
      setAuth(res.data.user, res.data.token);
      toast.success("Welcome to Chat Hub!");
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP. Try again.");
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
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              <span className="text-4xl">💬</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Chat Hub</h1>
            <p className="text-gray-400 mt-2 text-sm">Connect with anyone, anywhere</p>
          </div>

          {step === "phone" ? (
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                  className="w-full bg-white/5 text-white rounded-2xl px-4 py-3.5 outline-none border border-white/10 focus:border-indigo-500 focus:bg-white/10 transition-all placeholder-gray-600 text-sm"
                />
                <p className="text-gray-600 text-xs mt-1.5">Include country code e.g. +91</p>
              </div>
              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20 text-sm"
              >
                {loading ? "Sending OTP..." : "Send OTP →"}
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