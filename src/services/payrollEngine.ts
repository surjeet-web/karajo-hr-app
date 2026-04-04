import { getState, setState } from '../store';
import {
  calculateTotalHours,
  calculateOvertime,
  calculateNetPay,
  calculateTax,
  formatCurrency,
} from '../utils/calculations';

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface EmployeeSalary {
  basic: number;
  hra: number;
  allowances: number;
  deductions?: number;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  status: string;
  salary?: EmployeeSalary;
  location?: string;
}

export interface AttendanceRecord {
  date: string;
  status: string;
  totalHours?: number;
  checkIn?: string;
  checkOut?: string;
  overtime?: number;
}

export interface PayrollResult {
  employeeId: string;
  employeeName: string;
  department: string;
  month: number;
  year: number;
  basic: number;
  hra: number;
  allowances: number;
  overtimeHours: number;
  overtimePay: number;
  absentDays: number;
  absentDeduction: number;
  grossIncome: number;
  insurance: number;
  retirement: number;
  tax: number;
  totalDeductions: number;
  netPay: number;
  totalWorkHours: number;
}

export interface EmployeePayroll extends PayrollResult {
  status?: string;
  payslipId?: string;
}

export interface PayrollRun {
  id: number;
  month: number;
  year: number;
  status: 'draft' | 'approved' | 'processed';
  employeeCount: number;
  totalPayroll: number;
  totalTax: number;
  totalDeductions: number;
  totalOvertimePay: number;
  totalGross: number;
  employees: PayrollResult[];
  createdAt: string;
  processedAt: string | null;
  approvedAt: string | null;
  processedBy: string | null;
  approvedBy: string | null;
}

export interface PayrollSummary extends PayrollRun {
  avgNetPay: number;
  maxNetPay: number;
  minNetPay: number;
}

export interface DepartmentPayrollSummary {
  department: string;
  employeeCount: number;
  totalPayroll: number;
  totalTax: number;
  avgNetPay: number;
  employees: EmployeePayroll[];
}

export interface PayrollTrendEntry {
  month: string;
  year: number;
  totalPayroll: number;
  employeeCount: number;
  status: string;
}

export interface W2Form {
  formType: string;
  year: number;
  employee: {
    name: string;
    ssn: string;
    address: string;
  };
  employer: {
    name: string;
    ein: string;
    address: string;
  };
  wages: number;
  federalTaxWithheld: number;
  socialSecurityWages: number;
  socialSecurityTax: number;
  medicareWages: number;
  medicareTax: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
}

export const TAX_BRACKETS_2026: TaxBracket[] = [
  { min: 0, max: 11000, rate: 10 },
  { min: 11000, max: 44725, rate: 12 },
  { min: 44725, max: 95375, rate: 22 },
  { min: 95375, max: 182100, rate: 24 },
  { min: 182100, max: 231250, rate: 32 },
  { min: 231250, max: 578125, rate: 35 },
  { min: 578125, max: Infinity, rate: 37 },
];

export const OVERTIME_RATE = 1.5;
export const INSURANCE_RATE = 0.05;
export const RETIREMENT_RATE = 0.06;
export const STANDARD_DEDUCTION = 13850;

interface AppState {
  employees: Employee[];
  attendance: { history: AttendanceRecord[] };
  payroll: { payrollRuns?: PayrollRun[] };
  notifications: Notification[];
}

export const calculateEmployeePayroll = (
  employee: Employee,
  attendanceRecords: AttendanceRecord[],
  month: number,
  year: number
): PayrollResult => {
  const salary = employee.salary || { basic: 5000, hra: 2000, allowances: 1500 };
  const basic = salary.basic || 0;
  const hra = salary.hra || 0;
  const allowances = salary.allowances || 0;

  const monthRecords = attendanceRecords.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  let totalOvertimeHours = 0;
  let totalWorkHours = 0;
  let absentDays = 0;

  monthRecords.forEach(record => {
    if (record.status === 'absent') {
      absentDays++;
      return;
    }
    const hours = record.totalHours || 0;
    totalWorkHours += hours;
    if (record.overtime) {
      totalOvertimeHours += record.overtime;
    } else if (record.checkIn && record.checkOut) {
      const ot = calculateOvertime(record.checkIn, record.checkOut);
      totalOvertimeHours += ot;
    }
  });

  const hourlyRate = basic / 160;
  const overtimePay = totalOvertimeHours * hourlyRate * OVERTIME_RATE;

  const absentDeduction = absentDays * (basic / 22);

  const grossIncome = basic + hra + allowances + overtimePay - absentDeduction;

  const insurance = grossIncome * INSURANCE_RATE;
  const retirement = grossIncome * RETIREMENT_RATE;
  const totalDeductions = insurance + retirement + (salary.deductions || 0);

  const taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION);
  const tax = calculateTax(taxableIncome, TAX_BRACKETS_2026);

  const netPay = calculateNetPay(basic, hra, allowances, overtimePay, 0, totalDeductions, tax);

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    department: employee.department,
    month,
    year,
    basic,
    hra,
    allowances,
    overtimeHours: totalOvertimeHours,
    overtimePay: Math.round(overtimePay * 100) / 100,
    absentDays,
    absentDeduction: Math.round(absentDeduction * 100) / 100,
    grossIncome: Math.round(grossIncome * 100) / 100,
    insurance: Math.round(insurance * 100) / 100,
    retirement: Math.round(retirement * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netPay: Math.round(netPay * 100) / 100,
    totalWorkHours: Math.round(totalWorkHours * 100) / 100,
  };
};

export const runPayroll = (month: number, year: number): PayrollRun => {
  const state = getState() as AppState;
  const { employees, attendance } = state;

  const activeEmployees = employees.filter(e => e.status === 'active');
  const payrollResults: PayrollResult[] = [];
  let totalPayroll = 0;
  let totalTax = 0;
  let totalDeductions = 0;
  let totalOvertimePay = 0;

  activeEmployees.forEach(emp => {
    const result = calculateEmployeePayroll(emp, attendance.history, month, year);
    payrollResults.push(result);
    totalPayroll += result.netPay;
    totalTax += result.tax;
    totalDeductions += result.totalDeductions;
    totalOvertimePay += result.overtimePay;
  });

  return {
    id: Date.now(),
    month,
    year,
    status: 'draft',
    employeeCount: payrollResults.length,
    totalPayroll: Math.round(totalPayroll * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    totalOvertimePay: Math.round(totalOvertimePay * 100) / 100,
    totalGross: Math.round(payrollResults.reduce((sum, r) => sum + r.grossIncome, 0) * 100) / 100,
    employees: payrollResults,
    createdAt: new Date().toISOString(),
    processedAt: null,
    approvedAt: null,
    processedBy: null,
    approvedBy: null,
  };
};

export const savePayrollRun = (payrollRun: PayrollRun): PayrollRun => {
  setState((prev: AppState) => ({
    payroll: {
      ...prev.payroll,
      payrollRuns: [payrollRun, ...(prev.payroll.payrollRuns || [])],
    },
  }));
  return payrollRun;
};

export const approvePayrollRun = (payrollId: number, approvedBy: string): void => {
  setState((prev: AppState) => ({
    payroll: {
      ...prev.payroll,
      payrollRuns: (prev.payroll.payrollRuns || []).map(run =>
        run.id === payrollId
          ? { ...run, status: 'approved' as const, approvedAt: new Date().toISOString(), approvedBy }
          : run
      ),
    },
  }));

  const state = getState() as AppState;
  const run = (state.payroll.payrollRuns || []).find(r => r.id === payrollId);
  if (!run) return;

  const notifications: Notification[] = run.employees.map(emp => ({
    id: Date.now() + Math.random(),
    title: 'Payslip Available',
    message: `Your payslip for ${new Date(0, run.month - 1).toLocaleString('default', { month: 'long' })} ${run.year} is ready. Net pay: ${formatCurrency(emp.netPay)}`,
    time: new Date().toISOString(),
    type: 'success',
    read: false,
  }));

  setState((prev: AppState) => ({
    notifications: [...notifications, ...prev.notifications],
  }));
};

export const getPayrollSummary = (month: number, year: number): PayrollSummary => {
  const state = getState() as AppState;
  const runs = state.payroll.payrollRuns || [];
  const run = runs.find(r => r.month === month && r.year === year);

  if (run) {
    return {
      ...run,
      avgNetPay: run.employeeCount > 0 ? Math.round(run.totalPayroll / run.employeeCount * 100) / 100 : 0,
      maxNetPay: Math.max(...run.employees.map(e => e.netPay), 0),
      minNetPay: Math.min(...run.employees.map(e => e.netPay), 0),
    };
  }

  const draftRun = runPayroll(month, year);
  return {
    ...draftRun,
    avgNetPay: draftRun.employeeCount > 0 ? Math.round(draftRun.totalPayroll / draftRun.employeeCount * 100) / 100 : 0,
    maxNetPay: Math.max(...draftRun.employees.map(e => e.netPay), 0),
    minNetPay: Math.min(...draftRun.employees.map(e => e.netPay), 0),
  };
};

export const getEmployeePayslip = (
  employeeId: string,
  month: number,
  year: number
): EmployeePayroll | null => {
  const state = getState() as AppState;
  const runs = state.payroll.payrollRuns || [];

  for (const run of runs) {
    if (run.month === month && run.year === year) {
      const emp = run.employees.find(e => e.employeeId === employeeId);
      if (emp) return { ...emp, status: run.status, payslipId: `PSL-${run.year}-${String(run.month).padStart(2, '0')}-${employeeId}` };
    }
  }

  const employee = state.employees.find(e => e.id === employeeId);
  if (!employee) return null;

  const calc = calculateEmployeePayroll(employee, state.attendance.history, month, year);
  return {
    ...calc,
    status: 'draft',
    payslipId: `PSL-${year}-${String(month).padStart(2, '0')}-${employeeId}`,
  };
};

export const getDepartmentPayrollSummary = (
  department: string,
  month: number,
  year: number
): DepartmentPayrollSummary => {
  const state = getState() as AppState;
  const runs = state.payroll.payrollRuns || [];
  const run = runs.find(r => r.month === month && r.year === year);

  if (!run) {
    const draftRun = runPayroll(month, year);
    const deptEmployees = draftRun.employees.filter(e => e.department === department);
    return {
      department,
      employeeCount: deptEmployees.length,
      totalPayroll: deptEmployees.reduce((sum, e) => sum + e.netPay, 0),
      totalTax: deptEmployees.reduce((sum, e) => sum + e.tax, 0),
      avgNetPay: deptEmployees.length > 0 ? deptEmployees.reduce((sum, e) => sum + e.netPay, 0) / deptEmployees.length : 0,
      employees: deptEmployees,
    };
  }

  const deptEmployees = run.employees.filter(e => e.department === department);
  return {
    department,
    employeeCount: deptEmployees.length,
    totalPayroll: deptEmployees.reduce((sum, e) => sum + e.netPay, 0),
    totalTax: deptEmployees.reduce((sum, e) => sum + e.tax, 0),
    avgNetPay: deptEmployees.length > 0 ? deptEmployees.reduce((sum, e) => sum + e.netPay, 0) / deptEmployees.length : 0,
    employees: deptEmployees,
  };
};

export const getPayrollTrends = (months = 6): PayrollTrendEntry[] => {
  const state = getState() as AppState;
  const runs = state.payroll.payrollRuns || [];
  const now = new Date();
  const trends: PayrollTrendEntry[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const run = runs.find(r => r.month === month && r.year === year);

    trends.push({
      month: d.toLocaleString('default', { month: 'short' }),
      year,
      totalPayroll: run ? run.totalPayroll : 0,
      employeeCount: run ? run.employeeCount : 0,
      status: run ? run.status : 'not-run',
    });
  }

  return trends;
};

export const generateW2Form = (employeeId: string, year: number): W2Form | null => {
  const state = getState() as AppState;
  const runs = state.payroll.payrollRuns || [];
  const yearRuns = runs.filter(r => r.year === year && r.status === 'approved');

  let totalWages = 0;
  let totalFederalTax = 0;
  let totalSocialSecurity = 0;
  let totalMedicare = 0;

  yearRuns.forEach(run => {
    const emp = run.employees.find(e => e.employeeId === employeeId);
    if (emp) {
      totalWages += emp.grossIncome;
      totalFederalTax += emp.tax;
      totalSocialSecurity += emp.grossIncome * 0.062;
      totalMedicare += emp.grossIncome * 0.0145;
    }
  });

  const employee = state.employees.find(e => e.id === employeeId);
  if (!employee) return null;

  return {
    formType: 'W-2',
    year,
    employee: {
      name: employee.name,
      ssn: '***-**-****',
      address: employee.location || 'N/A',
    },
    employer: {
      name: 'Karajo Inc.',
      ein: '**-*******',
      address: 'New York, NY',
    },
    wages: Math.round(totalWages * 100) / 100,
    federalTaxWithheld: Math.round(totalFederalTax * 100) / 100,
    socialSecurityWages: Math.round(totalWages * 100) / 100,
    socialSecurityTax: Math.round(totalSocialSecurity * 100) / 100,
    medicareWages: Math.round(totalWages * 100) / 100,
    medicareTax: Math.round(totalMedicare * 100) / 100,
  };
};
