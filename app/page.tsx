import Image from "next/image";
import karegar from "../public/images/karegar.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-tl from-sky-100 to-sky-200  text-sky-700 p-6 text-center">
      <div className="mb-8 flex flex-col items-center relative">
        <div className="p-2  rounded-full shadow-xl border border-sky-300 animate-glowOutline">
          <Image
            src={karegar}
            alt="programmer cartoon"
            width={150}
            height={150}
            className="object-contain drop-shadow-lg rounded-full animate-upDown"
          />
        </div>
      </div>

     <h1 style={{ fontFamily: 'yekanbold' }} className="text-3xl mb-4 tracking-wide drop-shadow-sm">
  سایت در حال بروزرسانی است
</h1>
      <p style={{fontFamily: "yekanmedium"}} className="text-lg  leading-8 text-sky-800">
. ما در حال بروزرسانی رابط و تجربه کاربری سایت آکادمی مکین هستیم <br />
   😉 خیلی زود برمیگردیم
      </p>

      <div className="mt-12">
        <div className="w-40 h-2 bg-sky-200 rounded-full overflow-hidden shadow-inner">
          <div className="h-full w-full bg-sky-500 animate-[progress_2s_ease-in-out_infinite] rounded-full"></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }

        @keyframes upDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6%); }
        }

        @keyframes glowOutline {
          0%, 100% {
            box-shadow: 0 0 12px 4px rgba(56, 189, 248, 0.5);
          }
          50% {
            box-shadow: 0 0 20px 8px rgba(14, 165, 233, 0.8);
          }
        }

        .animate-upDown {
          animation: upDown 3s ease-in-out infinite;
        }

        .animate-glowOutline {
          animation: glowOutline 3s ease-in-out infinite;
        }


      `}</style>
    </div>
  );
}
