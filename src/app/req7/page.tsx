"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";
import { Plus, Trash2, QrCode } from "lucide-react";

interface Product {
  id: number;
  productCode: string;
}

export default function Req7Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newCode, setNewCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/36");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormatCode = (val: string) => {
    const clean = val.replace(/[^A-Z0-9]/g, "").toUpperCase();
    let formatted = "";
    for (let i = 0; i < clean.length && i < 36; i++) {
      if (i > 0 && i % 6 === 0) formatted += "-";
      formatted += clean[i];
    }
    setNewCode(formatted);
    setError("");
  };

  const handleAdd = async () => {
    if (newCode.length !== 41) { // 36 chars + 5 dashes
      setError("รหัสต้องมีความยาว 36 หลัก");
      return;
    }
    try {
      await api.post("/products/36", JSON.stringify(newCode), {
        headers: { 'Content-Type': 'application/json' }
      });
      setIsAddModalOpen(false);
      setNewCode("");
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.status === 409 ? "รหัสสินค้านี้มีอยู่แล้ว" : "เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("ยืนยันการลบรหัสสินค้านี้?")) {
      try {
        await api.delete(`/products/36/${id}`);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">จัดการรหัสสินค้า (36 หลัก)</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" /> เพิ่มรหัสสินค้า
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-left">ลำดับ</th>
            <th className="p-3 text-left">รหัสสินค้า</th>
            <th className="p-3 text-center">QR Code</th>
            <th className="p-3 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{idx + 1}</td>
              <td className="p-3 font-mono text-sm">{p.productCode}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => {
                    setSelectedProduct(p);
                    setIsQrModalOpen(true);
                  }}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                >
                  <QrCode size={20} />
                </button>
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="p-10 text-center text-gray-400">ยังไม่มีข้อมูลสินค้า</td>
            </tr>
          )}
        </tbody>
      </table>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">เพิ่มรหัสสินค้า 36 หลัก</h3>
            <div>
              <label className="block text-sm font-medium mb-1">รหัสสินค้า (36 หลัก)</label>
              <textarea
                className="w-full p-2 border rounded font-mono"
                rows={2}
                placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX"
                value={newCode}
                onChange={(e) => handleFormatCode(e.target.value)}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </div>
      )}

      {isQrModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm">
            <h3 className="text-xl font-bold mb-4">QR Code สำหรับสินค้า</h3>
            <p className="text-sm text-gray-500 mb-6 break-all font-mono">{selectedProduct.productCode}</p>
            <div className="flex justify-center mb-6 p-4 border rounded-lg bg-white">
              <QRCodeSVG value={selectedProduct.productCode} size={200} />
            </div>
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
