import { useState, useEffect, FormEvent } from 'react';
import { X, Check, Target, DollarSign } from 'lucide-react';
import { formatNumber } from '../lib/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number;
  onSave: (newBudget: number) => Promise<void>;
}

export function BudgetModal({
  isOpen,
  onClose,
  currentBudget,
  onSave,
}: BudgetModalProps) {
  const [budget, setBudget] = useState<string>(String(currentBudget || 25000));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBudget(String(currentBudget || 25000));
    setError(null);
  }, [currentBudget, isOpen]);

  if (!isOpen) return null;

  const presets = [15000, 20000, 30000, 50000, 100000];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const val = parseFloat(budget);
    if (isNaN(val) || val < 0) {
      setError('กรุณากรอกงบประมาณที่ถูกต้อง');
      return;
    }
    if (val > 1000000000) {
      setError('งบประมาณเกินขีดจำกัดสูงสุด');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(val);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกงบประมาณ');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#16161b] rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              ตั้งค่างบประมาณประจำเดือน
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-300 bg-rose-950/60 border border-rose-800/60 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              งบประมาณรายจ่ายเป้าหมาย (บาท/เดือน)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 font-bold text-lg">
                ฿
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="25000"
                className="w-full pl-9 pr-4 py-2.5 text-xl font-bold text-white bg-zinc-900/90 border border-zinc-700/80 rounded-2xl focus:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
              />
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              เลือกด่วน:
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setBudget(String(preset))}
                  className="px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-xl transition-colors border border-zinc-700/60 cursor-pointer"
                >
                  {formatNumber(preset)} ฿
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            ระบบจะนำงบประมาณนี้ไปคำนวณแถบสถานะการใช้จ่ายและแจ้งเตือนเมื่อรายจ่ายของคุณใกล้เคียงหรือเกินงบประมาณ
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 rounded-xl shadow-md shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <span>กำลังบันทึก...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>บันทึกงบประมาณ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
