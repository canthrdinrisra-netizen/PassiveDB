import { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Transaction, ALL_CATEGORIES } from '../types';
import { formatCurrency } from '../lib/formatters';
import { PieChart as PieIcon, BarChart3, TrendingUp, Sparkles } from 'lucide-react';

interface ChartsViewProps {
  transactions: Transaction[];
  selectedMonth: string; // YYYY-MM
}

export function ChartsView({ transactions, selectedMonth }: ChartsViewProps) {
  const [activeTab, setActiveTab] = useState<'category' | 'comparison' | 'trend'>('category');

  const expenseTx = transactions.filter((t) => t.type === 'expense');
  const incomeTx = transactions.filter((t) => t.type === 'income');

  const totalExpense = expenseTx.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = incomeTx.reduce((sum, t) => sum + t.amount, 0);

  // 1. Group expense by category
  const categoryMap: Record<string, { name: string; amount: number; color: string; icon: string }> = {};

  expenseTx.forEach((tx) => {
    const meta = ALL_CATEGORIES.find((c) => c.name === tx.category);
    const color = meta?.color || '#a1a1aa';
    const icon = meta?.icon || 'Tag';

    if (!categoryMap[tx.category]) {
      categoryMap[tx.category] = {
        name: tx.category,
        amount: 0,
        color,
        icon,
      };
    }
    categoryMap[tx.category].amount += tx.amount;
  });

  const categoryData = Object.values(categoryMap)
    .map((c) => ({
      ...c,
      percentage: totalExpense > 0 ? (c.amount / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // 2. Daily breakdown for Bar Chart and Area Chart
  const daysInMonth = new Date(
    Number(selectedMonth.split('-')[0]),
    Number(selectedMonth.split('-')[1]),
    0
  ).getDate();

  const dailyDataMap: Record<number, { day: number; income: number; expense: number; net: number }> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    dailyDataMap[d] = { day: d, income: 0, expense: 0, net: 0 };
  }

  transactions.forEach((tx) => {
    const d = parseInt(tx.date.split('-')[2], 10);
    if (dailyDataMap[d]) {
      if (tx.type === 'income') {
        dailyDataMap[d].income += tx.amount;
      } else {
        dailyDataMap[d].expense += tx.amount;
      }
      dailyDataMap[d].net = dailyDataMap[d].income - dailyDataMap[d].expense;
    }
  });

  const dailyTrendData = Object.values(dailyDataMap).map((d) => ({
    label: `${d.day}`,
    day: d.day,
    income: d.income,
    expense: d.expense,
    net: d.net,
  }));

  // Cumulative trend
  let runningBalance = 0;
  const cumulativeData = dailyTrendData.map((d) => {
    runningBalance += d.net;
    return {
      label: `วันที่ ${d.day}`,
      ยอดคงเหลือสะสม: runningBalance,
      รายรับ: d.income,
      รายจ่าย: d.expense,
    };
  });

  // Calculate Key Insights
  const topCategory = categoryData[0];
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;
  const dailyAverageExpense = totalExpense / Math.max(1, daysInMonth);

  if (transactions.length === 0) {
    return (
      <div className="bg-[#131317] border border-zinc-800/90 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 text-purple-400 flex items-center justify-center mx-auto mb-3">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-100">ยังไม่มีข้อมูลในเดือนนี้</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
          เริ่มบันทึกรายรับหรือรายจ่ายเพื่อดูการวิเคราะห์กราฟและสรุปผลพฤติกรรมการเงินของคุณ
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#131317] border border-zinc-800/90 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            กราฟวิเคราะห์ข้อมูลทางการเงิน
          </h3>
          <p className="text-xs text-zinc-400">
            วิเคราะห์พฤติกรรมการใช้จ่าย สัดส่วนหมวดหมู่ และแนวโน้มรายวัน
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex rounded-xl bg-zinc-800/80 p-1 border border-zinc-700/60">
          <button
            onClick={() => setActiveTab('category')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'category'
                ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            สัดส่วนหมวดหมู่
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            รายรับ vs รายจ่าย
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'trend'
                ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            แนวโน้มกระแสเงิน
          </button>
        </div>
      </div>

      {/* Quick Insights Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-medium">จ่ายมากที่สุด</p>
            <p className="text-xs font-bold text-zinc-100 truncate">
              {topCategory ? `${topCategory.name} (${formatCurrency(topCategory.amount)})` : 'ไม่มีข้อมูล'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-medium">อัตราการเก็บออม</p>
            <p className="text-xs font-bold text-emerald-400">
              {totalIncome > 0 ? `${savingsRate.toFixed(1)}% ของรายรับ` : '0%'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-medium">ค่าเฉลี่ยใช้จ่ายต่อวัน</p>
            <p className="text-xs font-bold text-zinc-100">
              ~{formatCurrency(dailyAverageExpense)}/วัน
            </p>
          </div>
        </div>
      </div>

      {/* Chart Render Area */}
      {activeTab === 'category' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {categoryData.length > 0 ? (
            <>
              <div className="lg:col-span-6 h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      stroke="#131317"
                      strokeWidth={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        color: '#f4f4f5',
                        fontSize: '12px',
                      }}
                      formatter={(val: unknown) => [formatCurrency(Number(val)), 'จำนวน']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-6 space-y-2 max-h-72 overflow-y-auto pr-1">
                <h4 className="text-xs font-bold text-zinc-300 mb-2">
                  รายละเอียดสัดส่วนค่าใช้จ่าย:
                </h4>
                {categoryData.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/70 border border-zinc-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs font-medium text-zinc-200">
                        {cat.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-purple-300">
                        {formatCurrency(cat.amount)}
                      </span>
                      <span className="text-[11px] text-zinc-400 ml-2 font-semibold">
                        ({cat.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-12 py-10 text-center text-zinc-400 text-xs">
              ไม่มีข้อมูลรายจ่ายในเดือนนี้
            </div>
          )}
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyTrendData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis dataKey="label" tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} tickFormatter={(v) => `${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                  borderRadius: '12px',
                  color: '#f4f4f5',
                  fontSize: '12px',
                }}
                formatter={(value: unknown, name: unknown) => [
                  formatCurrency(Number(value)),
                  name === 'income' ? 'รายรับ' : 'รายจ่าย',
                ]}
                labelFormatter={(label) => `วันที่ ${label}`}
              />
              <Legend
                formatter={(value) => (value === 'income' ? 'รายรับ (Income)' : 'รายจ่าย (Expense)')}
                wrapperStyle={{ color: '#d4d4d8', fontSize: '12px' }}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={18} />
              <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'trend' && (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={cumulativeData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis dataKey="label" tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} tickFormatter={(v) => `${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                  borderRadius: '12px',
                  color: '#f4f4f5',
                  fontSize: '12px',
                }}
                formatter={(value: unknown) => [formatCurrency(Number(value)), 'คงเหลือสะสม']}
              />
              <Area
                type="monotone"
                dataKey="ยอดคงเหลือสะสม"
                stroke="#c084fc"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#balanceGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

