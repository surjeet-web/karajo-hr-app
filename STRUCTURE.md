# KARAJO HR MANAGEMENT SYSTEM — Complete Structure

> **Current state:** 64 employee-facing screens, 17 components, 59+ API endpoints, complete theme system.
> **Goal:** Expand into a full multi-role HR management system for startups → unicorns → 5000+ employee companies.

---

## Role Hierarchy & Access

```
CEO
├── HR Manager
│   ├── HR Specialist
│   └── Recruiter
├── Finance Manager
│   └── Accountant
├── Department Managers (Engineering, Marketing, Sales, Operations, Design, HR)
│   └── Team Leads
└── Employees (current app — 64 screens, self-service)
```

### Role Permission Matrix

| Feature | Employee | Team Lead | Dept Manager | HR Manager | Finance Manager | CEO |
|---------|----------|-----------|--------------|------------|-----------------|-----|
| View own data | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit requests | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Approve team requests | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View team data | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| View department data | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| View company data | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage employees | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Process payroll | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Manage budgets | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View analytics | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Policy management | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Executive approvals | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Project Structure

```
karajo-hr-app/
├── App.js                          ← Root: AuthProvider + Role-based Router
├── app/                            ← Expo Router API routes (backend)
│   ├── api/
│   │   ├── auth/                   ← Auth endpoints (login, logout, refresh, profile)
│   │   ├── attendance/             ← Attendance endpoints
│   │   ├── leave/                  ← Leave endpoints
│   │   ├── permission/             ← Permission endpoints
│   │   ├── overtime/               ← Overtime endpoints
│   │   ├── activities/             ← Activity/timesheet endpoints
│   │   ├── expenses/               ← Expense endpoints
│   │   ├── payroll/                ← Payroll endpoints
│   │   ├── notifications/          ← Notification endpoints
│   │   ├── penalties/              ← Penalty endpoints
│   │   ├── employees/              ← Employee endpoints
│   │   ├── performance/            ← Performance endpoints
│   │   ├── ai/                     ← AI chat endpoints
│   │   ├── approvals/              ← NEW: Approval workflow endpoints
│   │   ├── departments/            ← NEW: Department management endpoints
│   │   ├── policies/               ← NEW: Policy management endpoints
│   │   ├── reports/                ← NEW: Report generation endpoints
│   │   ├── payroll-runs/           ← NEW: Payroll run endpoints
│   │   └── workforce/              ← NEW: Workforce planning endpoints
│   └── utils/
│       ├── db.ts                   ← Database layer
│       └── auth.ts                 ← Auth middleware
│
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js         ← Role-based navigation router
│   │
│   ├── context/
│   │   └── AuthContext.js          ← Auth + role state management
│   │
│   ├── store/
│   │   └── index.js                ← Global state with all actions
│   │
│   ├── services/
│   │   ├── api.js                  ← HTTP client with auth interceptors
│   │   └── index.js                ← All service modules
│   │
│   ├── utils/
│   │   ├── haptics.js              ← Haptic feedback (web-safe)
│   │   └── animations.js           ← Animation hooks
│   │
│   ├── theme/
│   │   ├── colors.js               ← Color tokens
│   │   ├── typography.js           ← Typography scale
│   │   └── spacing.js              ← Spacing, border radius, shadows
│   │
│   ├── components/                 ← SHARED across all roles
│   │   ├── Button.js               ← 5 variants, 3 sizes, animated
│   │   ├── Card.js                 ← 3 variants, animated
│   │   ├── Badge.js                ← 6 variants, 3 sizes
│   │   ├── Header.js               ← Safe-area aware
│   │   ├── Avatar.js               ← 5 sizes, status indicator
│   │   ├── Input.js                ← Full-featured text input
│   │   ├── ProgressBar.js          ← Step progress
│   │   ├── StatusTimeline.js       ← Vertical timeline
│   │   ├── AnimatedComponents.js   ← AnimatedCard, AnimatedListItem, AnimatedButton, PulsingIcon, AnimatedProgressBar
│   │   ├── CommonStates.js         ← LoadingScreen, LoadingOverlay, EmptyState, ErrorState
│   │   │
│   │   └── management/             ← NEW: Management-specific components
│   │       ├── ApprovalCard.js     ← Reusable approval request card
│   │       ├── ApprovalSheet.js    ← Bottom sheet: approve/reject + comment
│   │       ├── DataTable.js        ← Sortable, filterable, paginated table
│   │       ├── FilterBar.js        ← Search + chips + date range
│   │       ├── StatCard.js         ← Animated stat with trend indicator
│   │       ├── ChartCard.js        ← Chart wrapper with title/subtitle
│   │       ├── ApprovalBadge.js    ← Status badge for approval workflows
│   │       ├── TeamAvatar.js       ← Group avatar (multiple people)
│   │       ├── DepartmentCard.js   ← Department summary card
│   │       ├── ProcessTimeline.js  ← Horizontal timeline (payroll, onboarding)
│   │       ├── EmptyApproval.js    ← Empty state for approval centers
│   │       └── BulkSelectBar.js    ← Bottom bar for bulk operations
│   │
│   ├── data/
│   │   └── mockData.js             ← Realistic placeholder data
│   │
│   └── screens/
│       │
│       ├── Home/                   ← EMPLOYEE (existing)
│       │   ├── HomeScreen.js
│       │   ├── CheckedOutScreen.js
│       │   ├── ShortcutsScreen.js
│       │   └── NotificationsScreen.js
│       │
│       ├── AIChat/                 ← EMPLOYEE (existing)
│       │   ├── AIChatScreen.js
│       │   ├── AIChatExpandedScreen.js
│       │   ├── AIChatConversationScreen.js
│       │   └── DocumentViewScreen.js
│       │
│       ├── Activity/               ← EMPLOYEE (existing)
│       │   ├── ActivityListScreen.js
│       │   ├── ActivityFilterScreen.js
│       │   ├── AddActivityScreen.js
│       │   ├── EditActivityScreen.js
│       │   ├── ActivityDetailScreen.js
│       │   ├── TimesheetWeeklyScreen.js
│       │   ├── TimesheetMonthlyScreen.js
│       │   ├── SubmitConfirmationScreen.js
│       │   ├── TimesheetSubmittedScreen.js
│       │   ├── ApprovalStatusScreen.js
│       │   └── RevisionRequestedScreen.js
│       │
│       ├── Attendance/             ← EMPLOYEE (existing)
│       │   ├── AttendanceLocationScreen.js
│       │   ├── FaceValidationScreen.js
│       │   ├── QRValidationScreen.js
│       │   ├── AttendanceSuccessScreen.js
│       │   ├── AttendanceHistoryScreen.js
│       │   ├── AttendanceFilterScreen.js
│       │   ├── MonthlySummaryScreen.js
│       │   ├── AttendanceDetailScreen.js
│       │   ├── AttendanceCalendarScreen.js
│       │   ├── CorrectionReasonScreen.js
│       │   ├── CorrectionFormScreen.js
│       │   ├── CorrectionSummaryScreen.js
│       │   └── CorrectionSubmittedScreen.js
│       │
│       ├── Leave/                  ← EMPLOYEE (existing)
│       │   ├── LeaveHomeScreen.js
│       │   ├── LeaveHistoryScreen.js
│       │   ├── SelectLeaveTypeScreen.js
│       │   ├── SelectDatesScreen.js
│       │   ├── SelectDelegateScreen.js
│       │   ├── UploadDocumentScreen.js
│       │   ├── LeaveReviewScreen.js
│       │   └── LeaveSuccessScreen.js
│       │
│       ├── Permission/             ← EMPLOYEE (existing)
│       │   ├── PermissionHomeScreen.js
│       │   ├── PermissionRequestScreen.js
│       │   ├── PermissionReviewScreen.js
│       │   └── PermissionSuccessScreen.js
│       │
│       ├── Overtime/               ← EMPLOYEE (existing)
│       │   ├── OvertimeHomeScreen.js
│       │   └── OvertimeSuccessScreen.js
│       │
│       ├── Finance/                ← EMPLOYEE (existing)
│       │   ├── PayslipHomeScreen.js
│       │   ├── ExpenseOverviewScreen.js
│       │   └── ExpenseDetailScreen.js
│       │
│       ├── Profile/                ← EMPLOYEE (existing)
│       │   └── ProfileScreen.js
│       │
│       ├── Penalty/                ← EMPLOYEE (existing)
│       │   ├── PenaltyHomeScreen.js
│       │   ├── PenaltyDetailScreen.js
│       │   ├── PenaltyAppealScreen.js
│       │   ├── PenaltyReviewScreen.js
│       │   └── PenaltySuccessScreen.js
│       │
│       ├── Employee/               ← EMPLOYEE (existing)
│       │   ├── EmployeeDirectoryScreen.js
│       │   ├── EmployeeDetailScreen.js
│       │   ├── OrgChartScreen.js
│       │   └── OnboardingScreen.js
│       │
│       ├── Performance/            ← EMPLOYEE (existing)
│       │   ├── PerformanceDashboardScreen.js
│       │   ├── KPITrackingScreen.js
│       │   ├── PerformanceReviewScreen.js
│       │   ├── GoalSettingScreen.js
│       │   └── Feedback360Screen.js
│       │
│       ├── auth/                   ← NEW: Authentication
│       │   ├── LoginScreen.js
│       │   ├── ForgotPasswordScreen.js
│       │   └── ResetPasswordScreen.js
│       │
│       ├── hr/                     ← NEW: HR Manager (18 screens)
│       │   ├── HRDashboardScreen.js
│       │   ├── HRAnalyticsScreen.js
│       │   ├── HRApprovalCenterScreen.js
│       │   ├── HRApprovalDetailScreen.js
│       │   ├── HREmployeeManagementScreen.js
│       │   ├── HREmployeeProfileScreen.js
│       │   ├── HRBulkActionsScreen.js
│       │   ├── HRLeaveManagementScreen.js
│       │   ├── HRAttendanceManagementScreen.js
│       │   ├── HROnboardingManagementScreen.js
│       │   ├── HROffboardingScreen.js
│       │   ├── HRPolicyManagementScreen.js
│       │   ├── HRComplianceScreen.js
│       │   ├── HRReportsScreen.js
│       │   └── HRReportDetailScreen.js
│       │
│       ├── finance-mgr/            ← NEW: Finance Manager (14 screens)
│       │   ├── FinanceDashboardScreen.js
│       │   ├── PayrollManagementScreen.js
│       │   ├── PayrollRunScreen.js
│       │   ├── PayrollHistoryScreen.js
│       │   ├── PayrollDetailScreen.js
│       │   ├── FinanceExpenseManagementScreen.js
│       │   ├── FinanceExpenseDetailScreen.js
│       │   ├── FinanceBudgetScreen.js
│       │   ├── FinanceTaxScreen.js
│       │   ├── FinanceAuditScreen.js
│       │   ├── FinanceReportsScreen.js
│       │   └── FinanceReportDetailScreen.js
│       │
│       ├── manager/                ← NEW: Department Manager (12 screens)
│       │   ├── ManagerDashboardScreen.js
│       │   ├── MyTeamScreen.js
│       │   ├── TeamAttendanceScreen.js
│       │   ├── TeamPerformanceScreen.js
│       │   ├── ManagerApprovalScreen.js
│       │   ├── ManagerApprovalDetailScreen.js
│       │   ├── TeamPlanningScreen.js
│       │   ├── TeamGoalsScreen.js
│       │   └── TeamReportsScreen.js
│       │
│       └── ceo/                    ← NEW: CEO (10 screens)
│           ├── CEODashboardScreen.js
│           ├── CEOAnalyticsScreen.js
│           ├── CEOApprovalsScreen.js
│           ├── DepartmentOverviewScreen.js
│           ├── DepartmentDetailScreen.js
│           ├── CompanyGoalsScreen.js
│           ├── WorkforcePlanningScreen.js
│           └── CEOReportsScreen.js
```

---

## Screen Inventory

### Employee App (64 screens — existing)

| Module | Screens | Purpose |
|--------|---------|---------|
| Home | 4 | Dashboard, check-in/out, shortcuts, notifications |
| AI Chat | 4 | KarajoAI assistant, conversation, document viewer |
| Activity | 10 | Timesheet, activity logs, submission, approval tracking |
| Attendance | 13 | GPS/face/QR check-in, history, calendar, corrections |
| Leave | 8 | Balances, multi-step request, history |
| Permission | 4 | Short absence requests |
| Overtime | 2 | Overtime requests |
| Finance | 3 | Payslips, expense management |
| Profile | 1 | Employee profile & settings |
| Penalty | 5 | Disciplinary actions & appeals |
| Employee | 4 | Directory, detail, org chart, onboarding |
| Performance | 5 | KPIs, goals, reviews, 360 feedback |

### HR Manager App (18 screens — new)

| Screen | Purpose | Key Features |
|--------|---------|-------------|
| HRDashboard | Overview of all HR operations | Total employees, pending approvals, open positions, onboarding progress, department health, alerts |
| HRAnalytics | Company-wide HR analytics | Headcount trends, turnover rate, attendance patterns, leave utilization, diversity metrics, charts |
| HRApprovalCenter | Unified approval inbox | ALL pending requests (leave/permission/overtime/correction/expense), filter by type/department/status, bulk actions |
| HRApprovalDetail | Single request detail | Employee profile, request history, approve/reject with comment, escalation |
| HREmployeeManagement | Employee CRUD | Add, edit, deactivate, transfer employees, search, filter by department/status |
| HREmployeeProfile | HR view of employee | Full profile: salary, documents, performance history, attendance, all requests, notes |
| HRBulkActions | Bulk operations | Mass leave approval, department transfers, salary adjustments, status changes |
| HRLeaveManagement | Company leave management | Leave calendar, policy config, balance adjustments, department comparison |
| HRAttendanceManagement | Company attendance | Attendance overview, shift management, late/absent tracking, correction approvals |
| HROnboardingManagement | Onboarding for all hires | Manage onboarding progress, assign buddies, track checklist completion |
| HROffboarding | Exit management | Exit checklist, final settlement, asset recovery, knowledge transfer, exit interview |
| HRPolicyManagement | Policy management | Create/edit policies, push notifications, track acknowledgments, version history |
| HRCompliance | Compliance tracking | Audit logs, document expiry alerts, regulatory compliance, reports |
| HRReports | Report generator | Attendance, leave, headcount, turnover, diversity reports, export PDF/CSV |
| HRReportDetail | Report viewer | View/export individual report, filters, date range, comparison |

### Finance Manager App (14 screens — new)

| Screen | Purpose | Key Features |
|--------|---------|-------------|
| FinanceDashboard | Finance overview | Payroll summary, pending expenses, budget utilization, tax deadlines, expense trends |
| PayrollManagement | Monthly payroll processing | Review, adjust, approve, generate payslips, employee count, total amount |
| PayrollRun | Step-by-step payroll run | Verify attendance → calculate OT → deductions → review → approve → distribute |
| PayrollHistory | Past payroll runs | Status, total amount, employee count, processed/approved dates |
| PayrollDetail | Individual payroll breakdown | Employee payslip detail, earnings, deductions, net pay, tax breakdown |
| FinanceExpenseManagement | All company expenses | Filter by department/status/amount, approve/reject, budget tracking |
| FinanceExpenseDetail | Single expense detail | Receipt view, approve/reject with comment, budget impact |
| FinanceBudget | Department budgets | Budget allocation, spending vs budget, alerts, department comparison |
| FinanceTax | Tax management | Tax document management, filing deadlines, compliance tracking |
| FinanceAudit | Financial audit trail | All financial transactions, filters, export, anomaly detection |
| FinanceReports | Finance report generator | Payroll, expense, budget, tax reports, export |
| FinanceReportDetail | Finance report viewer | View/export individual finance report |

### Department Manager App (12 screens — new)

| Screen | Purpose | Key Features |
|--------|---------|-------------|
| ManagerDashboard | Team overview | Attendance today, pending approvals, team performance, upcoming leaves, workload |
| MyTeam | Direct reports list | Status (present/absent/leave), quick actions, performance snapshot |
| TeamAttendance | Team attendance calendar | Patterns, alerts, late/absent tracking, comparison |
| TeamPerformance | Team KPIs & goals | Team KPIs, goals, review deadlines, performance trends |
| ManagerApproval | Team request approvals | Pending requests from direct reports only, filter by type |
| ManagerApprovalDetail | Request detail | Request info, team context, approve/reject with comment |
| TeamPlanning | Team planning | Leave calendar, workload planning, coverage gaps, scheduling |
| TeamGoals | Team goals | Set/track team goals, align with company objectives, progress |
| TeamReports | Team reports | Attendance summary, leave utilization, performance summary |

### CEO App (10 screens — new)

| Screen | Purpose | Key Features |
|--------|---------|-------------|
| CEODashboard | Company-wide overview | Headcount, revenue/employee, attendance rate, critical approvals, key metrics |
| CEOAnalytics | Interactive analytics | Headcount growth, department costs, attrition trends, productivity, diversity |
| CEOApprovals | Executive approvals | Policy changes, large expenses, executive leaves, budget approvals |
| DepartmentOverview | All departments | Side-by-side: headcount, budget, performance, open positions |
| DepartmentDetail | Department deep dive | Full department view: employees, budget, performance, attendance, leave |
| CompanyGoals | Company OKRs | Company-wide goals, progress tracking, department alignment |
| WorkforcePlanning | Strategic planning | Hiring pipeline, succession planning, skills gap analysis |
| CEOReports | Executive reports | Board reports, investor summaries, compliance overview |

---

## New Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| **ApprovalCard** | `management/ApprovalCard.js` | `request, onPress, delay, haptic` | Card showing approval request: avatar, name, type, date, amount/days, status badge |
| **ApprovalSheet** | `management/ApprovalSheet.js` | `visible, onClose, onApprove, onReject, request` | Bottom sheet with approve/reject buttons, comment input, request summary |
| **DataTable** | `management/DataTable.js` | `columns, data, onRowPress, sortable, searchable` | Sortable, filterable, paginated data table for management views |
| **FilterBar** | `management/FilterBar.js` | `chips, onChipPress, searchValue, onSearch, dateRange, onDateChange` | Search + filter chips + date range picker bar |
| **StatCard** | `management/StatCard.js` | `icon, label, value, trend, trendValue, color, delay` | Animated stat card with trend indicator (up/down arrow + percentage) |
| **ChartCard** | `management/ChartCard.js` | `title, subtitle, chartType, data, color` | Card wrapper for charts (bar, line, pie) with title and subtitle |
| **ApprovalBadge** | `management/ApprovalBadge.js` | `status, size` | Status badge for approval workflows (pending/approved/rejected/escalated) |
| **TeamAvatar** | `management/TeamAvatar.js` | `avatars, size, max` | Group avatar showing multiple people with overflow count |
| **DepartmentCard** | `management/DepartmentCard.js` | `department, onPress, delay` | Department summary: name, headcount, budget, performance score, head avatar |
| **ProcessTimeline** | `management/ProcessTimeline.js` | `steps, currentStep, direction` | Horizontal timeline for processes (payroll run, onboarding, approval chain) |
| **EmptyApproval** | `management/EmptyApproval.js` | `type, actionLabel, onAction` | Empty state for approval centers with icon and CTA |
| **BulkSelectBar** | `management/BulkSelectBar.js` | `count, onApproveAll, onRejectAll, onCancel` | Bottom bar shown when items selected for bulk operations |

---

## Navigation Architecture

### Role Detection Flow

```
App Launch
    ↓
AuthContext checks token
    ↓
Fetches user profile (includes role)
    ↓
Role-based Router selects correct navigator:
    ├── role === 'employee'     → EmployeeTabs (5 tabs, 64 screens)
    ├── role === 'team_lead'    → ManagerTabs (5 tabs, 12 screens)
    ├── role === 'manager'      → ManagerTabs (5 tabs, 12 screens)
    ├── role === 'hr_manager'   → HRTabs (6 tabs, 18 screens)
    ├── role === 'hr_specialist'→ HRTabs (6 tabs, 18 screens)
    ├── role === 'finance_mgr'  → FinanceTabs (5 tabs, 14 screens)
    ├── role === 'accountant'   → FinanceTabs (5 tabs, 14 screens)
    ├── role === 'ceo'          → CEOTabs (5 tabs, 10 screens)
    └── role === 'recruiter'    → HRTabs (6 tabs, 18 screens)
```

### Tab Structure by Role

**Employee Tabs (5):** Home | Activity | [Center] | Finance | Notifications
**HR Manager Tabs (6):** Dashboard | Approvals | Employees | Attendance | Reports | Settings
**Finance Manager Tabs (5):** Dashboard | Payroll | Expenses | Reports | Settings
**Department Manager Tabs (5):** Dashboard | My Team | Approvals | Planning | Reports
**CEO Tabs (5):** Dashboard | Analytics | Departments | Goals | Reports

---

## Approval Workflow Engine

### Request Routing

```
Employee submits request
    ↓
System determines request type & amount
    ↓
Route to immediate manager (based on org hierarchy)
    ↓
Manager approves → check escalation rules
    ├── Leave > 10 days       → escalate to HR Manager
    ├── Expense > $1,000      → escalate to Finance Manager
    ├── Expense > $10,000     → escalate to CEO
    ├── Permission > 4 hours  → escalate to Department Manager
    ├── Overtime > 20 hrs/mo  → escalate to HR Manager
    ├── Correction request    → always to HR Manager
    └── Otherwise             → approved, notify employee
    ↓
If rejected → notify employee with reason
If approved → update balances, notify employee, log audit
```

### Approval States

```
pending → approved → completed
pending → rejected → closed
pending → escalated → pending (next level)
pending → withdrawn → closed (employee cancels)
```

---

## Data Model Additions

```javascript
// Role & Permissions
roles: {
  id, name, level, permissions: [string], department, reportsTo
}

// Approval Workflow
approvals: {
  id, type, requesterId, approverId, status, createdAt,
  approvedAt, approvedBy, comment, escalationLevel,
  data: { /* request-specific data */ }
}

// Department
departments: {
  id, name, headId, budget, headcount, openPositions,
  location, costCenter, parentDepartment
}

// Payroll Run
payrollRuns: {
  id, month, year, status, totalAmount, employeeCount,
  processedBy, approvedBy, processedAt, approvedAt
}

// Policy
policies: {
  id, title, category, content, effectiveDate,
  createdBy, lastUpdated, version, acknowledgments: [userId]
}

// Report
reports: {
  id, type, title, generatedBy, generatedAt,
  filters, data, format, status
}
```

---

## Scalability Design

| Company Size | Configuration |
|-------------|--------------|
| **Startup (<50)** | All managers see everything, simple 1-level approval, single department, no budget tracking |
| **Mid-size (50-500)** | Department-based filtering, 2-level approval chains, budget tracking per department, basic analytics |
| **Large (500-5000)** | Multi-level approvals (3+), regional/office filtering, delegation rules, bulk operations, advanced analytics, custom report builder, SSO integration, audit logging, compliance workflows |

---

## API Endpoints (New)

### Approval Workflow
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/approvals` | Get approvals (filter by type/status/department) |
| GET | `/approvals/:id` | Get approval detail |
| POST | `/approvals/:id/approve` | Approve with comment |
| POST | `/approvals/:id/reject` | Reject with reason |
| POST | `/approvals/:id/escalate` | Escalate to next level |
| POST | `/approvals/bulk` | Bulk approve/reject |

### Department Management
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/departments` | List all departments |
| GET | `/departments/:id` | Department detail |
| POST | `/departments` | Create department |
| PUT | `/departments/:id` | Update department |
| GET | `/departments/:id/stats` | Department statistics |

### Payroll Runs
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/payroll-runs` | List payroll runs |
| POST | `/payroll-runs` | Create new payroll run |
| GET | `/payroll-runs/:id` | Payroll run detail |
| POST | `/payroll-runs/:id/process` | Process payroll run |
| POST | `/payroll-runs/:id/approve` | Approve payroll run |

### Reports
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/reports` | List reports (filter by type/role) |
| POST | `/reports` | Generate new report |
| GET | `/reports/:id` | Report detail |
| GET | `/reports/:id/export` | Export report (PDF/CSV) |

### Policies
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/policies` | List policies |
| POST | `/policies` | Create policy |
| PUT | `/policies/:id` | Update policy |
| POST | `/policies/:id/publish` | Publish policy |
| POST | `/policies/:id/acknowledge` | Employee acknowledges policy |

### Workforce
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/workforce/planning` | Workforce planning data |
| GET | `/workforce/succession` | Succession planning data |
| GET | `/workforce/skills-gap` | Skills gap analysis |

---

## Implementation Phases

### Phase 1 — Core Management (Weeks 1-2)
- [ ] Role-based navigation & auth guard
- [ ] Login screen with role selection
- [ ] HR Dashboard + Approval Center (6 screens)
- [ ] Department Manager Dashboard + Team Management (6 screens)
- [ ] Shared management components (12 components)
- [ ] Approval workflow API endpoints

### Phase 2 — Finance & Advanced HR (Weeks 3-4)
- [ ] Finance Dashboard + Payroll Management (8 screens)
- [ ] Expense Management for Finance (4 screens)
- [ ] HR Employee Management + Onboarding (6 screens)
- [ ] Payroll run API endpoints
- [ ] Department management API endpoints

### Phase 3 — CEO & Analytics (Weeks 5-6)
- [ ] CEO Dashboard + Analytics (6 screens)
- [ ] Reports module for all roles (8 screens)
- [ ] Policy & Compliance screens (4 screens)
- [ ] Report generation API endpoints
- [ ] Policy management API endpoints

### Phase 4 — Polish & Integration (Weeks 7-8)
- [ ] Approval workflow engine (backend logic)
- [ ] Bulk operations
- [ ] Advanced filtering & search
- [ ] Animations, haptics, accessibility
- [ ] Workforce planning screens
- [ ] Final testing & optimization

---

## Screen Count Summary

| Category | Count |
|----------|-------|
| Existing employee screens | 64 |
| New Auth screens | 1 |
| New HR Manager screens | 16 |
| New Finance Manager screens | 11 |
| New Department Manager screens | 9 |
| New CEO screens | 7 |
| **Total screens** | **108** |
| Existing components | 17 |
| New management components | 8 |
| **Total components** | **25** |

---

## File Count Summary

| Category | Files |
|----------|-------|
| Screen files | 108 |
| Component files | 25 |
| API route files | ~75 |
| Utility files | 4 |
| Theme files | 3 |
| Navigation files | 1 |
| Context files | 1 |
| Store files | 1 |
| Service files | 2 |
| Data files | 1 |
| **Total files** | **~220** |
