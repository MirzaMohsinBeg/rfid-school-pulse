export interface Student {
  id: string;
  name: string;
  class: string;
  rfidCardNumber: string;
  walletBalance: number;
  isActive: boolean;
  photoUrl?: string;
  weeklySpendingLimits: {
    tuckShop: number;
    dryFoodShop: number;
    generalStore: number;
  };
  currentWeekSpending: {
    tuckShop: number;
    dryFoodShop: number;
    generalStore: number;
  };
  lastTransaction?: Date;
}

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  storeType: StoreType;
  amount: number;
  items: TransactionItem[];
  timestamp: Date;
  balanceAfter: number;
  receiptNumber: string;
}

export interface TransactionItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export type StoreType = 'tuckShop' | 'dryFoodShop' | 'generalStore';

export interface Store {
  id: string;
  name: string;
  type: StoreType;
  location: string;
  isActive: boolean;
  requiresMenu: boolean;
  assignedUserId?: string;
  assignedUserName?: string;
  inventory: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  expiryDate?: Date;
  minStockLevel: number;
  storeType: StoreType;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface SpendingLimit {
  class: string;
  limits: {
    tuckShop: number;
    dryFoodShop: number;
    generalStore: number;
  };
}

export interface DailyReport {
  date: Date;
  totalTransactions: number;
  totalRevenue: number;
  storeBreakdown: {
    storeType: StoreType;
    transactions: number;
    revenue: number;
  }[];
  topSellingItems: {
    item: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface WalletRecharge {
  id: string;
  studentId: string;
  amount: number;
  timestamp: Date;
  processedBy: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque';
  referenceNumber?: string;
}

export interface MenuCombo {
  id: string;
  name: string;
  description: string;
  items: InventoryItem[];
  comboPrice: number;
  isActive: boolean;
  availableDays: string[];
}

export interface WeeklyMenu {
  id: string;
  weekStartDate: Date;
  storeType: StoreType;
  dailyMenus: {
    [key: string]: { // day of week
      items: InventoryItem[];
      combos: MenuCombo[];
      specialOffers?: string;
    };
  };
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  role: 'store_manager' | 'cashier' | 'admin';
  isActive: boolean;
}