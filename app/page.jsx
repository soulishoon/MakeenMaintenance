"use client";
import Image from "next/image";
import { useState } from "react";
import karegar from "../public/images/karegar.png";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [modal, setModal] = useState({ open: false, type: "", message: "" });

  const openModal = (type, message) => {
    setModal({ open: true, type, message });
  };

  const closeModal = () => {
    setModal({ open: false, type: "", message: "" });
  };

  const handleSubmit = async () => {
    if (!phone.trim()) {
      openModal("error", "لطفاً شماره تماس را وارد کنید");
      return;
    }

    if (!phone.startsWith("09") || phone.length !== 11) {
      openModal("error", "لطفاً از صحت شماره تماس اطمینان حاصل کنید");
      return;
    }() =>  {
      openModal("error", "لطفاً شماره تماس را وارد کنید");
      return;
    }

    try {
      const res = await fetch("/api/save-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        openModal("error", "خطا در ارتباط با سرور");
        return;
      }

      const text = await res.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        openModal("error", "خطا در پردازش پاسخ سرور");
        return;
      }

      if (data.success) {
        openModal("success", "شماره شما ثبت شد. به زودی با شما تماس می‌گیریم.");
        setPhone("");
      } else {
        openModal("error", "خطا در ذخیره شماره :(");
      }
    } catch (error) {
      openModal("error", "خطا در ارتباط با سرور");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen max-h-screen flex flex-col items-center justify-center text-sky-700 p-4 sm:p-6 md:p-10 text-center">

    
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-xl shadow-xl animate-fadeIn text-center">
            <h2 className={`text-lg font-bold mb-4 ${modal.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {modal.type === "success" ? "موفقیت آمیز" : "خطا"}
            </h2>
            <p className="text-sky-700 leading-7 mb-6">{modal.message}</p>
            <button
              onClick={closeModal}
              className="bg-sky-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-sky-700 transition w-full"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 sm:mb-8 flex flex-col items-center relative">
        <div className="lg:p-1.5 sm:p-4 rounded-full shadow-xl border border-sky-300 animate-glowOutline">
          <Image
            src={karegar}
            alt="programmer cartoon"
            width={150}
            height={150}
            className="object-contain drop-shadow-lg rounded-full animate-upDown
            sm:w-[150px] sm:h-[150px] md:w-[220px] md:h-[220px] lg:w-[300px] lg:h-[300px]"
          />
        </div>
      </div>

      <h1 style={{ fontFamily: "yekanbold" }} className="sm:text-xl md:text-2xl mb-3 sm:mb-4 tracking-wide drop-shadow-sm px-2">
        سایت در حال بروزرسانی است
      </h1>

      <p style={{ fontFamily: "yekanmedium" }} className="sm:text-[18px] sm:leading-8 text-sky-800 px-4">
        ما در حال بروزرسانی رابط و تجربه کاربری سایت آکادمی مکین هستیم
        <br />😉 خیلی زود برمی‌گردیم
      </p>

      <div className="mt-8 sm:mt-12">
        <div className="w-36 sm:w-40 h-2 bg-sky-200 rounded-full overflow-hidden shadow-inner mx-auto">
          <div className="h-full w-full bg-sky-500 animate-[progress_2s_ease-in-out_infinite] rounded-full"></div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <input
          className="border border-sky-300 rounded-lg px-4 py-2 w-64 text-center text-sky-700 focus:outline-none focus:ring focus:ring-sky-300"
          type="tel"
          placeholder="شماره تماس خود را وارد کنید"
          value={phone}
          onChange={(e) => {
            let value = e.target.value.replace(/[^0-9]/g, "");
            if (value.length > 11) value = value.slice(0, 11);
            setPhone(value);
          }}
          maxLength={11}
        />

        <button
          onClick={handleSubmit}
          style={{ fontFamily: "yekanmedium" }}
          className="bg-sky-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-sky-700 transition"
        >
          ثبت درخواست تماس
        </button>
      </div>

      <div className="mt-10 text-sky-800 text-sm sm:text-base">
        <p style={{ fontFamily: "yekanmedium" }}>
          تماس با ما : <span className="font-bold ml-2">۷۷۱۸۸۱۸۵</span>
        </p>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          60% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }

        @keyframes upDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6%); }
        }

        @keyframes glowOutline {
          0%, 100% { box-shadow: 0 0 12px 4px rgba(56, 189, 248, 0.5); }
          50% { box-shadow: 0 0 20px 8px rgba(14, 165, 233, 0.8); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-upDown { animation: upDown 3s ease-in-out infinite; }
        .animate-glowOutline { animation: glowOutline 3s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
