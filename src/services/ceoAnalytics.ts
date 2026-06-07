import { getState } from '../store';
import { calculateTotalHours, formatCurrency } from '../utils/calculations';

// ============================
// CEO ANALYTICS CALCULATIONS
// ============================

export interface HeadcountMetrics {
  total: number;
  active: number;
  onboarding: number;
  growth: number;
  attrition: number;
  newHires: number;
}

export interface AttendanceMetrics {
  averageAttendance: number;
  lateRate: number;
  absentRate: number;
  overtimeHours: number;
  averageHoursPerDay: number;
}

export interface FinancialMetrics {
  totalPayroll: number;
  averageSalary: number;
  totalExpenses: number;
  budgetUtilization: number;
  payrollTrend: { month: string; amount: number }[];
}

export interface PerformanceMetrics {
  averageKPI: number;
  topPerformers: number;
  needsImprovement: number;
  averageRating: number;
  pendingReviews: number;
}

export interface DepartmentMetric {
  id: number;
  name: string;
  headcount: number;
  averageKPI: number;
  budgetUtilization: number;
  totalExpenses: number;
  attendanceRate: number;
}

export interface DiversityMetrics {
  genderBreakdown: { male: number; female: number; other: number };
  ageGroups: { [key: string]: number };
  tenureDistribution: { [key: string]: number };
  diversityScore: number;
}

export interface WorkforcePipeline {
  openPositions: number;
  applicants: number;
  interviews: number;
  offers: number;
  hires: number;
  timeToHire: number;
}

export interface ComplianceStatus {
  pendingAudits: number;
  policyViolations: number;
  resolvedIssues: number;
  complianceScore: number;
  upcomingDeadlines: { title: string; date: string }[];
}

/**
 * Get executive headcount metrics
 */
export const getHeadcountMetrics = (): HeadcountMetrics => {
  const state = getState();
  const employees = state.employees;
  
  const active = employees.filter(e => e.status === 'active').length;
  const onboarding = employees.filter(e => e.status === 'onboarding').length;
  
  // Calculate growth (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newHires = employees.filter(e => {
    const joinDate = new Date(e.joinDate);
    return joinDate > thirtyDaysAgo;
  }).length;

  // Mock attrition rate
  const attrition = 2.3;
  const growth = ((active - 5) / 5) * 100; // 5 previous employees

  return {
    total: employees.length,
    active,
    onboarding,
    growth: Math.round(growth * 10) / 10,
    attrition,
    newHires,
  };
};

/**
 * Get attendance analytics
 */
export const getAttendanceMetrics = (): AttendanceMetrics => {
  const state = getState();
  const history = state.attendance.history;

  if (history.length === 0) {
    return {
      averageAttendance: 0,
      lateRate: 0,
      absentRate: 0,
      overtimeHours: 0,
      averageHoursPerDay: 0,
    };
  }

  const onTime = history.filter(r => r.status === 'on-time').length;
  const late = history.filter(r => r.status === 'late').length;
  const absent = history.filter(r => r.status === 'absent').length;
  const totalHours = history.reduce((sum, r) => sum + r.totalHours, 0);
  const overtime = history.reduce((sum, r) => sum + (r.overtime || 0), 0);

  return {
    averageAttendance: Math.round((onTime / history.length) * 100),
    lateRate: Math.round((late / history.length) * 100),
    absentRate: Math.round((absent / history.length) * 100),
    overtimeHours: Math.round(overtime * 10) / 10,
    averageHoursPerDay: Math.round((totalHours / history.length) * 10) / 10,
  };
};

/**
 * Get financial overview for CEO
 */
export const getFinancialMetrics = (): FinancialMetrics => {
  const state = getState();
  const employees = state.employees;
  const budgets = state.budgets;

  const totalPayroll = employees.reduce((sum, e) => {
    const salary = (state.user.salary.basic + state.user.salary.hra + state.user.salary.allowances) * 12;
    return sum + salary;
  }, 0);

  const totalExpenses = budgets.totalSpent;
  const budgetUtilization = Math.round((budgets.totalSpent / budgets.totalBudget) * 100);

  // Mock payroll trend
  const payrollTrend = [
    { month: 'Oct', amount: totalPayroll * 0.85 },
    { month: 'Nov', amount: totalPayroll * 0.92 },
    { month: 'Dec', amount: totalPayroll * 1.15 }, // Bonus month
    { month: 'Jan', amount: totalPayroll * 0.98 },
    { month: 'Feb', amount: totalPayroll * 1.0 },
    { month: 'Mar', amount: totalPayroll * 1.03 },
  ];

  return {
    totalPayroll,
    averageSalary: Math.round(totalPayroll / employees.length),
    totalExpenses,
    budgetUtilization,
    payrollTrend,
  };
};

/**
 * Get company-wide performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetrics => {
  const state = getState();
  const employees = state.employees;

  const avgKPI = Math.round(employees.reduce((sum, e) => sum + e.kpiScore, 0) / employees.length);
  const avgRating = Math.round(employees.reduce((sum, e) => sum + e.rating, 0) / employees.length * 10) / 10;
  const topPerformers = employees.filter(e => e.kpiScore >= 90).length;
  const needsImprovement = employees.filter(e => e.kpiScore < 70).length;
  const pendingReviews = employees.reduce((sum, e) => sum + e.pendingReviews, 0);

  return {
    averageKPI: avgKPI,
    topPerformers,
    needsImprovement,
    averageRating: avgRating,
    pendingReviews,
  };
};

/**
 * Get metrics broken down by department
 */
export const getDepartmentMetrics = (): DepartmentMetric[] => {
  const state = getState();
  const employees = state.employees;
  const budgets = state.budgets.departments;

  const departmentGroups: { [key: string]: typeof employees } = {};
  employees.forEach(e => {
    if (!departmentGroups[e.department]) {
      departmentGroups[e.department] = [];
    }
    departmentGroups[e.department].push(e);
  });

  return budgets.map(budget => {
    const deptEmployees = departmentGroups[budget.name] || [];
    const avgKPI = deptEmployees.length > 0 
      ? Math.round(deptEmployees.reduce((sum, e) => sum + e.kpiScore, 0) / deptEmployees.length)
      : 0;

    return {
      id: budget.id,
      name: budget.name,
      headcount: deptEmployees.length,
      averageKPI: avgKPI,
      budgetUtilization: Math.round((budget.spent / budget.budget) * 100),
      totalExpenses: budget.spent,
      attendanceRate: 92 + Math.floor(Math.random() * 8), // Mock based on department
    };
  });
};

/**
 * Get diversity and inclusion metrics
 */
export const getDiversityMetrics = (): DiversityMetrics => {
  // Mock diversity data (would be real in production)
  return {
    genderBreakdown: {
      male: 58,
      female: 38,
      other: 4,
    },
    ageGroups: {
      '20-25': 12,
      '26-35': 45,
      '36-45': 28,
      '46-55': 12,
      '55+': 3,
    },
    tenureDistribution: {
      '0-1 year': 22,
      '1-3 years': 48,
      '3-5 years': 20,
      '5+ years': 10,
    },
    diversityScore: 78,
  };
};

/**
 * Get hiring pipeline metrics
 */
export const getWorkforcePipeline = (): WorkforcePipeline => {
  return {
    openPositions: 12,
    applicants: 147,
    interviews: 38,
    offers: 8,
    hires: 5,
    timeToHire: 18.5, // days
  };
};

/**
 * Get compliance status
 */
export const getComplianceStatus = (): ComplianceStatus => {
  return {
    pendingAudits: 2,
    policyViolations: 5,
    resolvedIssues: 18,
    complianceScore: 94,
    upcomingDeadlines: [
      { title: 'Annual Compliance Audit', date: '2026-04-15' },
      { title: 'Tax Filing Deadline', date: '2026-04-30' },
      { title: 'Safety Training Renewal', date: '2026-05-10' },
    ],
  };
};

/**
 * Get executive summary for CEO dashboard
 */
export const getExecutiveSummary = () => {
  return {
    headcount: getHeadcountMetrics(),
    attendance: getAttendanceMetrics(),
    financial: getFinancialMetrics(),
    performance: getPerformanceMetrics(),
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Calculate trend direction with arrow
 */
export const getTrendDirection = (current: number, previous: number) => {
  const diff = current - previous;
  if (diff > 0) return 'up';
  if (diff < 0) return 'down';
  return 'stable';
};

export default {
  getHeadcountMetrics,
  getAttendanceMetrics,
  getFinancialMetrics,
  getPerformanceMetrics,
  getDepartmentMetrics,
  getDiversityMetrics,
  getWorkforcePipeline,
  getComplianceStatus,
  getExecutiveSummary,
  getTrendDirection,
};
