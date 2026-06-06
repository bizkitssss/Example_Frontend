"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Ticket, RotateCcw, ArrowLeft } from "lucide-react";

export default function Req5Page() {
  const [view, setView] = useState<"get" | "show" | "reset">("get");
  const [currentQueue, setCurrentQueue] = useState<string | null>(null);

  const handleGetQueue = async () => {
    try {
      const res = await api.post("/queues/next");
      setCurrentQueue(res.data.queueNumber);
      setView("show");
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetQueue = async () => {
    try {
      await api.post("/queues/reset");
      setView("reset");
    } catch (err) {
      console.error(err);
    }
  };

  if (view === "show") {
    return (
      <div>
        <div className="flex items-center justify-center bg-[#2f8f46] text-white font-bold rounded-t-md min-h-[58px] px-[18px] py-[12px] mb-4">
            <h1>IT 05</h1>
        </div>
        <div className="text-center py-20 bg-blue-50 rounded-xl border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">หมายเลขคิวของคุณคือ</h2>
          <div className="text-9xl font-black text-blue-600 my-10 animate-pulse">
            {currentQueue}
          </div>
          <button
            onClick={() => setView("get")}
            className="flex items-center mx-auto bg-white text-blue-600 px-6 py-2 rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={18} className="mr-2" /> กลับหน้ารับบัตรคิว
          </button>
        </div>
      </div>
    );
  }

  if (view === "reset") {
    return (
      <div>
        <div className="flex items-center justify-center bg-[#2f8f46] text-white font-bold rounded-t-md min-h-[58px] px-[18px] py-[12px] mb-4">
            <h1>IT 05</h1>
        </div>
        <div className="text-center py-20 bg-red-50 rounded-xl border-2 border-red-200">
          <h2 className="text-2xl font-bold text-red-800 mb-2">ระบบล้างคิวสำเร็จ</h2>
          <p className="text-red-600 mb-10 text-xl font-bold">คิวถูกรีเซ็ตไปที่เริ่มต้นแล้ว</p>
          <button
            onClick={() => setView("get")}
            className="flex items-center mx-auto bg-white text-red-600 px-6 py-2 rounded-full border border-red-600 hover:bg-red-600 hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={18} className="mr-2" /> กลับหน้ารับบัตรคิว
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center bg-[#2f8f46] text-white font-bold rounded-t-md min-h-[58px] px-[18px] py-[12px] mb-4">
          <h1>IT 05</h1>
      </div>
      <div className="max-w-md mx-auto py-10 text-center">
      <div className="bg-white p-10 border rounded-2xl shadow-lg border-blue-100">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ticket size={48} className="text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">ระบบรับบัตรคิว</h2>
        <p className="text-gray-500 mb-10 text-lg">กดปุ่มด้านล่างเพื่อรับหมายเลขคิวใหม่</p>
        
        <div className="space-y-4">
          <button
            onClick={handleGetQueue}
            className="w-full bg-blue-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
          >
            รับบัตรคิว
          </button>
          
          <button
            onClick={handleResetQueue}
            className="w-full flex items-center justify-center text-gray-400 py-2 hover:text-red-500 transition-colors"
          >
            <RotateCcw size={16} className="mr-2" /> ล้างคิวทั้งหมด
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
