import { useState, useRef } from "react";
import { Send, ImagePlus, X } from "lucide-react";
import { getSocket } from "../../services/socket";
import useAuthStore from "../../context/authStore";
import useChatStore from "../../context/chatStore";
import api from "../../services/api";
import toast from "react-hot-toast";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileRef = useRef();
  const typingTimeout = useRef(null);
  const { user } = useAuthStore();
  const { activeConversation } = useChatStore();

  const handleTyping = (e) => {
    setText(e.target.value);
    const socket = getSocket();
    if (!socket) return;

    socket.emit("typing_start", {
      conversationId: activeConversation._id,
      userId: user._id,
    });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing_stop", {
        conversationId: activeConversation._id,
        userId: user._id,
      });
    }, 1500);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSend = async () => {
    if (isSending || uploading) return;
    const trimmedText = text.trim();
    const currentImage = imageFile;
    if (!trimmedText && !currentImage) return;

    // Immediately clear inputs to prevent fast double taps
    setText("");
    removeImage();
    setIsSending(true);

    try {
      let imageUrl = "";

      if (currentImage) {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", currentImage);
        const res = await api.post("/upload/image", formData);
        imageUrl = res.data.imageUrl;
        setUploading(false);
      }

      await onSend(trimmedText, imageUrl);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setUploading(false);
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending && !uploading) {
        handleSend();
      }
    }
  };

  return (
    <div className="px-4 py-3 bg-[#0f0f13] border-t border-white/5">

      {/* Image preview */}
      {imagePreview && (
        <div className="relative inline-block mb-3">
          <img src={imagePreview} className="h-24 rounded-2xl object-cover border border-white/10" />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">

        {/* Image upload */}
        <button
          onClick={() => fileRef.current.click()}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition flex-shrink-0"
        >
          <ImagePlus size={20} />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Text input */}
        <div className="flex-1 bg-white/5 border border-white/10 focus-within:border-indigo-500/50 rounded-2xl px-4 py-2.5 transition">
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-600"
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={isSending || uploading || (!text.trim() && !imageFile)}
          className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition disabled:opacity-40 flex-shrink-0 shadow-lg shadow-indigo-500/20"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

export default MessageInput;