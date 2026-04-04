# KARAJO HR — RBAC (Role-Based Access Control) System

## Overview

Complete role hierarchy with 8 roles, 100+ permissions, screen-level access control, approval limits, department-based data filtering, and feature flags.

---

## Role Hierarchy (8 Roles)

```
CEO (Level 6)
├── HR Manager (Level 5)
│   ├── HR Specialist (Level 4)
│   │   └── Team Lead (Level 3)
│   │       └── Employee (Level 1)
│   └── Department Manager (Level 4)
│       └── Team Lead (Level 3)
│           └── Employee (Level 1)
└── Finance Manager (Level 5)
    └── Accountant (Level 4)
        └── Employee (Level 1)
```

### Role Details

| Role | Level | Inherits From | Screen Count |
|------|-------|--------------|-------------|
| **CEO** | 6 | All roles below | 108 screens |
| **HR Manager** | 5 | HR Specialist, Team Lead, Employee | 16 HR screens + all employee screens |
| **HR Specialist** | 4 | Team Lead, Employee | 16 HR screens + all employee screens |
| **Finance Manager** | 5 | Accountant, Employee | 12 Finance screens + all employee screens |
| **Accountant** | 4 | Employee | 12 Finance screens + all employee screens |
| **Department Manager** | 4 | Team Lead, Employee | 9 Manager screens + all employee screens |
| **Team Lead** | 3 | Employee | 9 Manager screens + all employee screens |
| **Employee** | 1 | None | 64 employee screens |

---

## Permission Categories (100+ Permissions)

### Employee Self-Service (27 permissions)
- `employee:profile:read`, `employee:profile:update`
- `employee:attendance:read`, `employee:attendance:checkin`, `employee:attendance:correction`
- `employee:leave:read`, `employee:leave:request`, `employee:leave:cancel`
- `employee:permission:read`, `employee:permission:request`
- `employee:overtime:read`, `employee:overtime:request`
- `employee:activity:read`, `employee:activity:create`, `employee:activity:update`
- `employee:timesheet:read`, `employee:timesheet:submit`
- `employee:payslip:read`, `employee:expense:read`, `employee:expense:request`
- `employee:notification:read`, `employee:penalty:read`, `employee:penalty:appeal`
- `employee:directory:read`, `employee:performance:read`, `employee:performance:review`
- `employee:ai:use`

### Team Lead (13 permissions)
- `team:attendance:read`, `team:leave:read`, `team:leave:approve`
- `team:permission:read`, `team:permission:approve`
- `team:overtime:read`, `team:overtime:approve`
- `team:expense:read`, `team:expense:approve`
- `team:performance:read`, `team:performance:review`
- `team:goals:manage`, `team:planning:read`

### HR Manager (25 permissions)
- `hr:employee:read`, `hr:employee:create`, `hr:employee:update`, `hr:employee:deactivate`
- `hr:attendance:read`, `hr:attendance:manage`, `hr:attendance:correction:approve`
- `hr:leave:read`, `hr:leave:approve`, `hr:leave:policy:manage`
- `hr:permission:read`, `hr:permission:approve`
- `hr:overtime:read`, `hr:overtime:approve`
- `hr:onboarding:manage`, `hr:offboarding:manage`
- `hr:policy:manage`, `hr:compliance:read`, `hr:compliance:manage`
- `hr:reports:read`, `hr:reports:export`, `hr:bulk:actions`
- `hr:department:read`, `hr:department:manage`
- `hr:analytics:read`, `hr:role:manage`

### Finance Manager (14 permissions)
- `finance:payroll:read`, `finance:payroll:process`, `finance:payroll:approve`
- `finance:expense:read`, `finance:expense:approve`, `finance:expense:manage`
- `finance:budget:read`, `finance:budget:manage`
- `finance:tax:read`, `finance:tax:manage`
- `finance:audit:read`
- `finance:reports:read`, `finance:reports:export`
- `finance:employee:financial:read`

### CEO (14 permissions)
- `ceo:dashboard:read`, `ceo:analytics:read`
- `ceo:department:read`, `ceo:department:manage`
- `ceo:goals:read`, `ceo:goals:manage`
- `ceo:workforce:read`, `ceo:workforce:manage`
- `ceo:reports:read`, `ceo:reports:export`
- `ceo:approvals:high`, `ceo:policy:approve`
- `ceo:all:read`, `ceo:all:manage`

---

## Approval Limits by Role

| Role | Leave (max days) | Permission (max hrs) | Overtime (max hrs/mo) | Expense (max $) | Payroll (max $) |
|------|-----------------|---------------------|----------------------|----------------|----------------|
| **Team Lead** | 3 days | 2 hrs | 10 hrs | $500 | - |
| **Manager** | 10 days | 8 hrs | 20 hrs | $2,000 | - |
| **HR Manager** | 30 days | 40 hrs | 50 hrs | $5,000 | - |
| **Finance Manager** | - | - | - | $10,000 | $100,000 |
| **CEO** | ∞ | ∞ | ∞ | ∞ | ∞ |

**Escalation:** When a request exceeds a role's limit, it automatically escalates to the next level.

---

## Department Access Control

| Role | Access Scope |
|------|-------------|
| **Employee** | Own department only |
| **Team Lead** | Own department only |
| **Manager** | Own department only |
| **HR Specialist** | All departments |
| **HR Manager** | All departments |
| **Accountant** | All departments |
| **Finance Manager** | All departments |
| **CEO** | All departments |

---

## Feature Flags by Role

| Feature | Employee | Team Lead | Manager | HR Specialist | HR Manager | Accountant | Finance Mgr | CEO |
|---------|----------|-----------|---------|--------------|------------|-----------|------------|-----|
| Check In/Out | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Request Leave | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Approve Team Requests | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Manage Employees | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Process Payroll | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Budgets | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View Analytics | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Manage Policies | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Bulk Actions | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Manage Roles | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |

---

## Screen-Level Access Control

Every screen is mapped to required permissions. The navigation automatically filters screens based on the user's role.

### Example Screen Mappings
```javascript
SCREEN_PERMISSIONS = {
  // Employee screens
  'HomeMain': ['employee:attendance:read'],
  'LeaveHome': ['employee:leave:read'],
  'SelectLeaveType': ['employee:leave:request'],
  
  // HR Manager screens
  'HRDashboard': ['hr:employee:read'],
  'HRApprovalCenter': ['hr:leave:approve'],
  'HREmployeeManagement': ['hr:employee:read'],
  'HRBulkActions': ['hr:bulk:actions'],
  
  // Finance Manager screens
  'FinanceDashboard': ['finance:payroll:read'],
  'PayrollManagement': ['finance:payroll:read'],
  'FinanceBudget': ['finance:budget:read'],
  
  // CEO screens
  'CEODashboard': ['ceo:dashboard:read'],
  'CEOAnalytics': ['ceo:analytics:read'],
  'WorkforcePlanning': ['ceo:workforce:read'],
}
```

---

## Usage Examples

### Check Permission
```javascript
import { useAuth } from '../context/AuthContext';

const { hasPermission, hasFeature, canApprove, canAccessScreen } = useAuth();

// Check single permission
if (hasPermission('hr:employee:create')) {
  // Show add employee button
}

// Check feature flag
if (hasFeature('canManagePolicies')) {
  // Show policy management
}

// Check approval limit
if (canApprove('leave', 5)) {
  // Can approve 5 days of leave
}

// Check screen access
if (canAccessScreen('HRDashboard')) {
  // Navigate to HR Dashboard
}
```

### PermissionGuard Component
```javascript
import { PermissionGuard, PermissionDenied } from '../components/PermissionGuard';

// Guard with permission
<PermissionGuard role={user.role} permission="hr:employee:create">
  <Button title="Add Employee" />
</PermissionGuard>

// Guard with screen
<PermissionGuard role={user.role} screen="HRDashboard">
  <HRDashboardScreen />
</PermissionGuard>

// Guard with feature flag
<PermissionGuard role={user.role} feature="canManagePolicies" fallback={<PermissionDenied />}>
  <PolicyManagement />
</PermissionGuard>
```

### Department-Based Data Filtering
```javascript
const { filterByDepartment, userDepartment } = useAuth();

// Filter employee list based on department access
const visibleEmployees = filterByDepartment(allEmployees);
```

---

## Files Created

| File | Purpose |
|------|---------|
| `src/utils/rbac.js` | Role hierarchy, permissions, approval limits, feature flags |
| `src/utils/permissions.js` | Permission checking utilities (15+ functions) |
| `src/components/PermissionGuard.js` | React components for permission-based rendering |
| `src/context/AuthContext.js` | Updated with full RBAC integration |

---

## Security Notes

- Permissions are checked on both client (UI) and server (API)
- Role hierarchy ensures higher roles inherit all lower role permissions
- Approval limits prevent unauthorized high-value approvals
- Department access controls data visibility
- All permission checks are centralized in `src/utils/permissions.js`
