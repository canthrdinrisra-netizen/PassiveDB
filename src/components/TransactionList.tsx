import { useState, useMemo } from 'react';
import { Search, Filter, Trash2, Edit2, FileText } from 'lucide-react';
import { Transaction, TransactionType, ALL_CATEGORIES } from '../types';
import { formatCurrency, formatThaiDate } from '../lib/formatters';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
  onOpenAddModal: () => void;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  onOpenAddModal,
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Available categories in the current transaction set
  const usedCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  // Filtering & Sorting
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Type filter
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;
        // Category filter
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
        // Search term
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchCat = t.category.toLowerCase().includes(query);
          const matchDesc = t.description?.toLowerCase().includes(query) || false;
          const matchAmount = String(t.amount).includes(query);
          if (!matchCat && !matchDesc && !matchAmount) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'date-desc') {
          return b.date.localeCompare(a.date) || (b.createdAt || '').localeCompare(a.createdAt || '');
        }
        if (sortOrder === 'date-asc') {
          return a.date.localeCompare(b.date) || (a.createdAt || '').localeCompare(b.createdAt || '');
        }
        if (sortOrder === 'amount-desc') {
          return b.amount - a.amount;
        }
        if (sortOrder === 'amount-asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortOrder]);

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการ "${name}"?`)) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="bg-[#131317] border border-zinc-800/90 rounded-2xl shadow-sm overflow-hidden">
      {/* List Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              รายการบันทึก
            </h3>
            <p className="text-xs text-zinc-400">
              แสดง {filteredTransactions.length} จาก {transactions.length} รายการ
            </p>
          </div>

          {/* Type Filter Buttons */}
          <div className="inline-flex rounded-xl bg-zinc-800/80 p-1 border border-zinc-700/60">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-zinc-700 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-purple-300'
              }`}
            >
              รายจ่าย
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-emerald-300'
              }`}
            >
              รายรับ
            </button>
          </div>
        </div>

        {/* Search, Category, and Sort Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาหมวดหมู่, หมายเหตุ, จำนวนเงิน..."
              className="w-full pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 bg-zinc-900/80 border border-zinc-800 rounded-xl focus:bg-zinc-900 focus:border-purple-400 focus:outline-hidden focus:ring-1 focus:ring-purple-400"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3 relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium text-zinc-200 bg-zinc-900/80 border border-zinc-800 rounded-xl focus:bg-zinc-900 focus:border-purple-400 focus:outline-hidden focus:ring-1 focus:ring-purple-400 cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-zinc-200">หมวดหมู่ทั้งหมด</option>
              {usedCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-900 text-zinc-200">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="sm:col-span-3 relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-medium text-zinc-200 bg-zinc-900/80 border border-zinc-800 rounded-xl focus:bg-zinc-900 focus:border-purple-400 focus:outline-hidden focus:ring-1 focus:ring-purple-400 cursor-pointer"
            >
              <option value="date-desc" className="bg-zinc-900 text-zinc-200">วันที่ล่าสุดก่อน</option>
              <option value="date-asc" className="bg-zinc-900 text-zinc-200">วันที่เก่าสุดก่อน</option>
              <option value="amount-desc" className="bg-zinc-900 text-zinc-200">จำนวนเงินมากไปน้อย</option>
              <option value="amount-asc" className="bg-zinc-900 text-zinc-200">จำนวนเงินน้อยไปมาก</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List Table / Cards */}
      <div className="divide-y divide-zinc-800/80 max-h-[520px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 text-zinc-400 flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-zinc-200">ไม่พบรายการที่ค้นหา</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
              ลองเปลี่ยนคำค้นหา หรือคลิกปุ่มบันทึกรายการเพื่อเริ่มเพิ่มรายการใหม่
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 rounded-xl shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              + บันทึกรายการใหม่
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const meta = ALL_CATEGORIES.find((c) => c.name === tx.category);
            const isExpense = tx.type === 'expense';
            const iconName = meta?.icon || (isExpense ? 'ArrowUpRight' : 'ArrowDownLeft');
            const bgLight = meta?.bgLight || (isExpense ? '#26123b' : '#0d2b20');
            const color = meta?.color || (isExpense ? '#c084fc' : '#34d399');

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-zinc-900/60 transition-colors gap-3 group"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-zinc-800/80 shadow-xs"
                    style={{ backgroundColor: bgLight, color: color }}
                  >
                    <CategoryIcon iconName={iconName} size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-zinc-100 truncate">
                        {tx.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isExpense
                            ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isExpense ? 'รายจ่าย' : 'รายรับ'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span>{formatThaiDate(tx.date)}</span>
                      {tx.description && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px] sm:max-w-xs text-zinc-300">
                            {tx.description}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-sm sm:text-base font-bold ${
                        isExpense ? 'text-purple-300' : 'text-emerald-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'}
                      {formatCurrency(tx.amount)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(tx)}
                      title="แก้ไขรายการ"
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tx.id, tx.category)}
                      disabled={deletingId === tx.id}
                      title="ลบรายการ"
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

