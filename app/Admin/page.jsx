"use client";
import { useState, useEffect } from "react";

const LOGIN_EXPIRY_MINUTES = 5;

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    
    return new Intl.DateTimeFormat("fa-IR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [checkedLogin, setCheckedLogin] = useState(false);
  const [phones, setPhones] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const logged = localStorage.getItem("adminLogged");
    const loginTime = localStorage.getItem("adminLoginTime");

    if (logged === "true" && loginTime) {
      const now = Date.now();
      const elapsed = (now - parseInt(loginTime, 10)) / 1000 / 60;

      if (elapsed <= LOGIN_EXPIRY_MINUTES) {
        fetchPhones();
        setIsLogged(true);
      } else {
        localStorage.removeItem("adminLogged");
        localStorage.removeItem("adminLoginTime");
        setIsLogged(false);
      }
    }
    setCheckedLogin(true);
  }, []);

  const fetchPhones = async () => {
    try {
      const res = await fetch("/api/get-phones", {
        method: "GET",
        headers: {
          "x-admin-key": key || localStorage.getItem("adminKey") || "",
        },
      });

      if (!res.ok) {
        setError("دسترسی غیرمجاز یا رمز اشتباه است");
        return;
      }

      const data = await res.json();
      setPhones(data.phones);
    } catch {
      setError("خطا در اتصال به سرور");
    }
  };

  const login = async () => {
    setError("");
    try {
      const res = await fetch("/api/get-phones", {
        method: "GET",
        headers: {
          "x-admin-key": key,
        },
      });

      if (!res.ok) {
        setError("رمز اشتباه است");
        return;
      }

      const data = await res.json();
      setPhones(data.phones);
      setIsLogged(true);
      localStorage.setItem("adminLogged", "true");
      localStorage.setItem("adminLoginTime", Date.now().toString());
      localStorage.setItem("adminKey", key);
    } catch {
      setError("خطا در اتصال به سرور");
    }
  };

  const downloadCSV = () => {
    const csv =
      "id,phone,status,date\n" +
      phones
        .map((p) => `${p.id},${p.phone},${p.status},${p.date}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "phones.csv";
    a.click();
  };

  const updateStatus = async (id, newStatus) => {
    const updatedPhones = phones.map((p) =>
      p.id === id ? { ...p, status: newStatus } : p
    );
    setPhones(updatedPhones);

    try {
      await fetch("/api/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (error) {
      setError("خطا در به‌روزرسانی وضعیت");
      console.error(error);
    }
  };

  if (!checkedLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        در حال بررسی وضعیت ورود...
      </div>
    );
  }

  if (!isLogged) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-gray-100 p-4">
        <h1 className="text-xl font-bold">ورود ادمین</h1>

        <input
          type="password"
          placeholder="رمز ادمین"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="border px-4 py-2 rounded shadow-sm"
        />

        <button
          onClick={login}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow-md hover:bg-blue-700 transition"
        >
          ورود
        </button>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">لیست شماره‌ها</h1>

      <button
        onClick={downloadCSV}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6 shadow hover:bg-green-700 transition"
      >
        دانلود CSV
      </button>

      <div className="overflow-x-auto rounded-lg shadow-lg border">
        <table className="w-full border-collapse text-center text-gray-700">
          <thead>
            <tr className="bg-linear-to-r from-sky-200 to-sky-300 text-gray-700">
              <th className="border p-3">ردیف</th>
              <th className="border p-3">شماره</th>
              <th className="border p-3">وضعیت</th>
              <th className="border p-3">تاریخ درخواست</th>
              <th className="border p-3">تغییر وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {phones.map((p) => (
              <tr key={p.id} className="hover:bg-gray-100 transition">
                <td className="border p-3">{p.id}</td>
                <td className="border p-3 font-mono">{p.phone}</td>
                <td className="border p-3 font-bold">
                  {p.status === "new" && (
                    <span className="text-blue-600">جدید</span>
                  )}
                  {p.status === "calling" && (
                    <span className="text-yellow-600">در حال پیگیری</span>
                  )}
                  {p.status === "done" && (
                    <span className="text-green-600">تماس انجام شد</span>
                  )}
                </td>
                <td className="border p-3 text-sm text-gray-600">
                  {formatDate(p.date)}
                </td>
                <td className="border p-3">
                  <select
                    value={p.status}
                    onChange={(e) => updateStatus(p.id, e.target.value)}
                    className="border rounded px-2 py-1 shadow-sm"
                  >
                    <option value="new">جدید</option>
                    <option value="calling">در حال پیگیری</option>
                    <option value="done">تماس انجام شد</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
