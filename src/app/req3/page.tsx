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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [targetIds, setTargetIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "reject">("approve");
  const [reason, setReason] = useState("");

  const fetchDocs = async () => {
    try {
      const res = await api.get("/documents");
      setDocs(res.data);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const toggleSelectAll = () => {
    if (selectedIds.length === docs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(docs.map((d) => d.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (type: "approve" | "reject") => {
    if (selectedIds.length === 0) return;
    setTargetIds(selectedIds);
    setModalType(type);
    setReason("");
    setIsModalOpen(true);
  };

  const handleSingleAction = (id: number, type: "approve" | "reject") => {
    setTargetIds([id]);
    setModalType(type);
    setReason("");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (targetIds.length === 0) return;
    try {
      const endpoint = modalType === "approve" ? "/documents/bulk-approve" : "/documents/bulk-reject";
      await api.post(endpoint, {
        ids: targetIds,
        reason: reason
      });
      setIsModalOpen(false);
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center bg-[#2f8f46] text-white font-bold rounded-t-md min-h-[58px] px-[18px] py-[12px] mb-4">
          <h1>IT 03</h1>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ระบบอนุมัติเอกสาร</h2>
        <div className="space-x-2">
          <button
            onClick={() => handleBulkAction("approve")}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded text-white font-medium ${selectedIds.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            อนุมัติรายการที่เลือก ({selectedIds.length})
          </button>
          <button
            onClick={() => handleBulkAction("reject")}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded text-white font-medium ${selectedIds.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
          >
            ไม่อนุมัติรายการที่เลือก ({selectedIds.length})
          </button>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-center w-12">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={docs.length > 0 && selectedIds.length === docs.length}
                onChange={toggleSelectAll}
              />
            </th>
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
              <td className="p-3 text-center">
                <input
                  disabled={doc.status !== "รออนุมัติ"}
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectedIds.includes(doc.id)}
                  onChange={() => toggleSelect(doc.id)}
                />
              </td>
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
                  disabled={doc.status !== "รออนุมัติ"}
                  onClick={() => handleSingleAction(doc.id, "approve")}
                  className={`p-1 rounded ${doc.status !== "รออนุมัติ" ? "text-gray-300 cursor-not-allowed" : "text-green-600 hover:bg-green-50"}`}
                  title="อนุมัติ"
                >
                  <Check size={20} />
                </button>
                <button
                  disabled={doc.status !== "รออนุมัติ"}
                  onClick={() => handleSingleAction(doc.id, "reject")}
                  className={`p-1 rounded ${doc.status !== "รออนุมัติ" ? "text-gray-300 cursor-not-allowed" : "text-red-600 hover:bg-red-50"}`}
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
            <p className="mb-4 text-gray-600">
              {targetIds.length === 1 
                ? `เอกสาร: ${docs.find(d => d.id === targetIds[0])?.title}`
                : `จำนวนที่เลือก: ${targetIds.length} รายการ`}
            </p>
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
