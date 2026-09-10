import { useState, useEffect, FormEvent } from 'react';
import { X, Check, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Transaction, TransactionType, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { getTodayDateString } from '../lib/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  editingTransaction?: Transaction | null;
  defaultDate?: string;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
  defaultDate,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(String(editingTransaction.amount));
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description || '');
    } else {
      setType('expense');
      setAmount('');
      setCategory(DEFAULT_EXPENSE_CATEGORIES[0].name);
      setDate(defaultDate || getTodayDateString());
      setDescription('');
    }
    setErrorMessage(null);
  }, [editingTransaction, isOpen, defaultDate]);

  // When type toggles, reset category to first item of corresponding list
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const defaultCat = newType === 'expense'
      ? DEFAULT_EXPENSE_CATEGORIES[0].name
      : DEFAULT_INCOME_CATEGORIES[0].name;
    setCategory(defaultCat);
  };

  if (!isOpen) return null;

  const categories = type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('กรุณาระบุจำนวนเงินที่ถูกต้องและมากกว่า 0');
      return;
    }
    if (numAmount > 1000000000) {
      setErrorMessage('จำนวนเงินเกินขีดจำกัดสูงสุด');
      return;
    }
    if (!category) {
      setErrorMessage('กรุณาเลือกหมวดหมู่');
      return;
    }
    if (!date) {
      setErrorMessage('กรุณาระบุวันที่');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        type,
        amount: numAmount,
        category,
        date,
        description: description.trim(),
      });
      onClose();
    } catch (err: unknown) {
      console.error('Error saving transaction:', err);
      setErrorMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#16161b] rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
          <h3 className="text-base font-bold text-white">
            {editingTransaction ? 'แก้ไขรายการ' : 'บันทึกรายการใหม่'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 text-xs text-rose-300 bg-rose-950/60 border border-rose-800/60 rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900/90 border border-zinc-800 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 text-white shadow-md shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              รายจ่าย (Expense)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              รายรับ (Income)
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              จำนวนเงิน (บาท) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 font-bold text-xl">
                ฿
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2.5 text-2xl font-bold text-white bg-zinc-900/90 border border-zinc-700/80 rounded-2xl focus:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
              />
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              หมวดหมู่ ({type === 'expense' ? 'รายจ่าย' : 'รายรับ'}) *
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1.5 border border-zinc-800/90 rounded-2xl bg-zinc-900/50">
              {categories.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.name)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all border cursor-pointer ${
                      isSelected
                        ? 'border-purple-500/80 bg-purple-950/60 text-purple-200 font-bold shadow-xs ring-1 ring-purple-500/50'
                        : 'border-zinc-800/80 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-1 shrink-0"
                      style={{
                        backgroundColor: isSelected ? '#a855f7' : cat.bgLight,
                        color: isSelected ? '#ffffff' : cat.color,
                      }}
                    >
                      <CategoryIcon iconName={cat.icon} size={16} />
                    </div>
                    <span className="text-[11px] leading-tight line-clamp-2">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                วันที่ทำรายการ *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-zinc-100 bg-zinc-900/90 border border-zinc-700/80 rounded-xl focus:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-purple-400 focus:border-purple-400 cursor-pointer color-scheme-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                บันทึกย่อ / รายละเอียด
              </label>
              <input
                type="text"
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="เช่น ข้าวมันไก่, ค่ากาแฟ, เงินเดือน..."
                className="w-full px-3 py-2 text-xs font-medium text-zinc-100 bg-zinc-900/90 border border-zinc-700/80 rounded-xl focus:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Form Actions */}
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
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 rounded-xl shadow-md shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>กำลังบันทึก...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>บันทึกข้อมูล</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
