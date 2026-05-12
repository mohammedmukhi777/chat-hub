import { useState } from "react";
import { User } from "lucide-react";
import api from "../../services/api";
import useAuthStore from "../../context/authStore";
import toast from "react-hot-toast";

function SetupProfile({ onComplete }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const token = localStorage.getItem("token");

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Please enter your name");
    try {
      setLoading(true);
      const res = await api.put("/users/profile", { name });
      setAuth(res.data.user, token);
      toast.success("Welcome to Chat Hub!");
      onComplete();
    } catch {
      toast.error("Failed to save name");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#13131a] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
          <User size={28} className="text-white" />
        </div>
        <h2 className="text-white text-xl font-bold text-center mb-2">Set Your Name</h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          How should others see you in Chat Hub?
        </p>
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 focus-within:border-indigo-500/50 rounded-2xl px-4 py-3 transition">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-600"
              autoFocus
            />
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-2xl transition disabled:opacity-50 shadow-lg shadow-indigo-500/20"
          >
            {loading ? "Saving..." : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetupProfile;