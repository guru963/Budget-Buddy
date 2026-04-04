export const summaryCards = [
  {
    label: "Total balance",
    value: 52893,
    change: 12.1,
    positive: true,
  },
  {
    label: "Income",
    value: 8500,
    change: 6.3,
    positive: true,
  },
  {
    label: "Expense",
    value: 6222,
    change: 2.4,
    positive: false,
  },
  {
    label: "Total savings",
    value: 32913,
    change: 12.1,
    positive: true,
  },
];

export const moneyFlowData = [
  { month: "Jan", income: 8000, expense: 5200 },
  { month: "Feb", income: 9200, expense: 6100 },
  { month: "Mar", income: 10000, expense: 7800 },
  { month: "Apr", income: 11500, expense: 8200 },
  { month: "May", income: 9800, expense: 6900 },
  { month: "Jun", income: 7500, expense: 4800 },
  { month: "Jul", income: 8500, expense: 6222 },
];

export const moneyFlowHistorical = [
  { month: "2023", income: 95000, expense: 72000 },
  { month: "2024", income: 112000, expense: 84000 },
  { month: "2025", income: 128000, expense: 91000 },
];

export const budgetCategories = [
  { name: "Food & Dining", value: 1270, color: "#6345ED" },
  { name: "Rent & Utilities", value: 1050, color: "#9B85FD" },
  { name: "Education", value: 650, color: "#C4B5FD" },
  { name: "Traveling", value: 480, color: "#DDD6FE" },
  { name: "Shopping", value: 350, color: "#EDE9FE" },
];

// Reference transactions used in Dashboard and Wallet
export const recentTransactions = [
  {
    id: 1,
    date: "25 Jul 12:30",
    amount: -19.99,
    name: "Netflix",
    method: "VISA **3254",
    category: "Subscription",
    status: "Success",
  },
  {
    id: 2,
    date: "26 Jul 15:00",
    amount: -150,
    name: "College Canteen",
    method: "UPI",
    category: "Food",
    status: "Success",
  },
  {
    id: 3,
    date: "27 Jul 09:00",
    amount: -80,
    name: "Uber Ride",
    method: "Mastercard **2154",
    category: "Travel",
    status: "Success",
  },
  {
    id: 4,
    date: "27 Jul 18:00",
    amount: 8500,
    name: "Monthly Allowance",
    method: "Bank Transfer",
    category: "Income",
    status: "Success",
  },
  {
    id: 5,
    date: "28 Jul 11:30",
    amount: -220,
    name: "Amazon Shopping",
    method: "VISA **3254",
    category: "Shopping",
    status: "Pending",
  },
];

export const savingGoals = [
  { label: "Laptop", target: 8000, saved: 4800, color: "#5439D4" },
  { label: "Trip to Goa", target: 1800, saved: 756, color: "#7B5EF5" },
  { label: "Emergency Fund", target: 5000, saved: 1500, color: "#4C42A5" },
];

export const analyticsCategoryData = [
  { name: "Food & Dining", value: 4500, color: "#6345ED" },
  { name: "Rent & Utilities", value: 3200, color: "#9B85FD" },
  { name: "Education", value: 2100, color: "#C4B5FD" },
  { name: "Travel", value: 1800, color: "#DDD6FE" },
  { name: "Shopping", value: 1200, color: "#EDE9FE" },
];

export const analyticsTrendData = [
  { day: "Mon", spent: 120, income: 0 },
  { day: "Tue", spent: 450, income: 800 },
  { day: "Wed", spent: 300, income: 0 },
  { day: "Thu", spent: 800, income: 0 },
  { day: "Fri", spent: 550, income: 1200 },
  { day: "Sat", spent: 900, income: 0 },
  { day: "Sun", spent: 400, income: 0 },
];

export const budgetItemsData = [
  { name: "Food & Dining", spent: 487.50, total: 650, status: "on track", month: "Jul" },
  { name: "Rent & Utilities", spent: 980.00, total: 1050, status: "on track", month: "Jul" },
  { name: "Health & Beauty", spent: 235.50, total: 500, status: "on track", month: "Jul" },
  { name: "Traveling", spent: 350.00, total: 400, status: "need attention", month: "Jul" },
  { name: "Investments", spent: 200.00, total: 800, status: "on track", month: "Jul" },
  { name: "Electronics", spent: 150.00, total: 1500, status: "on track", month: "Jul" },
  
  { name: "Food & Dining", spent: 320.00, total: 650, status: "on track", month: "Jun" },
  { name: "Rent & Utilities", spent: 980.00, total: 1050, status: "on track", month: "Jun" },
  { name: "Health & Beauty", spent: 410.00, total: 500, status: "need attention", month: "Jun" },
  { name: "Traveling", spent: 120.00, total: 400, status: "on track", month: "Jun" },
  { name: "Investments", spent: 400.00, total: 800, status: "on track", month: "Jun" },
  { name: "Electronics", spent: 890.00, total: 1500, status: "on track", month: "Jun" },
];

export const detailedMonthlyBudget: Record<string, { total: number; spent: number; remaining: number }> = {
  Jul: { total: 5950, spent: 2693, remaining: 3257 },
  Jun: { total: 5950, spent: 3120, remaining: 2830 },
};

export const mostExpensesData = [
  { name: "Rent & Utilities", amount: 1050, change: 1.5, positive: true, icon: "Home" },
  { name: "Food & Dining", amount: 1270, change: 10.2, positive: true, icon: "Coffee" },
  { name: "Education", amount: 650, change: 6.2, positive: true, icon: "GraduationCap" },
  { name: "Money transfer", amount: 2500, change: 15.5, positive: true, icon: "ArrowLeftRight" },
  { name: "Traveling", amount: 350, change: 3.0, positive: true, icon: "Plane" },
  { name: "Shopping", amount: 487, change: 5.5, positive: true, icon: "ShoppingBag" },
  { name: "Health & Beauty", amount: 235, change: 26.3, positive: false, icon: "Heart" },
];

export const transactionsData = [
  // INCOMES
  { id: 1, date: "27 Jul 18:00", amount: 8500, name: "Monthly Allowance", method: "Bank Transfer", category: "Salary", status: "Successful", type: "income", currency: "USD" },
  { id: 2, date: "12 Jun 10:00", amount: 390, name: "Freelance Project", method: "PayPal", category: "Salary", status: "Successful", type: "income", currency: "USD" },
  { id: 3, date: "25 Jun 10:00", amount: 1500, name: "Paycheck ABC", method: "VISA **3254", category: "Salary", status: "Successful", type: "income", currency: "USD" },
  
  // EXPENSES
  { id: 4, date: "25 Jul 12:30", amount: -19.99, name: "Netflix", method: "VISA **3254", category: "Subscription", status: "Successful", type: "expense", currency: "USD" },
  { id: 5, date: "26 Jul 15:00", amount: -150, name: "College Canteen", method: "UPI", category: "Food", status: "Successful", type: "expense", currency: "USD" },
  { id: 6, date: "27 Jul 09:00", amount: -80, name: "Uber Ride", method: "Mastercard **2154", category: "Travel", status: "Successful", type: "expense", currency: "USD" },
  { id: 7, date: "28 Jul 11:30", amount: -220, name: "Amazon Shopping", method: "VISA **3254", category: "Shopping", status: "Pending", type: "expense", currency: "USD" },
  { id: 8, date: "01 Jun 09:00", amount: -14.99, name: "Spotify", method: "Mastercard **2154", category: "Subscription", status: "Successful", type: "expense", currency: "USD" },
  { id: 9, date: "30 Jun 20:00", amount: -400, name: "Rent Payment", method: "Bank Transfer", category: "Rent", status: "Successful", type: "expense", currency: "INR" },
];

// Calendar transaction map — keyed by "YYYY-MM-DD"
export const calendarTransactions: Record<string, {
  id: number; name: string; amount: number; category: string; type: string;
}[]> = {
  // --- JUNE: High Density Spectrum ---
  "2024-06-01": [{ id: 101, name: "Spotify Premium", amount: -14.99, category: "Subs", type: "expense" }], 
  "2024-06-02": [{ id: 301, name: "Grocery Haul", amount: -145, category: "Food", type: "expense" }],
  "2024-06-03": [{ id: 302, name: "Cafe Latte", amount: -6, category: "Food", type: "expense" }],
  "2024-06-04": [{ id: 303, name: "Electric Bill", amount: -285, category: "Bills", type: "expense" }],
  "2024-06-05": [{ id: 304, name: "Amazon Gadgets", amount: -580, category: "Shopping", type: "expense" }], // DARK
  "2024-06-06": [{ id: 305, name: "Uber Ride", amount: -22, category: "Travel", type: "expense" }],
  "2024-06-07": [{ id: 306, name: "Dinner Out", amount: -85, category: "Food", type: "expense" }],
  "2024-06-08": [{ id: 307, name: "Weekend Trip Prep", amount: -320, category: "Travel", type: "expense" }],
  "2024-06-09": [{ id: 308, name: "Petrol Refill", amount: -55, category: "Travel", type: "expense" }],
  "2024-06-10": [{ id: 309, name: "Netflix", amount: -19, category: "Subs", type: "expense" }],
  "2024-06-11": [{ id: 310, name: "App Store", amount: -4, category: "Apps", type: "expense" }],
  "2024-06-12": [{ id: 102, name: "Freelance Project", amount: 1200, category: "Income", type: "income" }],
  "2024-06-13": [{ id: 311, name: "New Keyboard", amount: -180, category: "Stuff", type: "expense" }],
  "2024-06-14": [{ id: 312, name: "Movie Tickets", amount: -45, category: "Fun", type: "expense" }],
  "2024-06-15": [{ id: 313, name: "Major Luxury Purchase", amount: -2200, category: "Luxury", type: "expense" }], // INTENSE
  "2024-06-16": [{ id: 314, name: "Brunch", amount: -30, category: "Food", type: "expense" }],
  "2024-06-17": [{ id: 315, name: "Pharmacy", amount: -12, category: "Health", type: "expense" }],
  "2024-06-18": [{ id: 316, name: "Gym Gear", amount: -95, category: "Health", type: "expense" }],
  "2024-06-19": [{ id: 317, name: "Office Supplies", amount: -65, category: "Work", type: "expense" }],
  "2024-06-20": [{ id: 112, name: "EMI Payment", amount: -1100, category: "Loans", type: "expense" }], // DARK
  "2024-06-21": [{ id: 318, name: "Bar Tab", amount: -150, category: "Fun", type: "expense" }],
  "2024-06-22": [{ id: 319, name: "Subway", amount: -9, category: "Food", type: "expense" }],
  "2024-06-23": [{ id: 320, name: "Bookstore", amount: -40, category: "Life", type: "expense" }],
  "2024-06-24": [{ id: 321, name: "Cloud Subs", amount: -5, category: "Subs", type: "expense" }],
  "2024-06-25": [{ id: 103, name: "Salary Transfer", amount: 8500, category: "Income", type: "income" }],
  "2024-06-26": [{ id: 322, name: "Water Bill", amount: -75, category: "Bills", type: "expense" }],
  "2024-06-27": [{ id: 323, name: "Uber Taxi", amount: -28, category: "Travel", type: "expense" }],
  "2024-06-28": [{ id: 324, name: "Clothes Hub", amount: -450, category: "Shop", type: "expense" }],
  "2024-06-29": [{ id: 325, name: "Weekend Party", amount: -210, category: "Fun", type: "expense" }],
  "2024-06-30": [{ id: 104, name: "Monthly Rent", amount: -2500, category: "Rent", type: "expense" }], // INTENSE

  // --- JULY: High Activity Patterns ---
  "2024-07-01": [{ id: 401, name: "Coffee", amount: -8, category: "Food", type: "expense" }],
  "2024-07-02": [{ id: 402, name: "Gym Pass", amount: -60, category: "Health", type: "expense" }],
  "2024-07-03": [{ id: 403, name: "E-books", amount: -12, category: "Fun", type: "expense" }],
  "2024-07-04": [{ id: 404, name: "Lunch Combo", amount: -18, category: "Food", type: "expense" }],
  "2024-07-05": [{ id: 405, name: "Subscription", amount: -15, category: "Subs", type: "expense" }],
  "2024-07-06": [{ id: 406, name: "New Tires", amount: -450, category: "Travel", type: "expense" }],
  "2024-07-07": [{ id: 407, name: "Dinner Party", amount: -130, category: "Food", type: "expense" }],
  "2024-07-08": [{ id: 408, name: "Minor Expense", amount: -3, category: "Other", type: "expense" }],
  "2024-07-09": [{ id: 409, name: "Laundry", amount: -25, category: "Life", type: "expense" }],
  "2024-07-10": [{ id: 410, name: "Game Skin", amount: -10, category: "Fun", type: "expense" }],
  "2024-07-11": [{ id: 411, name: "Work Lunch", amount: -14, category: "Food", type: "expense" }],
  "2024-07-12": [{ id: 412, name: "PC Components", amount: -1800, category: "Tech", type: "expense" }], // DARK
  "2024-07-13": [{ id: 413, name: "Grocery Trip", amount: -110, category: "Food", type: "expense" }],
  "2024-07-14": [{ id: 414, name: "Donation", amount: -50, category: "Charity", type: "expense" }],
  "2024-07-15": [{ id: 415, name: "Uber", amount: -18, category: "Travel", type: "expense" }],
  "2024-07-16": [{ id: 416, name: "Pet Food", amount: -45, category: "Pet", type: "expense" }],
  "2024-07-17": [{ id: 417, name: "Snacks", amount: -7, category: "Food", type: "expense" }],
  "2024-07-18": [{ id: 418, name: "Software License", amount: -85, category: "Work", type: "expense" }],
  "2024-07-19": [{ id: 419, name: "Online Course", amount: -250, category: "Learn", type: "expense" }],
  "2024-07-20": [{ id: 420, name: "Investment", amount: -500, category: "Fin", type: "expense" }],
  "2024-07-21": [{ id: 421, name: "Weekend Trip", amount: -650, category: "Travel", type: "expense" }], // DARK
  "2024-07-22": [{ id: 422, name: "Dinner", amount: -40, category: "Food", type: "expense" }],
};

export const walletCards = [
  {
    id: 1, label: "Primary Card", number: "4532 •••• •••• 3254",
    bank: "HDFC Bank", type: "VISA", balance: 15700,
    color: ["#6345ED", "#9B85FD"], expiry: "08/27",
  },
  {
    id: 2, label: "Savings Card", number: "5412 •••• •••• 2154",
    bank: "ICICI Bank", type: "Mastercard", balance: 32913,
    color: ["#1A1D23", "#374151"], expiry: "11/26",
  },
  {
    id: 3, label: "UPI / Wallet", number: "alex@upi",
    bank: "PhonePe", type: "UPI", balance: 4280,
    color: ["#7C3AED", "#4F46E5"], expiry: "",
  },
];

export const walletStats = {
  totalBalance: 52893,
  monthlyIncome: 8500,
  monthlyExpense: 6222,
  savingsRate: 27,
};

export const quickTransfers = [
  { id: 1, name: "Mira May", initials: "MM", color: "#F59E0B" },
  { id: 2, name: "Chris G", initials: "CG", color: "#22C55E" },
  { id: 3, name: "Nellie B", initials: "NB", color: "#EC4899" },
  { id: 4, name: "Ravi K", initials: "RK", color: "#3B82F6" },
  { id: 5, name: "Add New", initials: "+", color: "#E5E7EB" },
];