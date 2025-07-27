import { Student, Transaction, Store, InventoryItem, SpendingLimit, StoreUser, WeeklyMenu, MenuCombo, RfidCardHistory } from '@/types/rfid-system';

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
  // Class 6 Section A (15 students)
  {
    id: '1',
    name: 'Arjun Sharma',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM001',
    fatherName: 'Rajesh Sharma',
    rfidCardNumber: 'RFID001234',
    walletBalance: 450,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_1', cardNumber: 'RFID001234', action: 'issued', timestamp: new Date('2024-01-01T10:00:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 85, dryFoodShop: 60, generalStore: 30 },
    lastTransaction: new Date('2024-01-15T14:30:00')
  },
  {
    id: '2',
    name: 'Priya Gupta',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM002',
    fatherName: 'Suresh Gupta',
    rfidCardNumber: 'RFID001235',
    walletBalance: 320,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_2', cardNumber: 'RFID001235', action: 'issued', timestamp: new Date('2024-01-02T09:00:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 95, dryFoodShop: 70, generalStore: 25 },
    lastTransaction: new Date('2024-01-16T13:45:00')
  },
  {
    id: '3',
    name: 'Rohit Singh',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM003',
    fatherName: 'Vikram Singh',
    rfidCardNumber: 'RFID001236',
    walletBalance: 280,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1582896911227-c966f6e7fb93?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_3', cardNumber: 'RFID001236', action: 'issued', timestamp: new Date('2024-01-03T11:30:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 110, dryFoodShop: 50, generalStore: 40 },
    lastTransaction: new Date('2024-01-17T12:15:00')
  },
  {
    id: '4',
    name: 'Sneha Patel',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM004',
    fatherName: 'Kiran Patel',
    rfidCardNumber: 'RFID001237',
    walletBalance: 390,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b03c?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_4', cardNumber: 'RFID001237', action: 'issued', timestamp: new Date('2024-01-04T08:45:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 75, dryFoodShop: 80, generalStore: 35 },
    lastTransaction: new Date('2024-01-18T14:20:00')
  },
  {
    id: '5',
    name: 'Amit Kumar',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM005',
    fatherName: 'Sunil Kumar',
    rfidCardNumber: 'RFID001238',
    walletBalance: 260,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_5', cardNumber: 'RFID001238', action: 'issued', timestamp: new Date('2024-01-05T10:15:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 120, dryFoodShop: 45, generalStore: 25 },
    lastTransaction: new Date('2024-01-19T11:30:00')
  },
  {
    id: '6',
    name: 'Kavya Reddy',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM006',
    fatherName: 'Ravi Reddy',
    rfidCardNumber: 'RFID001239',
    walletBalance: 350,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_6', cardNumber: 'RFID001239', action: 'issued', timestamp: new Date('2024-01-06T09:30:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 90, dryFoodShop: 65, generalStore: 45 },
    lastTransaction: new Date('2024-01-20T13:10:00')
  },
  {
    id: '7',
    name: 'Ravi Agarwal',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM007',
    fatherName: 'Mohan Agarwal',
    rfidCardNumber: 'RFID001240',
    walletBalance: 310,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_7', cardNumber: 'RFID001240', action: 'issued', timestamp: new Date('2024-01-07T11:00:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 105, dryFoodShop: 55, generalStore: 30 },
    lastTransaction: new Date('2024-01-21T12:45:00')
  },
  {
    id: '8',
    name: 'Isha Jain',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM008',
    fatherName: 'Ajay Jain',
    rfidCardNumber: 'RFID001241',
    walletBalance: 270,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_8', cardNumber: 'RFID001241', action: 'issued', timestamp: new Date('2024-01-08T10:30:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 85, dryFoodShop: 75, generalStore: 20 },
    lastTransaction: new Date('2024-01-22T14:00:00')
  },
  {
    id: '9',
    name: 'Karan Mehta',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM009',
    fatherName: 'Nilesh Mehta',
    rfidCardNumber: 'RFID001242',
    walletBalance: 420,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_9', cardNumber: 'RFID001242', action: 'issued', timestamp: new Date('2024-01-09T09:15:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 95, dryFoodShop: 40, generalStore: 35 },
    lastTransaction: new Date('2024-01-23T11:20:00')
  },
  {
    id: '10',
    name: 'Pooja Sharma',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM010',
    fatherName: 'Deepak Sharma',
    rfidCardNumber: 'RFID001243',
    walletBalance: 340,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_10', cardNumber: 'RFID001243', action: 'issued', timestamp: new Date('2024-01-10T12:00:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 110, dryFoodShop: 60, generalStore: 40 },
    lastTransaction: new Date('2024-01-24T13:30:00')
  },
  {
    id: '11',
    name: 'Varun Tyagi',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM011',
    fatherName: 'Sanjay Tyagi',
    rfidCardNumber: 'RFID001244',
    walletBalance: 380,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_11', cardNumber: 'RFID001244', action: 'issued', timestamp: new Date('2024-01-11T08:30:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 80, dryFoodShop: 70, generalStore: 25 },
    lastTransaction: new Date('2024-01-25T14:45:00')
  },
  {
    id: '12',
    name: 'Divya Singh',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM012',
    fatherName: 'Rakesh Singh',
    rfidCardNumber: 'RFID001245',
    walletBalance: 290,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_12', cardNumber: 'RFID001245', action: 'issued', timestamp: new Date('2024-01-12T10:45:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 125, dryFoodShop: 45, generalStore: 30 },
    lastTransaction: new Date('2024-01-26T12:20:00')
  },
  {
    id: '13',
    name: 'Nikhil Bansal',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM013',
    fatherName: 'Rohit Bansal',
    rfidCardNumber: 'RFID001246',
    walletBalance: 360,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_13', cardNumber: 'RFID001246', action: 'issued', timestamp: new Date('2024-01-13T09:00:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 90, dryFoodShop: 65, generalStore: 35 },
    lastTransaction: new Date('2024-01-27T13:15:00')
  },
  {
    id: '14',
    name: 'Ananya Das',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM014',
    fatherName: 'Subrata Das',
    rfidCardNumber: 'RFID001247',
    walletBalance: 320,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_14', cardNumber: 'RFID001247', action: 'issued', timestamp: new Date('2024-01-14T11:30:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 105, dryFoodShop: 50, generalStore: 45 },
    lastTransaction: new Date('2024-01-28T14:30:00')
  },
  {
    id: '15',
    name: 'Harsh Agrawal',
    class: '6',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM015',
    fatherName: 'Manoj Agrawal',
    rfidCardNumber: 'RFID001248',
    walletBalance: 280,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1582896911227-c966f6e7fb93?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_15', cardNumber: 'RFID001248', action: 'issued', timestamp: new Date('2024-01-15T10:15:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 115, dryFoodShop: 40, generalStore: 25 },
    lastTransaction: new Date('2024-01-29T12:45:00')
  },

  // Class 6 Section B (12 students)
  {
    id: '16',
    name: 'Aarav Mittal',
    class: '6',
    section: 'B',
    session: '2024-25',
    admissionNumber: 'ADM016',
    fatherName: 'Vinod Mittal',
    rfidCardNumber: 'RFID001249',
    walletBalance: 410,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_16', cardNumber: 'RFID001249', action: 'issued', timestamp: new Date('2024-01-16T08:45:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 95, dryFoodShop: 75, generalStore: 40 },
    lastTransaction: new Date('2024-01-30T13:20:00')
  },
  {
    id: '17',
    name: 'Riya Thakur',
    class: '6',
    section: 'B',
    session: '2024-25',
    admissionNumber: 'ADM017',
    fatherName: 'Ramesh Thakur',
    rfidCardNumber: 'RFID001250',
    walletBalance: 350,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b03c?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_17', cardNumber: 'RFID001250', action: 'issued', timestamp: new Date('2024-01-17T09:30:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 150, dryFoodShop: 150, generalStore: 100 },
    currentWeekSpending: { tuckShop: 110, dryFoodShop: 85, generalStore: 35 },
    lastTransaction: new Date('2024-01-31T14:10:00')
  },

  // Class 7 Section A (13 students)
  {
    id: '18',
    name: 'Shreya Nair',
    class: '7',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM018',
    fatherName: 'Rajan Nair',
    rfidCardNumber: 'RFID001251',
    walletBalance: 470,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_18', cardNumber: 'RFID001251', action: 'issued', timestamp: new Date('2024-01-18T10:00:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 175, dryFoodShop: 175, generalStore: 125 },
    currentWeekSpending: { tuckShop: 125, dryFoodShop: 95, generalStore: 50 },
    lastTransaction: new Date('2024-02-01T12:30:00')
  },
  {
    id: '19',
    name: 'Vikash Yadav',
    class: '7',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM019',
    fatherName: 'Pramod Yadav',
    rfidCardNumber: 'RFID001252',
    walletBalance: 320,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_19', cardNumber: 'RFID001252', action: 'issued', timestamp: new Date('2024-01-19T11:15:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 175, dryFoodShop: 175, generalStore: 125 },
    currentWeekSpending: { tuckShop: 140, dryFoodShop: 70, generalStore: 45 },
    lastTransaction: new Date('2024-02-02T13:45:00')
  },

  // Class 8 Section A (14 students)
  {
    id: '20',
    name: 'Nisha Kapoor',
    class: '8',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM020',
    fatherName: 'Anil Kapoor',
    rfidCardNumber: 'RFID001253',
    walletBalance: 520,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_20', cardNumber: 'RFID001253', action: 'issued', timestamp: new Date('2024-01-20T09:45:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 200, dryFoodShop: 200, generalStore: 150 },
    currentWeekSpending: { tuckShop: 135, dryFoodShop: 105, generalStore: 55 },
    lastTransaction: new Date('2024-02-03T14:20:00')
  },
  {
    id: '21',
    name: 'Rakesh Joshi',
    class: '8',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM021',
    fatherName: 'Mukesh Joshi',
    rfidCardNumber: 'RFID001254',
    walletBalance: 450,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_21', cardNumber: 'RFID001254', action: 'issued', timestamp: new Date('2024-01-21T10:30:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 200, dryFoodShop: 200, generalStore: 150 },
    currentWeekSpending: { tuckShop: 150, dryFoodShop: 80, generalStore: 60 },
    lastTransaction: new Date('2024-02-04T11:15:00')
  },

  // Class 9 Section A (12 students)
  {
    id: '22',
    name: 'Tanvi Mishra',
    class: '9',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM022',
    fatherName: 'Ashok Mishra',
    rfidCardNumber: 'RFID001255',
    walletBalance: 580,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_22', cardNumber: 'RFID001255', action: 'issued', timestamp: new Date('2024-01-22T08:15:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 225, dryFoodShop: 225, generalStore: 175 },
    currentWeekSpending: { tuckShop: 145, dryFoodShop: 115, generalStore: 65 },
    lastTransaction: new Date('2024-02-05T12:00:00')
  },
  {
    id: '23',
    name: 'Aryan Gupta',
    class: '9',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM023',
    fatherName: 'Rajesh Gupta',
    rfidCardNumber: 'RFID001256',
    walletBalance: 510,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1582896911227-c966f6e7fb93?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_23', cardNumber: 'RFID001256', action: 'issued', timestamp: new Date('2024-01-23T11:00:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 225, dryFoodShop: 225, generalStore: 175 },
    currentWeekSpending: { tuckShop: 160, dryFoodShop: 90, generalStore: 70 },
    lastTransaction: new Date('2024-02-06T13:30:00')
  },

  // Class 10 Section A (15 students)
  {
    id: '24',
    name: 'Ritika Sharma',
    class: '10',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM024',
    fatherName: 'Yogesh Sharma',
    rfidCardNumber: 'RFID001257',
    walletBalance: 620,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_24', cardNumber: 'RFID001257', action: 'issued', timestamp: new Date('2024-01-24T08:30:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 250, dryFoodShop: 250, generalStore: 200 },
    currentWeekSpending: { tuckShop: 175, dryFoodShop: 125, generalStore: 85 },
    lastTransaction: new Date('2024-02-07T14:45:00')
  },
  {
    id: '25',
    name: 'Siddharth Jain',
    class: '10',
    section: 'A',
    session: '2024-25',
    admissionNumber: 'ADM025',
    fatherName: 'Rajesh Jain',
    rfidCardNumber: 'RFID001258',
    walletBalance: 540,
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    rfidCardHistory: [{ id: 'hist_25', cardNumber: 'RFID001258', action: 'issued', timestamp: new Date('2024-01-25T09:45:00'), processedBy: 'Admin User' }],
    weeklySpendingLimits: { tuckShop: 250, dryFoodShop: 250, generalStore: 200 },
    currentWeekSpending: { tuckShop: 190, dryFoodShop: 110, generalStore: 90 },
    lastTransaction: new Date('2024-02-08T12:20:00')
  }
];

export const mockInventory: InventoryItem[] = [
  // Tuck Shop Items
  {
    id: 'tuck_1',
    name: 'Samosa',
    category: 'Snacks',
    price: 15,
    stock: 50,
    minStockLevel: 10,
    storeType: 'tuckShop',
    nutritionalInfo: {
      calories: 262,
      protein: 3.7,
      carbs: 28,
      fat: 15
    }
  },
  {
    id: 'tuck_2',
    name: 'Sandwich',
    category: 'Snacks',
    price: 25,
    stock: 30,
    minStockLevel: 5,
    storeType: 'tuckShop',
    nutritionalInfo: {
      calories: 300,
      protein: 12,
      carbs: 35,
      fat: 12
    }
  },
  {
    id: 'tuck_3',
    name: 'Fresh Juice',
    category: 'Beverages',
    price: 20,
    stock: 40,
    minStockLevel: 8,
    storeType: 'tuckShop',
    nutritionalInfo: {
      calories: 110,
      protein: 1,
      carbs: 26,
      fat: 0.3
    }
  },
  {
    id: 'tuck_4',
    name: 'Cookies',
    category: 'Snacks',
    price: 10,
    stock: 60,
    minStockLevel: 15,
    storeType: 'tuckShop',
    nutritionalInfo: {
      calories: 150,
      protein: 2,
      carbs: 20,
      fat: 7
    }
  },

  // Dry Food Shop Items
  {
    id: 'dry_1',
    name: 'Instant Noodles',
    category: 'Quick Meals',
    price: 12,
    stock: 100,
    minStockLevel: 20,
    storeType: 'dryFoodShop'
  },
  {
    id: 'dry_2',
    name: 'Biscuit Pack',
    category: 'Snacks',
    price: 15,
    stock: 80,
    minStockLevel: 15,
    storeType: 'dryFoodShop'
  },
  {
    id: 'dry_3',
    name: 'Fruit Bar',
    category: 'Healthy Snacks',
    price: 18,
    stock: 45,
    minStockLevel: 10,
    storeType: 'dryFoodShop'
  },

  // General Store Items
  {
    id: 'gen_1',
    name: 'Notebook',
    category: 'Stationery',
    price: 30,
    stock: 200,
    minStockLevel: 50,
    storeType: 'generalStore'
  },
  {
    id: 'gen_2',
    name: 'Pen Set',
    category: 'Stationery',
    price: 25,
    stock: 150,
    minStockLevel: 30,
    storeType: 'generalStore'
  },
  {
    id: 'gen_3',
    name: 'Water Bottle',
    category: 'Utilities',
    price: 35,
    stock: 75,
    minStockLevel: 20,
    storeType: 'generalStore'
  }
];

export const mockStoreUsers: StoreUser[] = [
  {
    id: 'store_user_1',
    name: 'Ram Kumar',
    role: 'store_manager',
    email: 'ram.kumar@school.edu',
    isActive: true
  },
  {
    id: 'store_user_2',
    name: 'Sita Devi',
    role: 'cashier',
    email: 'sita.devi@school.edu',
    isActive: true
  },
  {
    id: 'store_user_3',
    name: 'Mohan Singh',
    role: 'admin',
    email: 'mohan.singh@school.edu',
    isActive: true
  }
];

export const mockStores: Store[] = [
  {
    id: 'store_1',
    name: 'Main Tuck Shop',
    type: 'tuckShop',
    location: 'Ground Floor, Building A',
    assignedUserId: 'store_user_1',
    assignedUserName: 'Ram Kumar',
    requiresMenu: true,
    isActive: true,
    inventory: mockInventory.filter(item => item.storeType === 'tuckShop')
  },
  {
    id: 'store_2',
    name: 'Dry Food Corner',
    type: 'dryFoodShop',
    location: 'First Floor, Building B',
    assignedUserId: 'store_user_2',
    assignedUserName: 'Sita Devi',
    requiresMenu: false,
    isActive: true,
    inventory: mockInventory.filter(item => item.storeType === 'dryFoodShop')
  },
  {
    id: 'store_3',
    name: 'General Store',
    type: 'generalStore',
    location: 'Ground Floor, Building C',
    assignedUserId: 'store_user_3',
    assignedUserName: 'Mohan Singh',
    requiresMenu: false,
    isActive: true,
    inventory: mockInventory.filter(item => item.storeType === 'generalStore')
  }
];

export const mockWeeklyMenus: WeeklyMenu[] = [
  {
    id: 'menu_1',
    weekStartDate: new Date('2024-01-15'),
    storeType: 'tuckShop',
    dailyMenus: {
      Monday: {
        items: mockInventory.filter(item => ['tuck_1', 'tuck_2', 'tuck_3'].includes(item.id)),
        combos: [
          {
            id: 'combo_1',
            name: 'Snack Combo',
            description: 'Samosa + Fresh Juice',
            items: mockInventory.filter(item => ['tuck_1', 'tuck_3'].includes(item.id)),
            comboPrice: 30,
            isActive: true,
            availableDays: ['Monday']
          }
        ],
        specialOffers: 'Buy 2 Sandwiches, Get 1 Cookie Free'
      },
      Tuesday: {
        items: mockInventory.filter(item => ['tuck_2', 'tuck_4', 'tuck_3'].includes(item.id)),
        combos: []
      },
      Wednesday: {
        items: mockInventory.filter(item => ['tuck_1', 'tuck_2', 'tuck_3', 'tuck_4'].includes(item.id)),
        combos: [
          {
            id: 'combo_2',
            name: 'Full Meal',
            description: 'Sandwich + Juice + Cookies',
            items: mockInventory.filter(item => ['tuck_2', 'tuck_3', 'tuck_4'].includes(item.id)),
            comboPrice: 45,
            isActive: true,
            availableDays: ['Wednesday']
          }
        ],
        specialOffers: '20% off on Fresh Juice'
      },
      Thursday: {
        items: mockInventory.filter(item => ['tuck_1', 'tuck_4'].includes(item.id)),
        combos: []
      },
      Friday: {
        items: mockInventory.filter(item => ['tuck_1', 'tuck_2', 'tuck_3', 'tuck_4'].includes(item.id)),
        combos: [
          {
            id: 'combo_3',
            name: 'Weekend Special',
            description: 'Samosa + Sandwich + Fresh Juice',
            items: mockInventory.filter(item => ['tuck_1', 'tuck_2', 'tuck_3'].includes(item.id)),
            comboPrice: 50,
            isActive: true,
            availableDays: ['Friday']
          }
        ],
        specialOffers: 'Free Cookie with any purchase above ₹40'
      }
    },
    isActive: true,
    createdBy: 'Admin User',
    createdAt: new Date('2024-01-15T08:00:00')
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    studentId: '1',
    studentName: 'Arjun Sharma',
    storeType: 'tuckShop',
    amount: 30,
    items: [
      { id: 'tuck_1', name: 'Samosa', price: 15, quantity: 2, category: 'Snacks' }
    ],
    timestamp: new Date('2024-01-15T10:30:00'),
    balanceAfter: 420,
    receiptNumber: 'RCP001'
  },
  {
    id: 'txn_2',
    studentId: '2',
    studentName: 'Priya Gupta',
    storeType: 'dryFoodShop',
    amount: 27,
    items: [
      { id: 'dry_1', name: 'Instant Noodles', price: 12, quantity: 1, category: 'Quick Meals' },
      { id: 'dry_2', name: 'Biscuit Pack', price: 15, quantity: 1, category: 'Snacks' }
    ],
    timestamp: new Date('2024-01-15T11:45:00'),
    balanceAfter: 293,
    receiptNumber: 'RCP002'
  },
  {
    id: 'txn_3',
    studentId: '3',
    studentName: 'Rohit Singh',
    storeType: 'generalStore',
    amount: 90,
    items: [
      { id: 'gen_1', name: 'Notebook', price: 30, quantity: 3, category: 'Stationery' }
    ],
    timestamp: new Date('2024-01-15T14:20:00'),
    balanceAfter: 190,
    receiptNumber: 'RCP003'
  }
];
