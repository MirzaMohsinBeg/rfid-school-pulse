import { Student, Transaction, Store, InventoryItem, SpendingLimit, StoreUser, WeeklyMenu, MenuCombo } from '@/types/rfid-system';

export const mockSpendingLimits: SpendingLimit[] = [
  { class: 'Class 6', limits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 } },
  { class: 'Class 7', limits: { tuckShop: 175, dryFoodShop: 175, generalStore: 125 } },
  { class: 'Class 8', limits: { tuckShop: 200, dryFoodShop: 200, generalStore: 150 } },
  { class: 'Class 9', limits: { tuckShop: 225, dryFoodShop: 225, generalStore: 175 } },
  { class: 'Class 10', limits: { tuckShop: 250, dryFoodShop: 250, generalStore: 200 } },
  { class: 'Class 11', limits: { tuckShop: 275, dryFoodShop: 275, generalStore: 225 } },
  { class: 'Class 12', limits: { tuckShop: 300, dryFoodShop: 300, generalStore: 250 } },
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    class: 'Class 10',
    rfidCardNumber: 'RFID001234',
    walletBalance: 450,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=120&h=120&fit=crop&crop=face',
    weeklySpendingLimits: { tuckShop: 250, dryFoodShop: 250, generalStore: 200 },
    currentWeekSpending: { tuckShop: 120, dryFoodShop: 85, generalStore: 45 },
    lastTransaction: new Date('2024-01-15T14:30:00')
  },
  {
    id: '2',
    name: 'Priya Gupta',
    class: 'Class 8',
    rfidCardNumber: 'RFID001235',
    walletBalance: 320,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=120&h=120&fit=crop&crop=face',
    weeklySpendingLimits: { tuckShop: 200, dryFoodShop: 200, generalStore: 150 },
    currentWeekSpending: { tuckShop: 80, dryFoodShop: 60, generalStore: 30 },
    lastTransaction: new Date('2024-01-15T12:15:00')
  },
  {
    id: '3',
    name: 'Rohan Patel',
    class: 'Class 12',
    rfidCardNumber: 'RFID001236',
    walletBalance: 180,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3078d1?w=120&h=120&fit=crop&crop=face',
    weeklySpendingLimits: { tuckShop: 300, dryFoodShop: 300, generalStore: 250 },
    currentWeekSpending: { tuckShop: 220, dryFoodShop: 180, generalStore: 120 },
    lastTransaction: new Date('2024-01-15T16:45:00')
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    class: 'Class 6',
    rfidCardNumber: 'RFID001237',
    walletBalance: 250,
    isActive: false,
    photoUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&h=120&fit=crop&crop=face',
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 50, dryFoodShop: 40, generalStore: 20 },
    lastTransaction: new Date('2024-01-14T10:20:00')
  }
];

export const mockInventory: InventoryItem[] = [
  // Tuck Shop Items
  {
    id: 'tuck_001',
    name: 'Fresh Fruit Salad',
    price: 35,
    stock: 25,
    category: 'Fresh Food',
    storeType: 'tuckShop',
    expiryDate: new Date('2024-01-16'),
    minStockLevel: 5,
    nutritionalInfo: { calories: 120, protein: 2, carbs: 30, fat: 1 }
  },
  {
    id: 'tuck_002',
    name: 'Grilled Sandwich',
    price: 45,
    stock: 18,
    category: 'Hot Food',
    storeType: 'tuckShop',
    expiryDate: new Date('2024-01-15'),
    minStockLevel: 8,
    nutritionalInfo: { calories: 280, protein: 12, carbs: 35, fat: 8 }
  },
  {
    id: 'tuck_003',
    name: 'Fresh Juice',
    price: 25,
    stock: 40,
    category: 'Beverages',
    storeType: 'tuckShop',
    expiryDate: new Date('2024-01-16'),
    minStockLevel: 10,
    nutritionalInfo: { calories: 90, protein: 1, carbs: 22, fat: 0 }
  },

  // Dry Food Shop Items
  {
    id: 'dry_001',
    name: 'Potato Chips',
    price: 20,
    stock: 50,
    category: 'Snacks',
    storeType: 'dryFoodShop',
    expiryDate: new Date('2024-06-15'),
    minStockLevel: 15
  },
  {
    id: 'dry_002',
    name: 'Chocolate Bar',
    price: 30,
    stock: 35,
    category: 'Confectionery',
    storeType: 'dryFoodShop',
    expiryDate: new Date('2024-08-20'),
    minStockLevel: 10
  },
  {
    id: 'dry_003',
    name: 'Biscuits Pack',
    price: 15,
    stock: 60,
    category: 'Biscuits',
    storeType: 'dryFoodShop',
    expiryDate: new Date('2024-04-30'),
    minStockLevel: 20
  },
  {
    id: 'dry_004',
    name: 'Energy Drink',
    price: 40,
    stock: 25,
    category: 'Beverages',
    storeType: 'dryFoodShop',
    expiryDate: new Date('2024-12-31'),
    minStockLevel: 8
  },

  // General Store Items
  {
    id: 'gen_001',
    name: 'Toothbrush',
    price: 35,
    stock: 30,
    category: 'Personal Care',
    storeType: 'generalStore',
    minStockLevel: 10
  },
  {
    id: 'gen_002',
    name: 'Toothpaste',
    price: 45,
    stock: 25,
    category: 'Personal Care',
    storeType: 'generalStore',
    minStockLevel: 8
  },
  {
    id: 'gen_003',
    name: 'Soap Bar',
    price: 25,
    stock: 40,
    category: 'Personal Care',
    storeType: 'generalStore',
    minStockLevel: 12
  },
  {
    id: 'gen_004',
    name: 'Notebook',
    price: 50,
    stock: 20,
    category: 'Stationery',
    storeType: 'generalStore',
    minStockLevel: 5
  },
  {
    id: 'gen_005',
    name: 'Pen Set',
    price: 35,
    stock: 35,
    category: 'Stationery',
    storeType: 'generalStore',
    minStockLevel: 10
  }
];

export const mockStoreUsers: StoreUser[] = [
  { id: 'user_1', name: 'Ram Kumar', email: 'ram@school.edu', role: 'store_manager', isActive: true },
  { id: 'user_2', name: 'Sita Sharma', email: 'sita@school.edu', role: 'cashier', isActive: true },
  { id: 'user_3', name: 'Admin User', email: 'admin@school.edu', role: 'admin', isActive: true },
];

export const mockStores: Store[] = [
  {
    id: 'store_1',
    name: 'Main Tuck Shop',
    type: 'tuckShop',
    location: 'Ground Floor, Main Building',
    isActive: true,
    requiresMenu: true,
    assignedUserId: 'user_1',
    assignedUserName: 'Ram Kumar',
    inventory: mockInventory.filter(item => item.storeType === 'tuckShop')
  },
  {
    id: 'store_2',
    name: 'Dry Food Shop',
    type: 'dryFoodShop',
    location: 'First Floor, Main Building',
    isActive: true,
    requiresMenu: false,
    assignedUserId: 'user_2',
    assignedUserName: 'Sita Sharma',
    inventory: mockInventory.filter(item => item.storeType === 'dryFoodShop')
  },
  {
    id: 'store_3',
    name: 'General Store',
    type: 'generalStore',
    location: 'Hostel Block A',
    isActive: true,
    requiresMenu: false,
    inventory: mockInventory.filter(item => item.storeType === 'generalStore')
  }
];

export const mockWeeklyMenus: WeeklyMenu[] = [
  {
    id: 'menu_1',
    weekStartDate: new Date('2024-01-15'),
    storeType: 'tuckShop',
    dailyMenus: {
      'monday': {
        items: mockInventory.filter(item => item.storeType === 'tuckShop').slice(0, 2),
        combos: [
          {
            id: 'combo_1',
            name: 'Healthy Combo',
            description: 'Fresh fruit salad + Fresh juice',
            items: mockInventory.filter(item => ['tuck_001', 'tuck_003'].includes(item.id)),
            comboPrice: 55,
            isActive: true,
            availableDays: ['monday', 'wednesday', 'friday']
          }
        ],
        specialOffers: '10% off on fresh items'
      },
      'tuesday': {
        items: mockInventory.filter(item => item.storeType === 'tuckShop'),
        combos: [],
        specialOffers: 'Buy 2 get 1 free on sandwiches'
      }
    },
    isActive: true,
    createdBy: 'Ram Kumar',
    createdAt: new Date('2024-01-14')
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    studentId: '1',
    studentName: 'Arjun Sharma',
    storeType: 'tuckShop',
    amount: 70,
    items: [
      { id: 'tuck_001', name: 'Fresh Fruit Salad', price: 35, quantity: 1, category: 'Fresh Food' },
      { id: 'tuck_002', name: 'Grilled Sandwich', price: 45, quantity: 1, category: 'Hot Food' }
    ],
    timestamp: new Date('2024-01-15T14:30:00'),
    balanceAfter: 380,
    receiptNumber: 'RCP001'
  },
  {
    id: 'txn_002',
    studentId: '2',
    studentName: 'Priya Gupta',
    storeType: 'dryFoodShop',
    amount: 50,
    items: [
      { id: 'dry_001', name: 'Potato Chips', price: 20, quantity: 1, category: 'Snacks' },
      { id: 'dry_002', name: 'Chocolate Bar', price: 30, quantity: 1, category: 'Confectionery' }
    ],
    timestamp: new Date('2024-01-15T12:15:00'),
    balanceAfter: 270,
    receiptNumber: 'RCP002'
  },
  {
    id: 'txn_003',
    studentId: '3',
    studentName: 'Rohan Patel',
    storeType: 'generalStore',
    amount: 80,
    items: [
      { id: 'gen_002', name: 'Toothpaste', price: 45, quantity: 1, category: 'Personal Care' },
      { id: 'gen_004', name: 'Notebook', price: 50, quantity: 1, category: 'Stationery' }
    ],
    timestamp: new Date('2024-01-15T16:45:00'),
    balanceAfter: 100,
    receiptNumber: 'RCP003'
  }
];