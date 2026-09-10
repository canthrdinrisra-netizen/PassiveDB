import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Transaction } from '../types';
import { getCurrentYearMonth } from '../lib/formatters';
import { Navbar } from './Navbar';
import { MonthNavigator } from './MonthNavigator';
import { SummaryCards } from './SummaryCards';
import { ChartsView } from './ChartsView';
import { TransactionList } from './TransactionList';
import { TransactionModal } from './TransactionModal';
import { BudgetModal } from './BudgetModal';
import { ExportModal } from './ExportModal';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const { user, userProfile, updateMonthlyBudget } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentYearMonth());
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Real-time listener on user's transactions
  useEffect(() => {
    if (!user) return;

    const txCollectionPath = `users/${user.uid}/transactions`;
    const q = query(collection(db, 'users', user.uid, 'transactions'));

    setIsLoadingData(true);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Transaction[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            userId: data.userId || user.uid,
            type: data.type,
            amount: Number(data.amount) || 0,
            category: data.category || 'อื่นๆ',
            description: data.description || '',
            date: data.date || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        setAllTransactions(list);
        setIsLoadingData(false);
      },
      (error) => {
        setIsLoadingData(false);
        handleFirestoreError(error, OperationType.GET, txCollectionPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Filter transactions for the selected month (YYYY-MM)
  const monthTransactions = useMemo(() => {
    return allTransactions.filter((tx) => tx.date.startsWith(selectedMonth));
  }, [allTransactions, selectedMonth]);

  // Aggregate monthly numbers
  const summary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    monthTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
        incomeCount++;
      } else {
        totalExpense += tx.amount;
        expenseCount++;
      }
    });

    return {
      totalIncome,
      totalExpense,
      incomeCount,
      expenseCount,
    };
  }, [monthTransactions]);

  // Save (Create or Update)
  const handleSaveTransaction = async (data: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;

    if (editingTx) {
      const docPath = `users/${user.uid}/transactions/${editingTx.id}`;
      try {
        const txDocRef = doc(db, 'users', user.uid, 'transactions', editingTx.id);
        await updateDoc(txDocRef, {
          ...data,
          userId: user.uid,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, docPath);
      }
    } else {
      const collectionPath = `users/${user.uid}/transactions`;
      try {
        const txColRef = collection(db, 'users', user.uid, 'transactions');
        await addDoc(txColRef, {
          ...data,
          userId: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, collectionPath);
      }
    }
  };

  // Delete
  const handleDeleteTransaction = async (id: string) => {
    if (!user) return;
    const docPath = `users/${user.uid}/transactions/${id}`;
    try {
      const txDocRef = doc(db, 'users', user.uid, 'transactions', id);
      await deleteDoc(txDocRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  };

  const handleOpenAdd = () => {
    setEditingTx(null);
    setIsTxModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-16 relative">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={handleOpenAdd}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Month Navigator */}
        <MonthNavigator
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          transactionCount={monthTransactions.length}
        />

        {/* Loading Spinner during initial fetch */}
        {isLoadingData && allTransactions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-2" />
            <p className="text-xs font-medium">กำลังโหลดข้อมูลจาก Firebase PassiveDB...</p>
          </div>
        ) : (
          <>
            {/* Monthly Summary Statistics Cards */}
            <SummaryCards
              totalIncome={summary.totalIncome}
              totalExpense={summary.totalExpense}
              incomeCount={summary.incomeCount}
              expenseCount={summary.expenseCount}
              monthlyBudget={userProfile?.monthlyBudget || 25000}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />

            {/* Data Analysis Charts (Category breakdown, Income vs Expense, Cashflow Trend) */}
            <ChartsView
              transactions={monthTransactions}
              selectedMonth={selectedMonth}
            />

            {/* Detailed Transaction List with Search and Filter */}
            <TransactionList
              transactions={monthTransactions}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTransaction}
              onOpenAddModal={handleOpenAdd}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTransaction}
        editingTransaction={editingTx}
        defaultDate={`${selectedMonth}-01`}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentBudget={userProfile?.monthlyBudget || 25000}
        onSave={updateMonthlyBudget}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        transactions={monthTransactions}
        allTransactions={allTransactions}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
