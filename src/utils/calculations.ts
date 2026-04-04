export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface LeaveBalance {
  remaining: number | null;
  utilization: number;
}

export interface BudgetUtilization {
  remaining: number;
  utilization: number;
  overBudget: boolean;
}

export interface GoalProgress {
  progress: number;
  status: 'not-started' | 'completed' | 'on-track' | 'behind';
}

export interface ESATResponse {
  score: number;
}

type DateFormat = 'short' | 'long' | 'iso';
type AttendanceStatus = 'not-checked-in' | 'on-time' | 'late';

export const isWeekend = (date: Date | string): boolean => {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6;
};

export const businessDaysBetween = (start: Date | string, end: Date | string): number => {
  let count = 0;
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    if (!isWeekend(current)) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

export const calculateLeaveDays = (startDate: Date | string | null | undefined, endDate: Date | string | null | undefined, excludeWeekends = true): number => {
  if (!startDate || !endDate) return 0;
  return excludeWeekends
    ? businessDaysBetween(new Date(startDate), new Date(endDate))
    : Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

export const calculateDuration = (startTime: string | null | undefined, endTime: string | null | undefined): number => {
  if (!startTime || !endTime) return 0;
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  return Math.round(((endMin - startMin) / 60) * 10) / 10;
};

export const calculateTotalHours = (checkIn: string | null | undefined, checkOut: string | null | undefined): number => {
  if (!checkIn || !checkOut) return 0;
  const [ch, cm] = checkIn.split(':').map(Number);
  const [oh, om] = checkOut.split(':').map(Number);
  const startMin = ch * 60 + cm;
  const endMin = oh * 60 + om;
  return Math.round(((endMin - startMin) / 60) * 100) / 100;
};

export const calculateOvertime = (checkIn: string | null | undefined, checkOut: string | null | undefined, shiftEnd = '17:00'): number => {
  if (!checkOut) return 0;
  const [sh, sm] = shiftEnd.split(':').map(Number);
  const [oh, om] = checkOut.split(':').map(Number);
  const shiftEndMin = sh * 60 + sm;
  const checkOutMin = oh * 60 + om;
  if (checkOutMin <= shiftEndMin) return 0;
  return Math.round(((checkOutMin - shiftEndMin) / 60) * 100) / 100;
};

export const calculateNetPay = (basic: number, hra: number, allowances: number, overtime = 0, bonus = 0, deductions = 0, tax = 0): number => {
  const gross = basic + hra + allowances + overtime + bonus;
  return gross - deductions - tax;
};

export const calculateTax = (grossIncome: number, taxBrackets: TaxBracket[]): number => {
  let tax = 0;
  let remaining = grossIncome;
  for (const bracket of taxBrackets) {
    const taxable = Math.min(remaining, bracket.max - bracket.min);
    if (taxable <= 0) break;
    tax += taxable * (bracket.rate / 100);
    remaining -= taxable;
  }
  return Math.round(tax * 100) / 100;
};

export const calculateLeaveBalance = (total: number | null, used: number): LeaveBalance => ({
  remaining: total !== null ? Math.max(0, total - used) : null,
  utilization: total !== null ? Math.round((used / total) * 100) : 0,
});

export const calculateBudgetUtilization = (spent: number, budget: number): BudgetUtilization => ({
  remaining: budget - spent,
  utilization: budget > 0 ? Math.round((spent / budget) * 100) : 0,
  overBudget: spent > budget,
});

export const calculateAttendanceStatus = (checkInTime: string | null | undefined, shiftStart = '09:00', lateThreshold = 15): AttendanceStatus => {
  if (!checkInTime) return 'not-checked-in';
  const [ch, cm] = checkInTime.split(':').map(Number);
  const [sh, sm] = shiftStart.split(':').map(Number);
  const checkInMin = ch * 60 + cm;
  const shiftStartMin = sh * 60 + sm;
  const diff = checkInMin - shiftStartMin;
  if (diff <= 0) return 'on-time';
  if (diff <= lateThreshold) return 'on-time';
  return 'late';
};

export const calculateProductivityScore = (attendanceRate: number, taskCompletion: number, qualityScore: number, collaborationScore: number): number => {
  const weights = { attendance: 0.25, tasks: 0.35, quality: 0.25, collaboration: 0.15 };
  return Math.round(
    (attendanceRate * weights.attendance +
     taskCompletion * weights.tasks +
     qualityScore * weights.quality +
     collaborationScore * weights.collaboration) * 100
  ) / 100;
};

export const calculateGoalProgress = (completed: number, total: number): GoalProgress => ({
  progress: total > 0 ? Math.round((completed / total) * 100) : 0,
  status: total === 0 ? 'not-started' : completed >= total ? 'completed' : completed / total >= 0.5 ? 'on-track' : 'behind',
});

export const calculateTurnoverRate = (departures: number, avgHeadcount: number, periodMonths = 12): number => {
  if (avgHeadcount === 0) return 0;
  return Math.round((departures / avgHeadcount) * 10000) / 100;
};

export const calculateCostPerHire = (totalRecruitingCost: number, hiresCount: number): number => {
  if (hiresCount === 0) return 0;
  return Math.round(totalRecruitingCost / hiresCount);
};

export const calculateTimeToFill = (openDate: Date | string | null | undefined, fillDate: Date | string | null | undefined): number => {
  if (!openDate || !fillDate) return 0;
  return Math.ceil((new Date(fillDate).getTime() - new Date(openDate).getTime()) / (1000 * 60 * 60 * 24));
};

export const calculateCompRatio = (salary: number, midpoint: number): number => {
  if (midpoint === 0) return 0;
  return Math.round((salary / midpoint) * 100) / 100;
};

export const calculatePayEquity = (salaries: number[], demographics: string[]): Record<string, number> => {
  const groups: Record<string, number[]> = {};
  salaries.forEach((s, i) => {
    const group = demographics[i] || 'unknown';
    if (!groups[group]) groups[group] = [];
    groups[group].push(s);
  });
  const averages: Record<string, number> = {};
  for (const [group, sals] of Object.entries(groups)) {
    averages[group] = Math.round((sals.reduce((a, b) => a + b, 0) / sals.length) * 100) / 100;
  }
  return averages;
};

export const calculateRetentionRate = (startCount: number, endCount: number, newHires: number): number => {
  const adjustedStart = startCount - newHires;
  if (adjustedStart === 0) return 100;
  return Math.round((endCount / adjustedStart) * 10000) / 100;
};

export const calculateAbsenceRate = (totalAbsenceDays: number, totalWorkDays: number, employeeCount: number): number => {
  if (totalWorkDays === 0 || employeeCount === 0) return 0;
  return Math.round((totalAbsenceDays / (totalWorkDays * employeeCount)) * 10000) / 100;
};

export const calculateRevenuePerEmployee = (totalRevenue: number, employeeCount: number): number => {
  if (employeeCount === 0) return 0;
  return Math.round(totalRevenue / employeeCount);
};

export const calculateHCIRatio = (totalRevenue: number, totalHRCost: number): number => {
  if (totalHRCost === 0) return 0;
  return Math.round(totalRevenue / totalHRCost * 100) / 100;
};

export const calculatePromotionRate = (promotions: number, totalEmployees: number): number => {
  if (totalEmployees === 0) return 0;
  return Math.round((promotions / totalEmployees) * 10000) / 100;
};

export const calculateDiversityIndex = (demographics: Record<string, number>): number => {
  const total = Object.values(demographics).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let index = 0;
  for (const count of Object.values(demographics)) {
    const p = count / total;
    index += p * p;
  }
  return Math.round((1 - index) * 10000) / 10000;
};

export const calculateESATScore = (responses: ESATResponse[]): number => {
  if (responses.length === 0) return 0;
  const total = responses.reduce((sum, r) => sum + r.score, 0);
  return Math.round((total / responses.length) * 100) / 100;
};

export const calculateNPS = (promoters: number, passives: number, detractors: number): number => {
  const total = promoters + passives + detractors;
  if (total === 0) return 0;
  return Math.round(((promoters - detractors) / total) * 100);
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export const formatDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m > 0 ? m + 'm' : ''}`;
};

export const formatDate = (date: Date | string, format: DateFormat = 'short'): string => {
  const d = new Date(date);
  if (format === 'short') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (format === 'long') return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  if (format === 'iso') return d.toISOString().split('T')[0];
  return d.toLocaleDateString();
};
