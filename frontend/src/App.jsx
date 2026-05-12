import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./context/authStore";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import AIPage from "./pages/AIPage";

function App() {
  const { token, user, fetchMe } = useAuthStore();

  useEffect(() => {
    if (token) fetchMe();
  }, [token]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/ai" element={user ? <AIPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;