import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@karajo_hr_data';

const getDefaultState = () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return {
    user: {
      id: 'EMP-2024-889',
      name: 'Sarah Miller',
      role: 'Senior Software Engineer',
      department: 'Engineering',
      email: 'sarah.miller@karajo.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2022-03-15',
      salary: { basic: 5000, hra: 2000, allowances: 1500, deductions: 800, tax: 450 },
      manager: 'James Wilson',
      status: 'active',
    },
    attendance: {
      today: { date: today, checkIn: null, checkOut: null, status: 'not-checked-in', location: null, totalHours: 0 },
      history: [
        { date: '2026-02-24', checkIn: '09:00', checkOut: '18:00', totalHours: 9, status: 'on-time', location: 'Office - New York' },
        { date: '2026-02-23', checkIn: '09:45', checkOut: '18:45', totalHours: 9, status: 'late', location: 'Office - New York' },
        { date: '2026-02-20', checkIn: '09:00', checkOut: '20:30', totalHours: 11.5, status: 'overtime', location: 'Office - New York' },
        { date: '2026-02-19', checkIn: null, checkOut: null, totalHours: 0, status: 'absent', location: null },
        { date: '2026-02-18', checkIn: '08:55', checkOut: '17:00', totalHours: 8.08, status: 'on-time', location: 'Office - New York' },
      ],
      corrections: [],
    },
    leave: {
      balances: [
        { type: 'Annual', total: 20, used: 8, remaining: 12, icon: 'umbrella', color: '#2563EB' },
        { type: 'Sick', total: 7, used: 2, remaining: 5, icon: 'medkit', color: '#EF4444' },
        { type: 'Personal', total: 3, used: 1, remaining: 2, icon: 'person', color: '#8B5CF6' },
        { type: 'Unpaid', total: null, used: 0, remaining: null, icon: 'cash', color: '#F59E0B' },
      ],
      requests: [
        { id: 1, type: 'Annual', startDate: '2026-02-24', endDate: '2026-02-25', days: 2, reason: 'Family vacation', status: 'pending', appliedOn: '2026-02-20', delegate: 'David Miller', documents: [] },
        { id: 2, type: 'Sick', startDate: '2026-02-02', endDate: '2026-02-03', days: 2, reason: 'Medical appointment', status: 'approved', appliedOn: '2026-02-01', delegate: null, documents: [] },
        { id: 3, type: 'Annual', startDate: '2026-01-15', endDate: '2026-01-17', days: 3, reason: 'Personal matters', status: 'approved', appliedOn: '2026-01-10', delegate: 'Rachel Green', documents: [] },
        { id: 4, type: 'Personal', startDate: '2025-12-20', endDate: '2025-12-20', days: 1, reason: 'Bank work', status: 'rejected', appliedOn: '2025-12-18', delegate: null, documents: [] },
      ],
      nextId: 5,
    },
    permission: {
      totalHoursUsed: 12.5,
      monthlyAllowance: 16,
      requests: [
        { id: 1, date: '2026-02-24', startTime: '09:00', endTime: '11:00', duration: 2, reason: "Doctor's appointment", status: 'pending', appliedOn: '2026-02-22' },
        { id: 2, date: '2026-02-18', startTime: '15:00', endTime: '16:30', duration: 1.5, reason: 'School pick-up', status: 'approved', appliedOn: '2026-02-17' },
        { id: 3, date: '2026-01-12', startTime: '08:00', endTime: '12:00', duration: 4, reason: 'Internet maintenance', status: 'approved', appliedOn: '2026-01-11' },
      ],
      nextId: 4,
    },
    overtime: {
      totalApproved: 12.5,
      totalPending: 3,
      requests: [
        { id: 1, date: '2026-02-24', startTime: '18:00', endTime: '21:00', duration: 3, reason: 'Quarterly Report Prep', status: 'pending', appliedOn: '2026-02-23' },
        { id: 2, date: '2026-02-22', startTime: '17:30', endTime: '20:30', duration: 3, reason: 'Server Migration', status: 'approved', appliedOn: '2026-02-21' },
        { id: 3, date: '2026-02-18', startTime: '18:00', endTime: '22:30', duration: 4.5, reason: 'Inventory Audit', status: 'approved', appliedOn: '2026-02-17' },
      ],
      nextId: 4,
    },
    payroll: {
      payslips: [
        { id: 1, month: 'February 2026', period: 'Feb 1 - Feb 28, 2026', basic: 5000, hra: 2000, allowances: 1500, overtime: 450, bonus: 0, deductions: 800, tax: 450, netPay: 7700, status: 'paid', paidOn: '2026-03-01' },
        { id: 2, month: 'January 2026', period: 'Jan 1 - Jan 31, 2026', basic: 5000, hra: 2000, allowances: 1500, overtime: 200, bonus: 0, deductions: 800, tax: 450, netPay: 7450, status: 'paid', paidOn: '2026-02-01' },
        { id: 3, month: 'December 2025', period: 'Dec 1 - Dec 31, 2025', basic: 5000, hra: 2000, allowances: 1500, overtime: 0, bonus: 1500, deductions: 800, tax: 450, netPay: 8750, status: 'paid', paidOn: '2026-01-01' },
        { id: 4, month: 'November 2025', period: 'Nov 1 - Nov 30, 2025', basic: 5000, hra: 2000, allowances: 1500, overtime: 300, bonus: 0, deductions: 800, tax: 450, netPay: 7550, status: 'paid', paidOn: '2025-12-01' },
      ],
      taxDocuments: [
        { id: 1, name: 'W-2 Form 2025', year: 2025, type: 'W-2', status: 'available' },
        { id: 2, name: '1099 Form 2025', year: 2025, type: '1099', status: 'pending' },
      ],
    },
    expenses: {
      requests: [
        { id: 1, title: 'Uber to Airport', category: 'Travel', date: '2026-02-24', amount: 45, status: 'pending', description: 'Client meeting transport', receipt: null },
        { id: 2, title: 'Flight to NYC', category: 'Travel', date: '2026-02-20', amount: 450, status: 'approved', description: 'Business trip', receipt: null },
        { id: 3, title: 'Client Lunch', category: 'Meals', date: '2026-02-18', amount: 85, status: 'approved', description: 'Client discussion', receipt: null },
        { id: 4, title: 'Office Supplies', category: 'Supplies', date: '2026-02-10', amount: 32, status: 'rejected', description: 'Printer cartridges', receipt: null },
      ],
      nextId: 5,
    },
    penalties: {
      records: [
        { id: 1, type: 'Late Arrival', date: '2026-02-24', severity: 'warning', status: 'active', description: 'Arrived 45 minutes late without prior notice', fine: 25, issuedBy: 'HR Department', reference: 'PEN-2026-001', appealDeadline: '2026-03-03' },
        { id: 2, type: 'Dress Code Violation', date: '2026-02-20', severity: 'warning', status: 'active', description: 'Did not follow company dress code policy', fine: 50, issuedBy: 'Admin Team', reference: 'PEN-2026-002', appealDeadline: '2026-02-27' },
        { id: 3, type: 'Policy Violation', date: '2026-01-15', severity: 'warning', status: 'resolved', description: 'Used personal email for company communication', fine: 0, issuedBy: 'IT Department', reference: 'PEN-2025-089', appealDeadline: '2026-01-22' },
      ],
      appeals: [],
      nextId: 4,
    },
    notifications: [
      { id: 1, title: 'Time to Check In', message: "Your workday has started. Don't forget to record your attendance.", time: new Date().toISOString(), type: 'reminder', read: false },
      { id: 2, title: 'Leave Request Approved', message: 'Your annual leave for Feb 28 has been approved.', time: new Date(Date.now() - 3600000).toISOString(), type: 'success', read: false },
      { id: 3, title: 'Payslip Available', message: 'Your payslip for February 2026 is now available.', time: new Date(Date.now() - 7200000).toISOString(), type: 'info', read: true },
    ],
  };
};

let state = getDefaultState();
let listeners = new Set();

export const getState = () => JSON.parse(JSON.stringify(state));

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyListeners = () => {
  listeners.forEach(listener => listener(state));
};

export const setState = (updater) => {
  const newState = typeof updater === 'function' ? updater(state) : updater;
  state = { ...state, ...newState };
  saveState();
  notifyListeners();
};

export const resetState = () => {
  state = getDefaultState();
  saveState();
  notifyListeners();
};

export const loadState = async () => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...getDefaultState(), ...parsed };
      notifyListeners();
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
};

export const saveState = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
};

// Attendance Actions
export const checkIn = (location = 'Office - New York') => {
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 5);
  const hour = now.getHours();
  let status = 'on-time';
  if (hour >= 9 && now.getMinutes() > 15) status = 'late';

  setState(prev => ({
    attendance: {
      ...prev.attendance,
      today: { date: now.toISOString().split('T')[0], checkIn: timeStr, checkOut: null, status, location, totalHours: 0 },
    },
    notifications: [{ id: Date.now(), title: 'Checked In', message: `You checked in at ${timeStr} from ${location}`, time: now.toISOString(), type: 'success', read: false }, ...prev.notifications],
  }));
};

export const checkOut = () => {
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 5);
  setState(prev => {
    const checkInTime = prev.attendance.today.checkIn;
    let totalHours = 0;
    if (checkInTime) {
      const [inH, inM] = checkInTime.split(':').map(Number);
      const diff = (now.getHours() * 60 + now.getMinutes()) - (inH * 60 + inM);
      totalHours = Math.round((diff / 60) * 100) / 100;
    }

    const todayRecord = {
      date: prev.attendance.today.date,
      checkIn: prev.attendance.today.checkIn,
      checkOut: timeStr,
      totalHours,
      status: totalHours > 9 ? 'overtime' : prev.attendance.today.status,
      location: prev.attendance.today.location,
    };

    return {
      attendance: {
        ...prev.attendance,
        today: { ...prev.attendance.today, checkOut: timeStr, totalHours, status: todayRecord.status },
        history: [todayRecord, ...prev.attendance.history],
      },
      notifications: [{ id: Date.now(), title: 'Checked Out', message: `You checked out at ${timeStr}. Total: ${totalHours}h`, time: now.toISOString(), type: 'info', read: false }, ...prev.notifications],
    };
  });
};

// Leave Actions
export const requestLeave = (data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  setState(prev => {
    const newRequest = {
      id: prev.leave.nextId,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      reason: data.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      delegate: data.delegate || null,
      documents: [],
    };

    const updatedBalances = prev.leave.balances.map(b =>
      b.type === data.type ? { ...b, used: b.used + days, remaining: b.remaining !== null ? b.remaining - days : null } : b
    );

    return {
      leave: {
        ...prev.leave,
        requests: [newRequest, ...prev.leave.requests],
        balances: updatedBalances,
        nextId: prev.leave.nextId + 1,
      },
      notifications: [{ id: Date.now(), title: 'Leave Request Submitted', message: `${days} day(s) of ${data.type} leave requested`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
    };
  });
};

// Permission Actions
export const requestPermission = (data) => {
  setState(prev => {
    const duration = data.duration || 1;
    const newRequest = {
      id: prev.permission.nextId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      duration,
      reason: data.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    return {
      permission: {
        ...prev.permission,
        requests: [newRequest, ...prev.permission.requests],
        totalHoursUsed: prev.permission.totalHoursUsed + duration,
        nextId: prev.permission.nextId + 1,
      },
      notifications: [{ id: Date.now(), title: 'Permission Requested', message: `${duration}h permission requested for ${data.date}`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
    };
  });
};

// Overtime Actions
export const requestOvertime = (data) => {
  setState(prev => {
    const newRequest = {
      id: prev.overtime.nextId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      reason: data.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    return {
      overtime: {
        ...prev.overtime,
        requests: [newRequest, ...prev.overtime.requests],
        totalPending: prev.overtime.totalPending + data.duration,
        nextId: prev.overtime.nextId + 1,
      },
      notifications: [{ id: Date.now(), title: 'Overtime Requested', message: `${data.duration}h overtime requested for ${data.date}`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
    };
  });
};

// Expense Actions
export const submitExpense = (data) => {
  setState(prev => ({
    expenses: {
      ...prev.expenses,
      requests: [{ id: prev.expenses.nextId, ...data, status: 'pending', appliedOn: new Date().toISOString().split('T')[0] }, ...prev.expenses.requests],
      nextId: prev.expenses.nextId + 1,
    },
    notifications: [{ id: Date.now(), title: 'Expense Submitted', message: `$${data.amount} expense for ${data.category}`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
  }));
};

// Penalty Actions
export const appealPenalty = (data) => {
  setState(prev => ({
    penalties: {
      ...prev.penalties,
      appeals: [{ id: Date.now(), penaltyId: data.penaltyId, type: data.type, explanation: data.explanation, status: 'submitted', submittedOn: new Date().toISOString().split('T')[0] }, ...prev.penalties.appeals],
    },
    notifications: [{ id: Date.now(), title: 'Penalty Appeal Filed', message: `Appeal for ${data.penaltyType} has been submitted`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
  }));
};

// Notification Actions
export const markNotificationRead = (id) => {
  setState(prev => ({
    notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  }));
};

export const markAllNotificationsRead = () => {
  setState(prev => ({
    notifications: prev.notifications.map(n => ({ ...n, read: true })),
  }));
};

export const deleteNotification = (id) => {
  setState(prev => ({
    notifications: prev.notifications.filter(n => n.id !== id),
  }));
};
