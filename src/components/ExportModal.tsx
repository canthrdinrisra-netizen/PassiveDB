import { useState } from 'react';
import { X, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../types';
import { getMonthYearLabel } from '../lib/formatters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  allTransactions: Transaction[];
  selectedMonth: string;
}

export function ExportModal({
  isOpen,
  onClose,
  transactions,
  allTransactions,
  selectedMonth,
}: ExportModalProps) {
  const [scope, setScope] = useState<'month' | 'all'>('month');
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const listToExport = scope === 'month' ? transactions : allTransactions;
    if (listToExport.length === 0) return;

    // Header row
    const headers = ['วันที่ (Date)', 'ประเภท (Type)', 'หมวดหมู่ (Category)', 'จำนวนเงิน (THB)', 'รายละเอียด/หมายเหตุ (Note)'];
    const rows = listToExport.map((t) => [
      t.date,
      t.type === 'income' ? 'รายรับ' : 'รายจ่าย',
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.amount,
      `"${(t.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `phraevc_passivedb_statement_${scope === 'month' ? selectedMonth : 'all'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 1200);
  };

  const count = scope === 'month' ? transactions.length : allTransactions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#16161b] rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              ส่งออกข้อมูลเป็น CSV / Excel
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            ดาวน์โหลดไฟล์รายงานรายรับรายจ่ายในรูปแบบ CSV ที่รองรับการเปิดด้วย Microsoft Excel โดยแสดงภาษาไทยอย่างถูกต้อง
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              เลือกช่วงเวลาที่ต้องการส่งออก:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 hover:border-zinc-700 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="exportScope"
                  checked={scope === 'month'}
                  onChange={() => setScope('month')}
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-zinc-100">
                    เฉพาะเดือนที่เลือก ({getMonthYearLabel(selectedMonth)})
                  </p>
                  <p className="text-[11px] text-zinc-400">{transactions.length} รายการ</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 hover:border-zinc-700 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="exportScope"
                  checked={scope === 'all'}
                  onChange={() => setScope('all')}
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-zinc-100">
                    ข้อมูลทั้งหมดทุกเดือน (All Time)
                  </p>
                  <p className="text-[11px] text-zinc-400">{allTransactions.length} รายการ</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              disabled={count === 0}
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 rounded-xl shadow-md shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>ดาวน์โหลดสำเร็จ!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลด CSV ({count} รายการ)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
