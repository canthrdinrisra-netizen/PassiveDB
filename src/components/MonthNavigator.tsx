import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from 'lucide-react';
import { getCurrentYearMonth, getMonthYearLabel } from '../lib/formatters';

interface MonthNavigatorProps {
  selectedMonth: string; // YYYY-MM
  onMonthChange: (newMonth: string) => void;
  transactionCount: number;
}

export function MonthNavigator({
  selectedMonth,
  onMonthChange,
  transactionCount,
}: MonthNavigatorProps) {
  const currentMonth = getCurrentYearMonth();

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1 - 1, 1);
    const newY = date.getFullYear();
    const newM = String(date.getMonth() + 1).padStart(2, '0');
    onMonthChange(`${newY}-${newM}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + 1, 1);
    const newY = date.getFullYear();
    const newM = String(date.getMonth() + 1).padStart(2, '0');
    onMonthChange(`${newY}-${newM}`);
  };

  const isCurrentMonth = selectedMonth === currentMonth;

  return (
    <div className="bg-[#131317] border border-zinc-800/90 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
      {/* Month Title and Navigators */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={handlePrevMonth}
          className="p-2 text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 rounded-xl transition-colors border border-zinc-700/60 cursor-pointer"
          title="เดือนก่อนหน้า"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center hidden sm:flex">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {getMonthYearLabel(selectedMonth)}
            </h2>
            <p className="text-xs text-zinc-400">
              พบ <span className="text-purple-300 font-semibold">{transactionCount}</span> รายการในเดือนนี้
            </p>
          </div>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 rounded-xl transition-colors border border-zinc-700/60 cursor-pointer"
          title="เดือนถัดไป"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Month picker & Quick jump */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {!isCurrentMonth && (
          <button
            onClick={() => onMonthChange(currentMonth)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-200 bg-purple-950/60 hover:bg-purple-900/60 rounded-xl transition-colors border border-purple-500/30 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            กลับสู่เดือนปัจจุบัน
          </button>
        )}

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => {
            if (e.target.value) onMonthChange(e.target.value);
          }}
          className="px-3 py-2 text-xs font-medium text-zinc-200 bg-zinc-800/80 hover:bg-zinc-750 border border-zinc-700/70 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-400 cursor-pointer color-scheme-dark"
        />
      </div>
    </div>
  );
}
