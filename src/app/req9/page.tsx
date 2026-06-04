"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Send, MessageSquare } from "lucide-react";

interface Comment {
  id: number;
  commentText: string;
  createdAt: string;
}

export default function Req9Page() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const fetchComments = async () => {
    try {
      const res = await api.get("/comments");
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post("/comments", JSON.stringify(newComment), {
        headers: { 'Content-Type': 'application/json' }
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[70vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-2 text-blue-600" /> ระบบคอมเมนต์
      </h2>

      {/* Chat History */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 border rounded-t-lg bg-gray-50 space-y-4 shadow-inner"
      >
        {comments.map((c) => (
          <div key={c.id} className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-200 max-w-[80%]">
              <p className="text-gray-800">{c.commentText}</p>
              <span className="text-[10px] text-gray-400 mt-1 block">
                {new Date(c.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center text-gray-400 py-20">เริ่มพิมพ์ข้อความเพื่อคอมเมนต์...</div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border border-t-0 rounded-b-lg flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 p-3 border rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="พิมพ์ข้อความที่นี่ (กด Enter เพื่อส่ง)..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-md"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
