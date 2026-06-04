"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Check, X } from "lucide-react";

interface Doc {
  id: number;
  title: string;
  status: string;
  reason?: string;
}

export default function Req3Page() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "reject">("approve");
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await api.get("/documents");
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = (doc: Doc, type: "approve" | "reject") => {
    setSelectedDoc(doc);
    setModalType(type);
    setReason("");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedDoc) return;
    try {
      const endpoint = modalType === "approve" ? `/documents/approve/${selectedDoc.id}` : `/documents/reject/${selectedDoc.id}`;
      await api.post(endpoint, reason, { headers: { 'Content-Type': 'application/json' } });
      setIsModalOpen(false);
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">ระบบอนุมัติเอกสาร</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-left">ลำดับ</th>
            <th className="p-3 text-left">ชื่อเอกสาร</th>
            <th className="p-3 text-center">สถานะ</th>
            <th className="p-3 text-left">เหตุผล</th>
            <th className="p-3 text-center">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, idx) => (
            <tr key={doc.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{idx + 1}</td>
              <td className="p-3">{doc.title}</td>
              <td className="p-3 text-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  doc.status === "อนุมัติ" ? "bg-green-100 text-green-700" :
                  doc.status === "ไม่อนุมัติ" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {doc.status}
                </span>
              </td>
              <td className="p-3 text-gray-500 italic">{doc.reason || "-"}</td>
              <td className="p-3 text-center space-x-2">
                <button
                  disabled={doc.status === "อนุมัติ"}
                  onClick={() => handleAction(doc, "approve")}
                  className={`p-1 rounded ${doc.status === "อนุมัติ" ? "text-gray-300 cursor-not-allowed" : "text-green-600 hover:bg-green-50"}`}
                  title="อนุมัติ"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => handleAction(doc, "reject")}
                  className="p-1 rounded text-red-600 hover:bg-red-50"
                  title="ไม่อนุมัติ"
                >
                  <X size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className={`text-xl font-bold mb-4 ${modalType === "approve" ? "text-green-600" : "text-red-600"}`}>
              {modalType === "approve" ? "ยืนยันการอนุมัติ" : "ยืนยันการไม่อนุมัติ"}
            </h3>
            <p className="mb-4 text-gray-600">เอกสาร: {selectedDoc?.title}</p>
            <div>
              <label className="block text-sm font-medium mb-1">ระบุเหตุผล</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="กรอกเหตุผลที่นี่..."
              />
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 text-white rounded ${modalType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                {modalType === "approve" ? "อนุมัติ" : "ไม่อนุมัติ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
