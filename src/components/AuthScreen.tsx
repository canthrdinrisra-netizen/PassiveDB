import { useAuth } from '../context/AuthContext';
import { Database, BarChart3, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function AuthScreen() {
  const { signInWithGoogle, authError, clearAuthError } = useAuth();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background ambient purple glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10 text-center">
        {/* College Logo */}
        <div className="flex justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/5 p-2.5 flex items-center justify-center shadow-2xl shadow-purple-600/20 border border-purple-400/30 backdrop-blur-md transition-transform hover:scale-105 duration-300">
            <img
              src="/logo.png"
              alt="ตราสัญลักษณ์ วิทยาลัยอาชีวศึกษาแพร่"
              className="w-full h-full object-contain drop-shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          วิทยาลัยอาชีวศึกษาแพร่
        </h2>
        <p className="mt-1 text-center text-sm font-semibold text-purple-300">
          ระบบจัดการรายรับรายจ่าย (PassiveDB)
        </p>
        <p className="mt-1 text-center text-xs text-zinc-400">
          สรุปผลรายเดือน กราฟวิเคราะห์ และจัดเก็บข้อมูลบน Firebase Firestore
        </p>

        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-500/30">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            เชื่อมต่อโปรเจกต์: PassiveDB
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-[#131317] py-8 px-6 sm:px-10 shadow-2xl border border-zinc-800/90 rounded-3xl space-y-6">
          {authError && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-start justify-between">
              <span>{authError}</span>
              <button
                onClick={clearAuthError}
                className="font-bold ml-2 text-rose-400 hover:text-rose-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Value points */}
          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-zinc-400 leading-snug">
                <strong className="text-zinc-200">สรุปผลแบบรายเดือน:</strong> คำนวณรายรับ รายจ่าย ยอดคงเหลือ และติดตามงบประมาณอัตโนมัติ
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <p className="text-xs text-zinc-400 leading-snug">
                <strong className="text-zinc-200">กราฟวิเคราะห์ข้อมูล:</strong> แสดงสัดส่วนหมวดหมู่ เปรียบเทียบ และแนวโน้มกระแสเงินสด
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs text-zinc-400 leading-snug">
                <strong className="text-zinc-200">จัดเก็บข้อมูลปลอดภัย:</strong> ข้อมูลแยกรายบุคคลอย่างปลอดภัยบน Firestore
              </p>
            </div>
          </div>

          {/* Gmail / Google Sign-In Button */}
          <div className="pt-2">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border border-zinc-700/80 rounded-2xl shadow-md bg-zinc-900/90 hover:bg-zinc-800 text-white text-sm font-bold transition-all cursor-pointer hover:border-purple-400/60"
            >
              {/* Google G SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>เข้าสู่ระบบด้วย Gmail (Google)</span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-zinc-500">
              เข้าสู่ระบบเพื่อบันทึกและจัดการรายรับรายจ่ายส่วนตัวของคุณ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

