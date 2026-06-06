"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { CheckCircle2, RotateCcw, Send } from "lucide-react";

interface Exam {
  id: number;
  questionText: string;
  optionsJson: string;
  correctAnswer: string;
  sequence: number;
}

export default function Req10Page() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [examineeName, setExamineeName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const fetchExams = async () => {
    try {
      const res = await api.get("/exams");
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleSubmit = async () => {
    if (!examineeName) {
      alert("กรุณากรอกชื่อผู้สอบ");
      return;
    }

    let calculatedScore = 0;
    exams.forEach((exam) => {
      if (answers[exam.id] === exam.correctAnswer) {
        calculatedScore++;
      }
    });

    try {
      await api.post("/exams/submit", {
        examineeName,
        score: calculatedScore,
        totalQuestions: exams.length,
      });
      setScore(calculatedScore);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const resetExam = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setExamineeName("");
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center bg-[#2f8f46] text-white font-bold rounded-t-md min-h-[58px] px-[18px] py-[12px] mb-4">
            <h1>IT 10</h1>
        </div>
        <div className="text-center py-20 bg-green-50 rounded-2xl border-2 border-green-200 shadow-lg">
          <CheckCircle2 size={80} className="text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-green-800 mb-2">ส่งข้อสอบเรียบร้อย!</h2>
          <p className="text-xl text-gray-600 mb-10">
            คุณ <span className="font-bold text-green-700">{examineeName}</span> ได้คะแนน
          </p>
          <div className="inline-block bg-white px-10 py-6 rounded-3xl shadow-md border-4 border-green-500 mb-12">
            <span className="text-7xl font-black text-green-600">{score}</span>
            <span className="text-2xl text-gray-400 font-bold ml-2">/ {exams.length}</span>
          </div>
          <div>
            <button
              onClick={resetExam}
              className="flex items-center mx-auto bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-all shadow-lg font-bold"
            >
              <RotateCcw size={20} className="mr-2" /> สอบอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center justify-center bg-[#2f8f46] text-white font-bold rounded-t-md min-h-[58px] px-[18px] py-[12px] mb-4">
          <h1>IT 10</h1>
      </div>
      <div className="bg-blue-600 text-white p-8 rounded-t-2xl shadow-lg mb-8">
        <h2 className="text-3xl font-bold mb-2">เริ่มทำข้อสอบ</h2>
        <p className="opacity-80">มีทั้งหมด {exams.length} ข้อ กรุณาตอบให้ครบทุกข้อ</p>
      </div>

      <div className="bg-white p-6 border rounded-xl shadow-sm mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อผู้เข้าสอบ</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
          placeholder="กรอกชื่อ-นามสกุลของคุณ"
          value={examineeName}
          onChange={(e) => setExamineeName(e.target.value)}
        />
      </div>

      <div className="space-y-8">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white p-8 border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-start">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 text-sm">
                {exam.sequence}
              </span>
              {exam.questionText}
            </h3>
            <div className="space-y-3">
              {JSON.parse(exam.optionsJson).map((opt: string, i: number) => (
                <label 
                  key={i} 
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    answers[exam.id] === opt ? "bg-blue-50 border-blue-500 shadow-sm" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${exam.id}`}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    onChange={() => setAnswers({ ...answers, [exam.id]: opt })}
                    checked={answers[exam.id] === opt}
                  />
                  <span className="ml-3 text-lg text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:bg-blue-700 shadow-xl active:scale-95 transition-all flex items-center mx-auto"
        >
          <Send size={24} className="mr-2" /> ส่งข้อสอบ
        </button>
      </div>
    </div>
  );
}
