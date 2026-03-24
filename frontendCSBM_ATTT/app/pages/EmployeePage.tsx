"use client";

import { useEffect, useState } from "react";
import { LogOut, Plus, Eye, X } from "lucide-react";
import api from "../services/api";

type UserType = {
  username: string;
  role: string;
};

export default function EmployeePage({ user }: { user: UserType }) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    employeeCode: "",
    fullName: "",
    phone: "",
    email: "",
    salary: "",
  });

  const loadEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const addEmployee = async () => {
    setLoading(true);
    try {
      await api.post("/employees", form);
      setForm({
        employeeCode: "",
        fullName: "",
        phone: "",
        email: "",
        salary: "",
      });
      setShowForm(false);
      loadEmployees();
    } catch {
      alert("Lỗi thêm nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-700">Quản lý Nhân viên</h1>
            <p className="text-gray-500 text-sm">Xin chào {user?.username}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-xl shadow-md hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        {/* Employee List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl text-gray-700">Nhân viên ({employees.length})</h2>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Thêm
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="p-3 text-left">Mã</th>
                <th className="p-3 text-left">Tên</th>
                <th className="p-3 text-left">SĐT</th>
                <th className="p-3 text-left">Email</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-blue-50 transition-all duration-200">
                  <td className="p-3">{e.employeeCode}</td>
                  <td className="p-3">{e.fullName}</td>
                  <td className="p-3">{e.phone}</td>
                  <td className="p-3">{e.email}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setDetail(e)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Employee Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Thêm nhân viên</h3>

          <div className="space-y-4">
            <input
              placeholder="Mã nhân viên"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={(e) =>
                setForm({ ...form, employeeCode: e.target.value })
              }
            />
            <input
              placeholder="Tên nhân viên"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />
            <input
              placeholder="Số điện thoại"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
            <input
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <input
              placeholder="Lương"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={(e) =>
                setForm({ ...form, salary: e.target.value })
              }
            />

            <button
              onClick={addEmployee}
              className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              {loading ? "Đang thêm..." : "Thêm"}
            </button>
          </div>

          {/* Employee Detail */}
          {detail && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Chi tiết nhân viên</h3>
              <p><strong>Tên:</strong> {detail.fullName}</p>
              <p><strong>Email:</strong> {detail.email}</p>
              <p><strong>SĐT:</strong> {detail.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}