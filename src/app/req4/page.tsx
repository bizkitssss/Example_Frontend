"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Save, Trash2 } from "lucide-react";

export default function Req4Page() {
  const occupations = ["Software Engineer", "Doctor", "Teacher", "Designer", "Business Owner"];
  
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    birthDay: "",
    occupation: "",
    profileImageBase64: "",
  });

  const [result, setResult] = useState<{ id: number; message: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImageBase64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = () => {
    return (
      formData.email.includes("@") &&
      formData.phone.length >= 9 &&
      formData.birthDay !== "" &&
      formData.occupation !== "" &&
      formData.profileImageBase64 !== ""
    );
  };

  const handleSave = async () => {
    try {
      const res = await api.post("/profiles", formData);
      setResult(res.data);
      setFormData({
        email: "",
        phone: "",
        birthDay: "",
        occupation: "",
        profileImageBase64: "",
      });
      // Clear file input manually if needed
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = () => {
    setFormData({
      email: "",
      phone: "",
      birthDay: "",
      occupation: "",
      profileImageBase64: "",
    });
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center bg-[#2f8f46] text-white font-bold rounded-t-md min-h-[58px] px-[18px] py-[12px] mb-4">
          <h1>IT 04</h1>
      </div>
      <h2 className="text-2xl font-bold mb-6">จัดการโปรไฟล์ผู้ใช้งาน</h2>

      {result && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          <p className="font-bold">{result.message}</p>
          <p>Generated ID: {result.id}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@mail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">เบอร์โทรศัพท์</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0812345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">วันเกิด (วัน/เดือน/ปี)</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={formData.birthDay}
              onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">อาชีพ</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
            >
              <option value="">เลือกอาชีพ</option>
              {occupations.map((occ) => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium mb-1">รูปโปรไฟล์</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            {formData.profileImageBase64 ? (
              <div className="relative inline-block">
                <img
                  src={formData.profileImageBase64}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
                />
                <button
                  onClick={() => setFormData({ ...formData, profileImageBase64: "" })}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <div className="py-8 text-gray-400">
                <p>เลือกรูปภาพของคุณ</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10 space-x-4">
        <button
          onClick={handleClear}
          className="flex items-center px-6 py-2 border rounded-lg hover:bg-gray-50 text-gray-600"
        >
          <Trash2 size={18} className="mr-2" /> Clear
        </button>
        <button
          disabled={!isFormValid()}
          onClick={handleSave}
          className={`flex items-center px-6 py-2 rounded-lg text-white font-semibold transition-colors ${
            isFormValid() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <Save size={18} className="mr-2" /> Save
        </button>
      </div>
    </div>
  );
}
