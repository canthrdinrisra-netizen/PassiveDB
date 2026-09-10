import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-100">
        <div className="relative mb-4 flex flex-col items-center">
          <div className="absolute inset-0 bg-purple-500/25 rounded-full blur-2xl animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-white/5 p-1.5 flex items-center justify-center border border-purple-400/40 relative z-10 shadow-lg shadow-purple-500/20">
            <img
              src="/logo.png"
              alt="วิทยาลัยอาชีวศึกษาแพร่"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-purple-400 mt-3 relative z-10" />
        </div>
        <p className="text-sm font-semibold text-white">วิทยาลัยอาชีวศึกษาแพร่</p>
        <p className="text-xs text-zinc-400 mt-0.5">กำลังเชื่อมต่อระบบรายรับรายจ่าย...</p>
        <p className="text-[11px] text-purple-300/80 mt-1 font-mono">PassiveDB • Firebase Firestore</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
