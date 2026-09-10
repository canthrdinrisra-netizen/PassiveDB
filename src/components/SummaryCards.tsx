import { ArrowDownLeft, ArrowUpRight, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../lib/formatters';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  incomeCount: number;
  expenseCount: number;
  monthlyBudget?: number;
  onOpenBudgetModal: () => void;
}

export function SummaryCards({
  totalIncome,
  totalExpense,
  incomeCount,
  expenseCount,
  monthlyBudget = 25000,
  onOpenBudgetModal,
}: SummaryCardsProps) {
  const netBalance = totalIncome - totalExpense;
  const isSurplus = netBalance >= 0;

  // Budget calculations
  const budgetRatio = monthlyBudget > 0 ? (totalExpense / monthlyBudget) * 100 : 0;
  const isOverBudget = monthlyBudget > 0 && totalExpense > monthlyBudget;
  const remainingBudget = monthlyBudget - totalExpense;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Income Card */}
        <div className="bg-[#131317] border border-zinc-800/90 hover:border-zinc-700/80 transition-all rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              รายรับรวมเดือนนี้
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
              +{formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              จากทั้งหมด {incomeCount} รายการ
            </p>
          </div>
        </div>

        {/* Total Expense Card (Pastel Purple Highlight) */}
        <div className="bg-[#131317] border border-zinc-800/90 hover:border-purple-500/40 transition-all rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              รายจ่ายรวมเดือนนี้
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-purple-300 tracking-tight">
              -{formatCurrency(totalExpense)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              จากทั้งหมด {expenseCount} รายการ
            </p>
          </div>
        </div>

        {/* Net Balance Card */}
        <div
          className={`border rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all ${
            isSurplus
              ? 'bg-[#131317] border-zinc-800/90 hover:border-zinc-700'
              : 'bg-rose-950/20 border-rose-900/40 hover:border-rose-800/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              ยอดสุทธิคงเหลือ
            </span>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isSurplus
                  ? 'bg-purple-950/60 border border-purple-500/30 text-purple-300'
                  : 'bg-rose-950/70 border border-rose-500/40 text-rose-400'
              }`}
            >
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isSurplus ? 'text-white' : 'text-rose-400'
              }`}
            >
              {isSurplus ? '+' : ''}
              {formatCurrency(netBalance)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              {isSurplus ? (
                <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  รายรับมากกว่ารายจ่าย
                </span>
              ) : (
                <span className="text-rose-400 font-medium inline-flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  รายจ่ายเกินรายรับ {formatCurrency(Math.abs(netBalance))}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Budget Tracker Bar */}
      {monthlyBudget > 0 && (
        <div className="bg-[#131317] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-300">
                สถานะงบประมาณที่ตั้งไว้:
              </span>
              <span className="text-xs font-semibold text-purple-300">
                {formatCurrency(monthlyBudget)}
              </span>
              <button
                onClick={onOpenBudgetModal}
                className="text-[11px] text-zinc-400 hover:text-purple-300 underline font-medium ml-1 cursor-pointer transition-colors"
              >
                ปรับเปลี่ยนงบ
              </button>
            </div>
            <div className="text-xs font-semibold">
              {isOverBudget ? (
                <span className="text-rose-400 inline-flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  เกินงบ {formatCurrency(Math.abs(remainingBudget))} ({budgetRatio.toFixed(1)}%)
                </span>
              ) : (
                <span className="text-emerald-400">
                  เหลือใช้อีก {formatCurrency(remainingBudget)} (ใช้ไป {budgetRatio.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full bg-zinc-800/80 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : budgetRatio > 80
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-400'
              }`}
              style={{ width: `${Math.min(budgetRatio, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

