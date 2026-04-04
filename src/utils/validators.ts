export interface LeaveRequestData {
  type?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
}

export interface PermissionRequestData {
  date?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface OvertimeRequestData {
  date?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface ExpenseRequestData {
  title?: string;
  category?: string;
  amount?: string | number;
  date?: string;
}

export interface ActivityData {
  title?: string;
  project?: string;
  category?: string;
  description?: string;
}

export interface CorrectionData {
  date?: string;
  reason?: string;
}

export interface ReviewData {
  reviewer?: string;
  rating?: number;
}

export interface GoalData {
  title?: string;
  deadline?: string;
  priority?: string;
}

export interface FeedbackData {
  text?: string;
  type?: string;
}

export interface AppealData {
  type?: string;
  explanation?: string;
}

export interface EmployeeData {
  email?: string;
  phone?: string;
  name?: string;
  department?: string;
  role?: string;
}

export interface LoginData {
  email?: string;
  password?: string;
}

export interface PolicyData {
  title?: string;
  content?: string;
  category?: string;
}

export interface DepartmentData {
  name?: string;
  headId?: string;
  budget?: string | number;
}

export type ValidationErrors = Record<string, string>;
export type ValidationResult = ValidationErrors | null;
export type FieldValidation = string | null;

export const validateEmail = (email?: string): FieldValidation => {
  if (!email) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Invalid email format';
  return null;
};

export const validatePassword = (password?: string): FieldValidation => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validatePhone = (phone?: string): FieldValidation => {
  if (!phone) return 'Phone number is required';
  const re = /^[\+]?[\d\s\-\(\)]{10,}$/;
  if (!re.test(phone)) return 'Invalid phone number';
  return null;
};

export const validateDate = (date?: string, label = 'Date'): FieldValidation => {
  if (!date) return `${label} is required`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return `Invalid ${label.toLowerCase()} format`;
  return null;
};

export const validateDateRange = (startDate?: string, endDate?: string): FieldValidation => {
  if (!startDate) return 'Start date is required';
  if (!endDate) return 'End date is required';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime())) return 'Invalid start date';
  if (isNaN(end.getTime())) return 'Invalid end date';
  if (end < start) return 'End date must be after start date';
  return null;
};

export const validateTime = (time?: string, label = 'Time'): FieldValidation => {
  if (!time) return `${label} is required`;
  const re = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!re.test(time)) return `Invalid ${label.toLowerCase()} format (HH:MM)`;
  return null;
};

export const validateTimeRange = (startTime?: string, endTime?: string): FieldValidation => {
  if (!startTime) return 'Start time is required';
  if (!endTime) return 'End time is required';
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  if (endMin <= startMin) return 'End time must be after start time';
  return null;
};

export const validateRequired = (value?: string, label = 'Field'): FieldValidation => {
  if (!value || (typeof value === 'string' && value.trim() === '')) return `${label} is required`;
  return null;
};

export const validateMinLength = (value?: string, min: number = 0, label = 'Field'): FieldValidation => {
  if (!value) return `${label} is required`;
  if (value.length < min) return `${label} must be at least ${min} characters`;
  return null;
};

export const validateMaxLength = (value?: string, max: number = 0, label = 'Field'): FieldValidation => {
  if (value && value.length > max) return `${label} must be less than ${max} characters`;
  return null;
};

export const validateNumber = (value?: string | number | null, label = 'Field'): FieldValidation => {
  if (value === undefined || value === null || value === '') return `${label} is required`;
  if (isNaN(Number(value))) return `${label} must be a number`;
  return null;
};

export const validateMinNumber = (value?: string | number, min: number = 0, label = 'Field'): FieldValidation => {
  const num = Number(value);
  if (isNaN(num)) return `${label} must be a number`;
  if (num < min) return `${label} must be at least ${min}`;
  return null;
};

export const validateMaxNumber = (value?: string | number, max: number = 0, label = 'Field'): FieldValidation => {
  const num = Number(value);
  if (isNaN(num)) return `${label} must be a number`;
  if (num > max) return `${label} must be less than ${max}`;
  return null;
};

export const validateLeaveRequest = (data: LeaveRequestData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.type) errors.type = 'Leave type is required';
  const dateError = validateDateRange(data.startDate, data.endDate);
  if (dateError) errors.date = dateError;
  if (data.reason && data.reason.length > 500) errors.reason = 'Reason must be less than 500 characters';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validatePermissionRequest = (data: PermissionRequestData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.date) errors.date = 'Date is required';
  const timeError = validateTimeRange(data.startTime, data.endTime);
  if (timeError) errors.time = timeError;
  if (!data.reason || data.reason.trim().length === 0) errors.reason = 'Reason is required';
  if (data.reason && data.reason.length > 300) errors.reason = 'Reason must be less than 300 characters';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateOvertimeRequest = (data: OvertimeRequestData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.date) errors.date = 'Date is required';
  const timeError = validateTimeRange(data.startTime, data.endTime);
  if (timeError) errors.time = timeError;
  if (!data.reason || data.reason.trim().length === 0) errors.reason = 'Reason is required';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateExpenseRequest = (data: ExpenseRequestData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.title || data.title.trim().length === 0) errors.title = 'Title is required';
  if (!data.category) errors.category = 'Category is required';
  const amountError = validateNumber(data.amount, 'Amount');
  if (amountError) errors.amount = amountError;
  else if (Number(data.amount) <= 0) errors.amount = 'Amount must be greater than 0';
  if (!data.date) errors.date = 'Date is required';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateActivity = (data: ActivityData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.title || data.title.trim().length === 0) errors.title = 'Title is required';
  if (!data.project) errors.project = 'Project is required';
  if (!data.category) errors.category = 'Category is required';
  if (data.description && data.description.length > 500) errors.description = 'Description must be less than 500 characters';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateCorrection = (data: CorrectionData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.date) errors.date = 'Date is required';
  if (!data.reason || data.reason.trim().length === 0) errors.reason = 'Reason is required';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateReview = (data: ReviewData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.reviewer) errors.reviewer = 'Reviewer is required';
  if (!data.rating || data.rating < 1 || data.rating > 5) errors.rating = 'Rating must be between 1 and 5';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateGoal = (data: GoalData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.title || data.title.trim().length === 0) errors.title = 'Title is required';
  if (!data.deadline) errors.deadline = 'Deadline is required';
  if (!data.priority) errors.priority = 'Priority is required';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateFeedback = (data: FeedbackData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.text || data.text.trim().length === 0) errors.text = 'Feedback text is required';
  if (data.text && data.text.length > 1000) errors.text = 'Feedback must be less than 1000 characters';
  if (!data.type) errors.type = 'Feedback type is required';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateAppeal = (data: AppealData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.type) errors.type = 'Appeal type is required';
  if (!data.explanation || data.explanation.trim().length === 0) errors.explanation = 'Explanation is required';
  if (data.explanation && data.explanation.length > 1000) errors.explanation = 'Explanation must be less than 1000 characters';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateEmployee = (data: EmployeeData): ValidationResult => {
  const errors: ValidationErrors = {};
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  if (!data.name || data.name.trim().length === 0) errors.name = 'Name is required';
  if (!data.department) errors.department = 'Department is required';
  if (!data.role) errors.role = 'Role is required';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateLogin = (data: LoginData): ValidationResult => {
  const errors: ValidationErrors = {};
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validatePolicy = (data: PolicyData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.title || data.title.trim().length === 0) errors.title = 'Title is required';
  if (!data.content || data.content.trim().length === 0) errors.content = 'Content is required';
  if (!data.category) errors.category = 'Category is required';
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateDepartment = (data: DepartmentData): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.name || data.name.trim().length === 0) errors.name = 'Department name is required';
  if (!data.headId) errors.headId = 'Department head is required';
  if (data.budget && isNaN(Number(data.budget))) errors.budget = 'Budget must be a number';
  return Object.keys(errors).length > 0 ? errors : null;
};
