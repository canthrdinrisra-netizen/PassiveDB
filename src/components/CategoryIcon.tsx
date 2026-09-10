import {
  Utensils,
  Car,
  ShoppingBag,
  Home,
  Zap,
  Film,
  HeartPulse,
  BookOpen,
  MoreHorizontal,
  Briefcase,
  Award,
  TrendingUp,
  Coins,
  Laptop,
  Gift,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Tag,
  HelpCircle,
  LucideProps,
} from 'lucide-react';
import { FC } from 'react';

const iconMap: Record<string, FC<LucideProps>> = {
  Utensils,
  Car,
  ShoppingBag,
  Home,
  Zap,
  Film,
  HeartPulse,
  BookOpen,
  MoreHorizontal,
  Briefcase,
  Award,
  TrendingUp,
  Coins,
  Laptop,
  Gift,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Tag,
};

interface CategoryIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({ iconName, size = 18, className = '' }: CategoryIconProps) {
  const IconComponent = iconMap[iconName] || HelpCircle;
  return <IconComponent size={size} className={className} />;
}
