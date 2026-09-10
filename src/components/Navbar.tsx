import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut, Plus, Database, Target, FileSpreadsheet } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenBudgetModal: () => void;
  onOpenExportModal: () => void;
}

export function Navbar({ onOpenAddModal, onOpenBudgetModal, onOpenExportModal }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#111115]/90 border-b border-zinc-800/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 p-1 flex items-center justify-center border border-purple-400/40 shadow-md shadow-purple-500/15 shrink-0">
              <img
                src="/logo.png"
                alt="วิทยาลัยอาชีวศึกษาแพร่"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  วิทยาลัยอาชีวศึกษาแพร่
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-950/60 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  <Database className="w-3 h-3 text-purple-400" />
                  PassiveDB
                </span>
              </div>
              <p className="text-xs text-purple-300/80 hidden sm:block">
                ระบบจัดการรายรับรายจ่าย • Phrae Vocational College
              </p>
            </div>
          </div>

          {/* Action Buttons & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenExportModal}
              title="ส่งออกรายงาน CSV/Excel"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-zinc-200 bg-zinc-800/80 hover:bg-zinc-750 hover:text-white rounded-xl border border-zinc-700/60 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-purple-400" />
              <span className="hidden md:inline">ส่งออก CSV</span>
            </button>

            <button
              onClick={onOpenBudgetModal}
              title="ตั้งค่างบประมาณประจำเดือน"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-zinc-200 bg-zinc-800/80 hover:bg-zinc-750 hover:text-white rounded-xl border border-zinc-700/60 transition-colors cursor-pointer"
            >
              <Target className="w-4 h-4 text-purple-400" />
              <span className="hidden md:inline">ตั้งงบประมาณ</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 rounded-xl shadow-md shadow-purple-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="font-semibold">บันทึกรายการ</span>
            </button>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-800 ml-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-purple-500/40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-zinc-200 leading-tight truncate max-w-[130px]">
                    {user.displayName || 'ผู้ใช้'}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate max-w-[130px]">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  title="ออกจากระบบ"
                  className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

