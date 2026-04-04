export const currentUser = {
  id: 'EMP-2024-889',
  name: 'Sarah Miller',
  role: 'Senior Software Engineer',
  department: 'Engineering',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  email: 'sarah.miller@karajo.com',
  phone: '+1 (555) 123-4567',
  joinDate: '2022-03-15',
};

export const attendanceData = {
  today: {
    status: 'checked-out',
    checkIn: '08:32 AM',
    checkOut: '05:00 PM',
    totalHours: '08h 15m',
    workSchedule: '09:00 - 17:00',
    isOnTime: true,
  },
  history: [
    { date: 'Tue, 24 Feb', day: 'Regular Shift', checkIn: '09:00 AM', checkOut: '06:00 PM', totalDuration: '9h 00m', status: 'on-time' },
    { date: 'Mon, 23 Feb', day: 'Regular Shift', checkIn: '09:45 AM', checkOut: '06:45 PM', totalDuration: '9h 00m', status: 'late' },
    { date: 'Fri, 20 Feb', day: 'Overtime', checkIn: '09:00 AM', checkOut: '08:30 PM', totalDuration: '11h 30m', status: 'overtime' },
    { date: 'Thu, 19 Feb', day: 'Sick Leave', checkIn: '-', checkOut: '-', totalDuration: '-', status: 'absent' },
  ],
  monthlySummary: {
    productivityScore: 94,
    scoreChange: '+2.5%',
    totalHours: '176h 30m',
    hoursChange: '+4h',
    workDays: 22,
    onTimeDays: 20,
    avgClockIn: '08:52 AM',
    earlyBy: '2m early',
    overtime: '4h 30m',
    overtimeStatus: 'Paid',
    leaveTaken: 1,
    leaveType: 'Annual',
    lateArrivals: 2,
    lateMinutes: '-15 mins',
  },
};

export const leaveData = {
  balance: {
    annual: { total: 20, used: 8, remaining: 12 },
    sick: { total: 7, used: 2, remaining: 5 },
    personal: { total: 3, used: 1, remaining: 2 },
  },
  currentRequests: [
    { id: 1, type: 'Annual Leave', dates: 'Feb 24 - Feb 25', days: 2, status: 'pending', date: 'Feb 24' },
    { id: 2, type: 'Remote Work', dates: 'Nov 01', days: 1, status: 'approved', date: 'Nov 01' },
  ],
  history: [
    { id: 3, type: 'Annual Leave', subtype: 'Vacation & Rest', dates: '12 Feb - 15 Feb', days: 3, status: 'pending', month: 'October 2026' },
    { id: 4, type: 'Sick Leave', subtype: 'Medical reasons', dates: '02 Feb - 03 Feb', days: 1, status: 'approved', month: 'October 2026' },
    { id: 5, type: 'Vacation Leave', subtype: 'Personal trip', dates: '20 Sep - 25 Sep', days: 5, status: 'approved', month: 'September 2026' },
    { id: 6, type: 'Casual Leave', subtype: 'Emergency matters', dates: '10 Sep 2026', days: 1, status: 'rejected', month: 'September 2026' },
  ],
};

export const activityData = {
  today: {
    date: 'Feb 22, 2026',
    total: '4h 15m',
    activities: [
      { id: 1, title: 'Frontend Development', project: 'Karajo HRIS Internal Tools', duration: '3h 15m', time: '1:00 PM - 4:15 PM', category: 'Development' },
      { id: 2, title: 'Client Meeting', project: 'Project Alpha', duration: '1h 00m', time: '9:00 AM - 10:00 AM', category: 'Meeting' },
    ],
  },
  weekly: {
    period: 'Feb 22 - Feb 28',
    totalLogged: '38h 00m',
    workDays: 5,
    weeklyGoal: '38h / 40h',
    avgDaily: '8h 30m',
    overtime: '2h 30m',
    overtimeStatus: 'Pending Approval',
    days: [
      { day: 'Friday, Feb 28', total: '4h 15m', activities: [
        { title: 'Frontend Development', project: 'Karajo HRIS Internal Tools', duration: '3h 15m', time: '1:00 PM - 4:15 PM' },
        { title: 'Client Meeting', project: 'Project Alpha', duration: '1h 00m', time: '9:00 AM - 10:00 AM' },
      ]},
      { day: 'Thursday, Feb 27', total: '6h 30m', activities: [
        { title: 'Sprint Planning', project: 'All Hands', duration: '3h 30m', time: '1:00 PM - 4:30 PM' },
        { title: 'Design System Update', project: 'Internal Tools', duration: '2h 15m', time: '10:00 AM - 12:15 PM' },
        { title: 'Code Review & Merge', project: 'Project Y', duration: '0h 45m', time: '9:00 AM - 9:45 AM' },
      ]},
      { day: 'Wednesday, Feb 26', total: '4h 00m', activities: [
        { title: 'User Testing Session', project: 'Project Alpha', duration: '4h 00m', time: '9:00 AM - 1:00 PM' },
      ]},
    ],
  },
  monthly: {
    period: 'February 2026',
    totalLogged: '168h 00m',
    workDays: 20,
    regular: '160 hours',
    overtime: '08 hours',
    weeks: [
      { period: 'Feb 22 - Feb 28', week: 'Week 4', hours: '40h 30m', status: 'pending' },
      { period: 'Feb 15 - Feb 21', week: 'Week 3', hours: '42h 00m', status: 'approved' },
      { period: 'Feb 08 - Feb 14', week: 'Week 2', hours: '40h 00m', status: 'approved' },
      { period: 'Feb 01 - Feb 07', week: 'Week 1', hours: '46h 00m', status: 'approved' },
    ],
  },
};

export const permissionData = {
  summary: {
    totalHours: '24.5h',
    approved: 12,
  },
  requests: [
    { id: 1, title: "Doctor's Appointment", type: 'Personal Permission', date: 'Oct 24', time: '09:00 - 11:00', duration: '2 Hours', status: 'pending', month: 'This Month' },
    { id: 2, title: 'School Pick-up', type: 'Family Emergency', date: 'Oct 18', time: '15:00 - 16:30', duration: '1.5 Hours', status: 'approved', month: 'This Month' },
    { id: 3, title: 'Internet Maintenance', type: 'House Emergency', date: 'Sep 12', time: '08:00 - 12:00', duration: '4 Hours', status: 'approved', month: 'September 2023' },
    { id: 4, title: 'Brief Personal Matter', type: 'Other', date: 'Sep 05', time: '10:00 - 11:00', duration: '1 Hour', status: 'rejected', month: 'September 2023' },
  ],
};

export const overtimeData = {
  summary: {
    totalApproved: '12.5 Hours',
    change: '15% more than last month',
  },
  requests: [
    { id: 1, date: 'Monday, Oct 24', reason: 'Quarterly Report Prep', time: '18:00 - 21:00', duration: '3h 0m', status: 'pending' },
    { id: 2, date: 'Thursday, Oct 22', reason: 'Server Migration Support', time: '17:30 - 20:30', duration: '3h 0m', status: 'approved' },
    { id: 3, date: 'Tuesday, Oct 18', reason: 'Inventory Stock Audit', time: '18:00 - 22:30', duration: '4h 30m', status: 'approved' },
    { id: 4, date: 'Friday, Sep 29', reason: 'Personal Projects (Unauthorized)', time: '19:00 - 21:00', duration: '2h 0m', status: 'rejected' },
  ],
};

export const payslipData = {
  latest: {
    period: 'Feb 1 - Feb 28, 2026',
    amount: '$4,250.00',
    status: 'Paid',
  },
  history: [
    { id: 1, month: 'February 2026', amount: '$4,250.00', paidOn: 'Feb 01, 2024', status: 'Paid', type: 'regular' },
    { id: 2, month: 'January 2026', amount: '$4,250.00', paidOn: 'Jan 01, 2026', status: 'Paid', type: 'regular' },
    { id: 3, month: 'Annual Bonus', amount: '$1,500.00', paidOn: 'Dec 20, 2026', status: 'Paid', type: 'bonus' },
    { id: 4, month: 'February 2026', amount: '$4,250.00', paidOn: 'Feb 01, 2024', status: 'Paid', type: 'regular' },
  ],
};

export const expenseData = {
  summary: {
    pending: 1240.00,
    approved: 3500.50,
    rejected: 120.00,
  },
  expenses: [
    { id: 1, title: 'Uber to Airport', category: 'Business Trip', date: 'Oct 24', amount: 45.00, status: 'pending', icon: 'car' },
    { id: 2, title: 'Flight to NYC', category: 'Business Trip', date: 'Oct 24', amount: 450.00, status: 'paid', icon: 'plane' },
    { id: 3, title: 'Client Lunch', category: 'Marketing', date: 'Oct 22', amount: 4250.00, status: 'paid', icon: 'utensils' },
    { id: 4, title: 'Client Dinner', category: 'Marketing', date: 'Oct 22', amount: 4250.00, status: 'paid', icon: 'utensils' },
    { id: 5, title: 'Uber to Airport', category: 'Business Trip', date: 'Oct 24', amount: 45.00, status: 'pending', icon: 'car', month: 'January 2026' },
  ],
  detail: {
    id: 'EXP-2024-089',
    amount: 12.50,
    category: 'Meals & Entertainment',
    merchant: 'The Corner Bistro',
    date: 'Feb 24, 2026',
    description: 'Team coffee meeting regarding Q4 roadmap.',
    attachment: { name: 'receipt_delta_oct24.pdf', size: '2.4 MB', uploaded: 'Oct 25' },
    timeline: [
      { status: 'Submitted', date: 'Feb 28, 09:00 PM', by: 'Sarah Miller' },
      { status: 'Finance Review', date: 'Feb 28, 09:20 PM', by: 'Alex Johnson' },
      { status: 'Revision Requested', date: 'Feb 28, 09:20 PM', by: 'Alex Johnson' },
      { status: 'Correction Needed', date: 'Feb 28, 09:20 PM', by: 'Alex Johnson', active: true },
    ],
  },
};

export const notifications = [
  { id: 1, title: 'Time to Check In', message: "Your workday has started. Don't forget to record your attendance.", time: '1h ago', type: 'reminder', unread: true },
  { id: 2, title: 'Time Tracking Still Active', message: 'Your work session is still running. Please check if you forgot to check out.', time: '1h ago', type: 'warning', unread: true },
  { id: 3, title: 'December Payslip', message: 'Your payslip for December 2023 is now available for download.', time: '1h ago', type: 'info', unread: true },
  { id: 4, title: 'New Team Member', message: 'Dimas J. has joined the Design Team. Say hello! 👋', time: '1h ago', type: 'team', unread: true },
  { id: 5, title: 'System Maintenance', message: 'Karajo will under scheduled maintenance tonight from 2:00 AM...', time: '1h ago', type: 'system', unread: true },
  { id: 6, title: 'Leave Request Approved', message: 'Your annual leave for Feb 28 has been approved.', time: '1h ago', type: 'success', unread: true },
];

export const updates = [
  { id: 1, title: 'Leave Request Approved', message: 'Your annual leave for Feb 28 has been...', time: '1h ago', type: 'leave' },
  { id: 2, title: 'Office Announcement', message: 'Office will be closed this Friday for mai...', time: '2h ago', type: 'announcement' },
];

export const colleagues = [
  { id: 1, name: 'Hanna Jenkins', role: 'Senior Project Manager', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', status: 'online' },
  { id: 2, name: 'Michael Chen', role: 'UX Designer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', status: 'online' },
  { id: 3, name: 'David Miller', role: 'QA Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', status: 'offline' },
  { id: 4, name: 'Emma Wilson', role: 'Product Marketing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', status: 'online' },
];

export const aiSuggestions = [
  { id: 1, title: 'Insurance details', icon: 'shield' },
  { id: 2, title: 'Holiday calendar', icon: 'calendar' },
];

export const aiCategories = [
  { id: 'my-hr', name: 'My HR', active: true },
  { id: 'policies', name: 'Policies', active: false },
  { id: 'benefits', name: 'Benefits', active: false },
  { id: 'career', name: 'Career', active: false },
];

export const aiQuickActions = [
  { id: 1, title: 'Remaining leave', subtitle: 'Check remaining days', icon: 'calendar-check' },
  { id: 2, title: 'Last payslip', subtitle: 'Last 3 months info', icon: 'file-text' },
  { id: 3, title: 'Remote policy', subtitle: 'Direct reporting line', icon: 'monitor' },
  { id: 4, title: 'Insurance details', subtitle: 'Update deposit info', icon: 'shield' },
  { id: 5, title: 'Holiday calendar', subtitle: 'Year-to-date total', icon: 'calendar' },
  { id: 6, title: '2026 Tax docs', subtitle: 'Check next review', icon: 'file' },
];

export const activityCategories = [
  { id: 'development', name: 'Development', icon: 'code', active: true },
  { id: 'meeting', name: 'Meeting', icon: 'users', active: false },
  { id: 'admin', name: 'Admin', icon: 'clipboard', active: false },
  { id: 'design', name: 'Design', icon: 'pen-tool', active: false },
  { id: 'qa', name: 'QA', icon: 'search', active: false },
];

export const projects = [
  { id: 1, name: 'Karajo HRIS Internal Tools' },
  { id: 2, name: 'Project Alpha' },
  { id: 3, name: 'All Hands' },
  { id: 4, name: 'Internal Tools' },
  { id: 5, name: 'Project Y' },
  { id: 6, name: 'Dirga Corp - Mobile App Redesign' },
];

export const leaveTypes = [
  { id: 'annual', name: 'Annual Leave', balance: '12 Days', remaining: 12 },
  { id: 'sick', name: 'Sick Leave', balance: '5 Days', remaining: 5 },
  { id: 'unpaid', name: 'Unpaid Leave', balance: 'Unlimited', remaining: null },
];

export const correctionReasons = [
  { id: 'forgot-checkin', label: 'Forgot to Check In' },
  { id: 'forgot-checkout', label: 'Forgot to Check Out' },
  { id: 'incorrect-time', label: 'Incorrect Time Record' },
  { id: 'location-issue', label: 'Location Issue' },
  { id: 'business-trip', label: 'Business Trip / Offsite' },
  { id: 'other', label: 'Other' },
];

export const penaltyData = {
  summary: {
    activePenalties: 2,
    totalFines: '$150.00',
    resolved: 5,
    warningPoints: 4,
  },
  penalties: [
    { id: 1, type: 'Late Arrival', date: 'Feb 24, 2026', severity: 'warning', status: 'active', description: 'Arrived 45 minutes late without prior notice', fine: '$25.00', issuedBy: 'HR Department', reference: 'PEN-2026-001', appealDeadline: 'Mar 03, 2026' },
    { id: 2, type: 'Dress Code Violation', date: 'Feb 20, 2026', severity: 'warning', status: 'active', description: 'Did not follow company dress code policy on client meeting day', fine: '$50.00', issuedBy: 'Admin Team', reference: 'PEN-2026-002', appealDeadline: 'Feb 27, 2026' },
    { id: 3, type: 'Unauthorized Absence', date: 'Feb 10, 2026', severity: 'error', status: 'under-review', description: 'Absent for 2 consecutive days without approved leave', fine: '$200.00', issuedBy: 'HR Department', reference: 'PEN-2026-003', appealDeadline: 'Feb 17, 2026' },
    { id: 4, type: 'Policy Violation', date: 'Jan 15, 2026', severity: 'warning', status: 'resolved', description: 'Used personal email for company communication', fine: '$0.00', issuedBy: 'IT Department', reference: 'PEN-2025-089', appealDeadline: 'Jan 22, 2026' },
    { id: 5, type: 'Late Submission', date: 'Dec 28, 2025', severity: 'info', status: 'resolved', description: 'Missed quarterly report submission deadline', fine: '$0.00', issuedBy: 'Manager', reference: 'PEN-2025-078', appealDeadline: 'Jan 04, 2026' },
    { id: 6, type: 'Meeting No-Show', date: 'Dec 15, 2025', severity: 'warning', status: 'resolved', description: 'Missed mandatory all-hands meeting without notification', fine: '$0.00', issuedBy: 'HR Department', reference: 'PEN-2025-067', appealDeadline: 'Dec 22, 2025' },
  ],
  appealTypes: [
    { id: 'incorrect-fact', label: 'Incorrect Facts', icon: 'alert-circle' },
    { id: 'medical', label: 'Medical Emergency', icon: 'medical' },
    { id: 'transport', label: 'Transport Issue', icon: 'car' },
    { id: 'miscommunication', label: 'Miscommunication', icon: 'chatbubbles' },
    { id: 'extenuating', label: 'Extenuating Circumstances', icon: 'help-circle' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
  ],
};

export const shortcuts = [
  { id: 'attendance', name: 'Attendance', icon: 'calendar', color: '#2563EB', category: 'Time Management' },
  { id: 'leave', name: 'Leave', icon: 'umbrella', color: '#F59E0B', category: 'Time Management' },
  { id: 'overtime', name: 'Overtime', icon: 'clock', color: '#8B5CF6', category: 'Time Management' },
  { id: 'shift', name: 'Shift', icon: 'moon', color: '#14B8A6', category: 'Time Management' },
  { id: 'payslip', name: 'Payslip', icon: 'file-text', color: '#22C55E', category: 'Finance' },
  { id: 'reimburse', name: 'Reimburse', icon: 'credit-card', color: '#EC4899', category: 'Finance' },
  { id: 'loan', name: 'Loan', icon: 'dollar-sign', color: '#6366F1', category: 'Finance' },
  { id: 'tax', name: 'Tax', icon: 'percent', color: '#F97316', category: 'Finance' },
  { id: 'penalty', name: 'Penalty', icon: 'warning', color: '#EF4444', category: 'Requests & General' },
  { id: 'team', name: 'Team', icon: 'users', color: '#EF4444', category: 'Requests & General' },
  { id: 'assets', name: 'Assets', icon: 'briefcase', color: '#F59E0B', category: 'Requests & General' },
  { id: 'docs', name: 'Docs', icon: 'folder', color: '#3B82F6', category: 'Requests & General' },
  { id: 'manage', name: 'Manage', icon: 'sliders', color: '#64748B', category: 'Requests & General' },
  { id: 'directory', name: 'Directory', icon: 'people', color: '#2563EB', category: 'People & Performance' },
  { id: 'orgchart', name: 'Org Chart', icon: 'git-branch', color: '#8B5CF6', category: 'People & Performance' },
  { id: 'onboarding', name: 'Onboarding', icon: 'rocket', color: '#14B8A6', category: 'People & Performance' },
  { id: 'performance', name: 'Performance', icon: 'trending-up', color: '#22C55E', category: 'People & Performance' },
  { id: 'kpi', name: 'KPIs', icon: 'speedometer', color: '#F97316', category: 'People & Performance' },
  { id: 'goals', name: 'Goals', icon: 'flag', color: '#EC4899', category: 'People & Performance' },
  { id: 'feedback', name: 'Feedback', icon: 'chatbubble-ellipses', color: '#6366F1', category: 'People & Performance' },
];

export const employees = [
  { id: 1, name: 'Sarah Miller', role: 'Senior Software Engineer', department: 'Engineering', manager: 'James Wilson', email: 'sarah.miller@karajo.com', phone: '+1 (555) 123-4567', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', joinDate: 'Mar 15, 2022', status: 'active', location: 'New York', employmentType: 'Full-time', rating: 4.5, kpiScore: 94, pendingReviews: 2 },
  { id: 2, name: 'James Wilson', role: 'Engineering Manager', department: 'Engineering', manager: 'CTO', email: 'james.wilson@karajo.com', phone: '+1 (555) 234-5678', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', joinDate: 'Jan 10, 2020', status: 'active', location: 'New York', employmentType: 'Full-time', rating: 4.8, kpiScore: 97, pendingReviews: 5 },
  { id: 3, name: 'Hanna Jenkins', role: 'Senior Project Manager', department: 'Operations', manager: 'COO', email: 'hanna.jenkins@karajo.com', phone: '+1 (555) 345-6789', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', joinDate: 'Jun 01, 2021', status: 'active', location: 'San Francisco', employmentType: 'Full-time', rating: 4.6, kpiScore: 91, pendingReviews: 3 },
  { id: 4, name: 'Michael Chen', role: 'UX Designer', department: 'Design', manager: 'Design Lead', email: 'michael.chen@karajo.com', phone: '+1 (555) 456-7890', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', joinDate: 'Sep 20, 2022', status: 'active', location: 'Remote', employmentType: 'Full-time', rating: 4.3, kpiScore: 88, pendingReviews: 1 },
  { id: 5, name: 'Emma Wilson', role: 'Product Marketing', department: 'Marketing', manager: 'Marketing Director', email: 'emma.wilson@karajo.com', phone: '+1 (555) 567-8901', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', joinDate: 'Feb 14, 2023', status: 'active', location: 'Chicago', employmentType: 'Full-time', rating: 4.7, kpiScore: 93, pendingReviews: 0 },
  { id: 6, name: 'David Miller', role: 'QA Lead', department: 'Engineering', manager: 'James Wilson', email: 'david.miller@karajo.com', phone: '+1 (555) 678-9012', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', joinDate: 'Nov 05, 2021', status: 'active', location: 'New York', employmentType: 'Full-time', rating: 4.2, kpiScore: 86, pendingReviews: 4 },
  { id: 7, name: 'Lisa Park', role: 'HR Specialist', department: 'Human Resources', manager: 'HR Director', email: 'lisa.park@karajo.com', phone: '+1 (555) 789-0123', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop', joinDate: 'Apr 18, 2023', status: 'active', location: 'New York', employmentType: 'Full-time', rating: 4.4, kpiScore: 90, pendingReviews: 6 },
  { id: 8, name: 'Alex Johnson', role: 'Finance Analyst', department: 'Finance', manager: 'CFO', email: 'alex.johnson@karajo.com', phone: '+1 (555) 890-1234', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', joinDate: 'Jul 22, 2022', status: 'active', location: 'San Francisco', employmentType: 'Full-time', rating: 4.1, kpiScore: 85, pendingReviews: 2 },
  { id: 9, name: 'Rachel Green', role: 'Junior Developer', department: 'Engineering', manager: 'James Wilson', email: 'rachel.green@karajo.com', phone: '+1 (555) 901-2345', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop', joinDate: 'Jan 09, 2024', status: 'onboarding', location: 'Remote', employmentType: 'Full-time', rating: null, kpiScore: null, pendingReviews: 0 },
  { id: 10, name: 'Tom Brown', role: 'DevOps Engineer', department: 'Engineering', manager: 'James Wilson', email: 'tom.brown@karajo.com', phone: '+1 (555) 012-3456', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop', joinDate: 'Aug 30, 2023', status: 'active', location: 'Chicago', employmentType: 'Full-time', rating: 4.5, kpiScore: 92, pendingReviews: 1 },
];

export const departments = [
  { id: 'engineering', name: 'Engineering', head: 'James Wilson', count: 4, budget: '$480,000', color: '#2563EB' },
  { id: 'design', name: 'Design', head: 'Design Lead', count: 1, budget: '$95,000', color: '#8B5CF6' },
  { id: 'marketing', name: 'Marketing', head: 'Marketing Director', count: 1, budget: '$110,000', color: '#EC4899' },
  { id: 'operations', name: 'Operations', head: 'COO', count: 1, budget: '$120,000', color: '#F59E0B' },
  { id: 'hr', name: 'Human Resources', head: 'HR Director', count: 1, budget: '$90,000', color: '#14B8A6' },
  { id: 'finance', name: 'Finance', head: 'CFO', count: 1, budget: '$105,000', color: '#22C55E' },
];

export const orgChart = {
  name: 'CEO',
  role: 'Chief Executive Officer',
  children: [
    {
      name: 'CTO',
      role: 'Chief Technology Officer',
      children: [
        { name: 'James Wilson', role: 'Engineering Manager', children: [
          { name: 'Sarah Miller', role: 'Senior Software Engineer' },
          { name: 'David Miller', role: 'QA Lead' },
          { name: 'Rachel Green', role: 'Junior Developer' },
          { name: 'Tom Brown', role: 'DevOps Engineer' },
        ]},
        { name: 'Michael Chen', role: 'UX Designer' },
      ],
    },
    {
      name: 'COO',
      role: 'Chief Operating Officer',
      children: [
        { name: 'Hanna Jenkins', role: 'Senior Project Manager' },
      ],
    },
    {
      name: 'CFO',
      role: 'Chief Financial Officer',
      children: [
        { name: 'Alex Johnson', role: 'Finance Analyst' },
      ],
    },
    {
      name: 'Marketing Director',
      role: 'Director of Marketing',
      children: [
        { name: 'Emma Wilson', role: 'Product Marketing' },
      ],
    },
    {
      name: 'HR Director',
      role: 'Director of Human Resources',
      children: [
        { name: 'Lisa Park', role: 'HR Specialist' },
      ],
    },
  ],
};

export const onboardingData = {
  newHires: [
    { id: 1, name: 'Rachel Green', role: 'Junior Developer', department: 'Engineering', startDate: 'Jan 09, 2024', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop', progress: 65, buddy: 'Sarah Miller', status: 'in-progress' },
    { id: 2, name: 'Tom Brown', role: 'DevOps Engineer', department: 'Engineering', startDate: 'Aug 30, 2023', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop', progress: 100, buddy: 'James Wilson', status: 'completed' },
  ],
  checklist: [
    { id: 1, title: 'IT Setup', items: [{ task: 'Email account created', done: true }, { task: 'Laptop configured', done: true }, { task: 'Software licenses assigned', done: true }, { task: 'Slack/Teams access', done: true }] },
    { id: 2, title: 'HR Paperwork', items: [{ task: 'Employment contract signed', done: true }, { task: 'Tax forms submitted', done: true }, { task: 'Direct deposit setup', done: false }, { task: 'Benefits enrollment', done: false }] },
    { id: 3, title: 'Orientation', items: [{ task: 'Company overview session', done: true }, { task: 'Office tour', done: true }, { task: 'Team introductions', done: true }, { task: 'Policy handbook review', done: false }] },
    { id: 4, title: 'Training', items: [{ task: 'Security training', done: false }, { task: 'Compliance training', done: false }, { task: 'Product knowledge session', done: false }] },
  ],
};

export const performanceData = {
  overview: {
    overallRating: 4.3,
    totalReviews: 24,
    completedReviews: 18,
    pendingReviews: 6,
    avgKpiScore: 89,
    topPerformers: 5,
    needsImprovement: 2,
  },
  kpis: [
    { id: 1, name: 'Code Quality', target: '95%', current: '92%', status: 'on-track', trend: 'up', category: 'Technical' },
    { id: 2, name: 'Sprint Completion', target: '90%', current: '88%', status: 'on-track', trend: 'up', category: 'Technical' },
    { id: 3, name: 'Bug Resolution Time', target: '< 24h', current: '18h', status: 'exceeding', trend: 'up', category: 'Technical' },
    { id: 4, name: 'Team Collaboration', target: '4.0/5', current: '4.5/5', status: 'exceeding', trend: 'stable', category: 'Soft Skills' },
    { id: 5, name: 'Documentation', target: '100%', current: '78%', status: 'at-risk', trend: 'down', category: 'Technical' },
    { id: 6, name: 'Client Satisfaction', target: '4.5/5', current: '4.2/5', status: 'on-track', trend: 'up', category: 'Soft Skills' },
    { id: 7, name: 'Innovation Score', target: '3/quarter', current: '2/quarter', status: 'at-risk', trend: 'stable', category: 'Growth' },
    { id: 8, name: 'Mentorship Hours', target: '20h/quarter', current: '24h/quarter', status: 'exceeding', trend: 'up', category: 'Growth' },
  ],
  goals: [
    { id: 1, title: 'Lead Frontend Architecture Redesign', progress: 72, deadline: 'Mar 31, 2026', status: 'on-track', priority: 'high', category: 'Technical' },
    { id: 2, title: 'Mentor 2 Junior Developers', progress: 60, deadline: 'Jun 30, 2026', status: 'on-track', priority: 'medium', category: 'Leadership' },
    { id: 3, title: 'Complete AWS Certification', progress: 45, deadline: 'Dec 31, 2026', status: 'on-track', priority: 'medium', category: 'Growth' },
    { id: 4, title: 'Reduce Production Bugs by 30%', progress: 85, deadline: 'Apr 30, 2026', status: 'on-track', priority: 'high', category: 'Technical' },
    { id: 5, title: 'Publish 2 Technical Blog Posts', progress: 20, deadline: 'Sep 30, 2026', status: 'behind', priority: 'low', category: 'Growth' },
  ],
  reviews: [
    { id: 1, reviewer: 'James Wilson', type: 'Manager Review', date: 'Feb 28, 2026', status: 'completed', rating: 4.5, summary: 'Excellent technical skills and strong team collaboration. Shows leadership potential.' },
    { id: 2, reviewer: 'Hanna Jenkins', type: 'Peer Review', date: 'Feb 25, 2026', status: 'completed', rating: 4.3, summary: 'Great problem solver, very helpful to the team. Could improve documentation habits.' },
    { id: 3, reviewer: 'David Miller', type: 'Peer Review', date: 'Feb 20, 2026', status: 'completed', rating: 4.6, summary: 'Reliable and consistent. Always willing to help with code reviews.' },
    { id: 4, reviewer: 'Self Assessment', type: 'Self Review', date: 'Feb 15, 2026', status: 'completed', rating: 4.2, summary: 'Had a strong quarter with notable improvements in code quality and delivery speed.' },
    { id: 5, reviewer: 'Rachel Green', type: 'Direct Report', date: 'Pending', status: 'pending', rating: null, summary: null },
  ],
  feedback: [
    { id: 1, from: 'James Wilson', to: 'Sarah Miller', type: 'positive', date: 'Feb 28, 2026', text: 'Sarah consistently delivers high-quality work and has been instrumental in the frontend redesign. Her mentorship of junior team members is exemplary.', category: 'Technical Excellence' },
    { id: 2, from: 'Hanna Jenkins', to: 'Sarah Miller', type: 'constructive', date: 'Feb 25, 2026', text: 'Would benefit from more proactive communication during sprint planning. Sometimes technical decisions are made without full team visibility.', category: 'Communication' },
    { id: 3, from: 'David Miller', to: 'Sarah Miller', type: 'positive', date: 'Feb 20, 2026', text: 'Excellent code reviews - thorough, constructive, and always timely. Makes the whole team better.', category: 'Teamwork' },
    { id: 4, from: 'Rachel Green', to: 'Sarah Miller', type: 'positive', date: 'Feb 18, 2026', text: 'Sarah has been an amazing mentor. She explains complex concepts clearly and is always available for questions.', category: 'Mentorship' },
    { id: 5, from: 'Michael Chen', to: 'Sarah Miller', type: 'constructive', date: 'Feb 15, 2026', text: 'Design handoff documentation could be more detailed. Sometimes there are gaps between design intent and implementation.', category: 'Design Collaboration' },
  ],
};
