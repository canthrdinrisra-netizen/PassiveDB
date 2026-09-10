export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description?: string;
  date: string; // YYYY-MM-DD
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  email: string;
  displayName?: string;
  photoURL?: string;
  monthlyBudget?: number;
  createdAt?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  bgLight: string;
}

export const DEFAULT_EXPENSE_CATEGORIES: CategoryInfo[] = [
  { id: 'food', name: 'อาหารและเครื่องดื่ม', type: 'expense', icon: 'Utensils', color: '#fb7185', bgLight: '#2c101a' },
  { id: 'transport', name: 'การเดินทาง / เดินทาง', type: 'expense', icon: 'Car', color: '#fb923c', bgLight: '#2a160d' },
  { id: 'shopping', name: 'ช้อปปิ้ง / เสื้อผ้า', type: 'expense', icon: 'ShoppingBag', color: '#f43f5e', bgLight: '#300e1b' },
  { id: 'housing', name: 'ที่อยู่อาศัย / ค่าเช่า', type: 'expense', icon: 'Home', color: '#c084fc', bgLight: '#26123b' },
  { id: 'utilities', name: 'บิล ค่าน้ำ/ค่าไฟ/เน็ต', type: 'expense', icon: 'Zap', color: '#38bdf8', bgLight: '#0b2438' },
  { id: 'entertainment', name: 'บันเทิง / ท่องเที่ยว', type: 'expense', icon: 'Film', color: '#ec4899', bgLight: '#2f0f24' },
  { id: 'health', name: 'สุขภาพ / ยา / รักษา', type: 'expense', icon: 'HeartPulse', color: '#34d399', bgLight: '#0d2b20' },
  { id: 'education', name: 'การศึกษา / พัฒนาตนเอง', type: 'expense', icon: 'BookOpen', color: '#a78bfa', bgLight: '#1f163d' },
  { id: 'other_exp', name: 'ค่าใช้จ่ายอื่นๆ', type: 'expense', icon: 'MoreHorizontal', color: '#a1a1aa', bgLight: '#202024' },
];

export const DEFAULT_INCOME_CATEGORIES: CategoryInfo[] = [
  { id: 'salary', name: 'เงินเดือนประจำ', type: 'income', icon: 'Briefcase', color: '#34d399', bgLight: '#0d2b20' },
  { id: 'bonus', name: 'โบนัส / ค่าล่วงเวลา', type: 'income', icon: 'Award', color: '#10b981', bgLight: '#092e22' },
  { id: 'business', name: 'ธุรกิจส่วนตัว / ค้าขาย', type: 'income', icon: 'TrendingUp', color: '#38bdf8', bgLight: '#0b2438' },
  { id: 'investment', name: 'การลงทุน / ดอกเบี้ย / หุ้น', type: 'income', icon: 'Coins', color: '#f472b6', bgLight: '#2f1225' },
  { id: 'freelance', name: 'ฟรีแลนซ์ / รับจ้าง', type: 'income', icon: 'Laptop', color: '#fbbf24', bgLight: '#2a1f0a' },
  { id: 'gift', name: 'ของขวัญ / เงินเสน่หา', type: 'income', icon: 'Gift', color: '#ec4899', bgLight: '#2f0f24' },
  { id: 'other_inc', name: 'รายรับอื่นๆ', type: 'income', icon: 'PlusCircle', color: '#2dd4bf', bgLight: '#0b2e2a' },
];

export const ALL_CATEGORIES = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];
