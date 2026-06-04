"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Trash2, ListOrdered } from "lucide-react";

interface Exam {
  id: number;
  questionText: string;
  optionsJson: string;
  correctAnswer: string;
  sequence: number;
}

export default function Req8Page() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get("/exams");
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        questionText: newExam.questionText,
        optionsJson: JSON.stringify(newExam.options),
        correctAnswer: newExam.correctAnswer,
      };
      await api.post("/exams", payload);
      setIsAddModalOpen(false);
      setNewExam({ questionText: "", options: ["", "", "", ""], correctAnswer: "" });
      fetchExams();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("ยืนยันการลบข้อสอบนี้? ลำดับข้อสอบที่เหลือจะถูกจัดเรียงใหม่โดยอัตโนมัติ")) {
      try {
        await api.delete(`/exams/${id}`);
        fetchExams();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <ListOrdered className="mr-2 text-blue-600" /> จัดการข้อสอบ
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 shadow-sm"
        >
          <Plus size={18} className="mr-2" /> เพิ่มข้อสอบ
        </button>
      </div>

      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam.id} className="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow relative">
            <button
              onClick={() => handleDelete(exam.id)}
              className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded"
            >
              <Trash2 size={20} />
            </button>
            <div className="flex items-start">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0">
                {exam.sequence}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-4">{exam.questionText}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {JSON.parse(exam.optionsJson).map((opt: string, i: number) => (
                    <div key={i} className={`p-3 rounded border bg-white ${opt === exam.correctAnswer ? "border-green-500 ring-1 ring-green-500" : ""}`}>
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                      {opt === exam.correctAnswer && <span className="ml-2 text-green-600 text-xs font-bold uppercase">(เฉลย)</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {exams.length === 0 && (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-xl">
            ยังไม่มีข้อสอบในระบบ
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-6">สร้างข้อสอบใหม่</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">โจทย์คำถาม</label>
                <textarea
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  value={newExam.questionText}
                  onChange={(e) => setNewExam({ ...newExam, questionText: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newExam.options.map((opt, i) => (
                  <div key={i}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">ตัวเลือก {String.fromCharCode(65 + i)}</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={opt}
                      onChange={(e) => {
                        const next = [...newExam.options];
                        next[i] = e.target.value;
                        setNewExam({ ...newExam, options: next });
                      }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">คำตอบที่ถูกต้อง (เลือกจากตัวเลือกด้านบน)</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newExam.correctAnswer}
                  onChange={(e) => setNewExam({ ...newExam, correctAnswer: e.target.value })}
                >
                  <option value="">เลือกคำตอบที่ถูก</option>
                  {newExam.options.map((opt, i) => opt && (
                    <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-8 space-x-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-2 border rounded hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                disabled={!newExam.questionText || !newExam.correctAnswer}
                onClick={handleAdd}
                className={`px-6 py-2 rounded text-white font-bold ${
                  newExam.questionText && newExam.correctAnswer ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                บันทึกข้อสอบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
