"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { format, differenceInYears } from "date-fns";
import { Plus, Eye } from "lucide-react";

interface User {
  id?: number;
  fullName: string;
  birthDate: string;
  age: number;
  address: string;
}

export default function Req1Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    fullName: "",
    birthDate: "",
    age: 0,
    address: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBirthDateChange = (dateStr: string) => {
    const age = differenceInYears(new Date(), new Date(dateStr));
    setNewUser({ ...newUser, birthDate: dateStr, age: isNaN(age) ? 0 : age });
  };

  const handleSave = async () => {
    try {
      await api.post("/users", newUser);
      setIsAddModalOpen(false);
      setNewUser({ fullName: "", birthDate: "", age: 0, address: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ระบบจัดการข้อมูลผู้ใช้งาน</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" /> Add
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-left">ลำดับ</th>
            <th className="p-3 text-left">ชื่อ-สกุล</th>
            <th className="p-3 text-left">วันเกิด</th>
            <th className="p-3 text-left">อายุ</th>
            <th className="p-3 text-left">ที่อยู่</th>
            <th className="p-3 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{idx + 1}</td>
              <td className="p-3">{user.fullName}</td>
              <td className="p-3">{format(new Date(user.birthDate), "dd/MM/yyyy")}</td>
              <td className="p-3">{user.age}</td>
              <td className="p-3 truncate max-w-xs">{user.address}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsViewModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">เพิ่มข้อมูลผู้ใช้งาน</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อ-สกุล</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">วันเกิด</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={newUser.birthDate}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">อายุ (คำนวณอัตโนมัติ)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded bg-gray-100"
                  value={newUser.age}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ที่อยู่</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">ข้อมูลผู้ใช้งาน</h3>
            <div className="space-y-4">
              <p><strong>ชื่อ-สกุล:</strong> {selectedUser.fullName}</p>
              <p><strong>วันเกิด:</strong> {format(new Date(selectedUser.birthDate), "dd/MM/yyyy")}</p>
              <p><strong>อายุ:</strong> {selectedUser.age}</p>
              <p><strong>ที่อยู่:</strong> {selectedUser.address}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
