"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function Req2Page() {
  const [view, setView] = useState<"login" | "register" | "profile">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", { username, password, confirmPassword });
      alert("สมัครสมาชิกสำเร็จ!");
      setView("login");
      setError("");
    } catch (err: any) {
      setError(err.response?.data || "เกิดข้อผิดพลาด");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      setLoggedInUser(res.data.username);
      setView("profile");
      setError("");
    } catch (err: any) {
      setError(err.response?.data || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
    setView("login");
    setUsername("");
    setPassword("");
  };

  if (view === "profile") {
    return (
      <div>
        <div className="flex items-center justify-center bg-[#2f8f46] text-white font-bold rounded-t-md min-h-[58px] px-[18px] py-[12px] mb-4">
            <h1>IT 02</h1>
        </div>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">ยินดีต้อนรับ</h2>
          <p className="text-xl text-blue-600 mb-6">คุณคือ: {loggedInUser}</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center bg-[#2f8f46] text-white font-bold rounded-t-md min-h-[58px] px-[18px] py-[12px] mb-4">
          <h1>IT 02</h1>
      </div>
      <div className="max-w-md mx-auto py-10">
      <div className="bg-white p-8 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {view === "login" ? "ลงชื่อเข้าใช้งาน" : "สมัครสมาชิก"}
        </h2>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {view === "register" && (
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        <button
          onClick={view === "login" ? handleLogin : handleRegister}
          className="w-full bg-blue-600 text-white mt-6 py-2 rounded hover:bg-blue-700"
        >
          {view === "login" ? "ลงชื่อเข้าใช้งาน" : "สมัครสมาชิก"}
        </button>

        <div className="mt-4 text-center">
          {view === "login" ? (
            <p>
              ยังไม่มีบัญชี?{" "}
              <button onClick={() => { setView("register"); setError(""); }} className="text-blue-600 hover:underline">
                สมัครสมาชิก
              </button>
            </p>
          ) : (
            <button onClick={() => { setView("login"); setError(""); }} className="text-blue-600 hover:underline">
              กลับไปหน้าเข้าสู่ระบบ
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
