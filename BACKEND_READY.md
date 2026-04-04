# KARAJO HR — Backend-Ready System with React Query

## Overview

Complete backend-ready architecture with React Query, paginated API routes, filtering, sorting, optimistic updates, and cache invalidation for all 5 roles.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Native App                      │
├─────────────────────────────────────────────────────────┤
│  QueryProvider (@tanstack/react-query)                   │
│  ├── QueryClient (staleTime: 5min, gcTime: 30min)       │
│  ├── useQuery (auto-caching, refetch)                    │
│  ├── useMutation (optimistic updates)                    │
│  └── useInfiniteQuery (pagination)                       │
├─────────────────────────────────────────────────────────┤
│  API Hooks Layer (src/query/hooks.js)                    │
│  ├── useEmployees(page, limit, search, dept, status)     │
│  ├── useLeaveRequests(page, limit, status, type)         │
│  ├── useApprovals(page, limit, type, status, dept)       │
│  ├── useExpenses(page, limit, status, category, amount)  │
│  ├── usePayrollRuns(page, limit, status, month, year)    │
│  ├── useNotifications(page, limit, type, unreadOnly)     │
│  └── ... 30+ hooks for all entities                      │
├─────────────────────────────────────────────────────────┤
│  API Routes (app/api/*.ts)                               │
│  ├── Pagination (page, limit, totalPages, hasNext)       │
│  ├── Filtering (status, type, department, date range)    │
│  ├── Sorting (sortBy, sortOrder)                         │
│  ├── Search (name, role, department, email)              │
│  └── Auth (JWT token validation)                         │
└─────────────────────────────────────────────────────────┘
```

---

## React Query Setup

### QueryClient Configuration
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      gcTime: 1000 * 60 * 30,        // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### Hook Pattern
```javascript
// Query with pagination
export const useEmployees = (params = {}) => {
  const { page = 1, limit = 20, search, department, status } = params;
  return useQuery({
    queryKey: ['employees', { page, limit, search, department, status }],
    queryFn: () => api.get(`/employees?page=${page}&limit=${limit}&search=${search}...`),
    staleTime: 1000 * 60 * 2,
  });
};

// Mutation with cache invalidation
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/employees', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
```

---

## API Route Pattern (Paginated)

### Request Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `search` | string | - | Search text |
| `status` | string | - | Filter by status |
| `department` | string | - | Filter by department |
| `sortBy` | string | id/name | Sort field |
| `sortOrder` | string | asc/desc | Sort direction |
| `startDate` | string | - | Date range start |
| `endDate` | string | - | Date range end |

### Response Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "stats": {
    "pending": 12,
    "approved": 45,
    "rejected": 3
  }
}
```

---

## Available API Hooks (30+)

### Employee Hooks
- `useEmployees(params)` — Paginated employee list with search/filter/sort
- `useEmployee(id)` — Single employee detail
- `useCreateEmployee()` — Create employee (invalidates employee list)
- `useUpdateEmployee()` — Update employee (invalidates detail + list)
- `useDeactivateEmployee()` — Deactivate employee

### Attendance Hooks
- `useAttendance(params)` — Paginated attendance with date range filter
- `useAttendanceToday()` — Today's attendance (auto-refresh every 60s)
- `useCheckIn()` — Check in (invalidates attendance)
- `useCheckOut()` — Check out (invalidates attendance)
- `useAttendanceCalendar(year, month)` — Calendar view
- `useAttendanceSummary(year, month)` — Monthly summary

### Leave Hooks
- `useLeaveRequests(params)` — Paginated leave with status/type filter
- `useLeaveBalances()` — Leave balances (5min cache)
- `useCreateLeave()` — Create leave (invalidates leave + balances)
- `useApproveLeave()` — Approve leave (invalidates leave + balances)
- `useRejectLeave()` — Reject leave

### Permission/Overtime Hooks
- `usePermissions(params)` — Paginated permissions
- `useCreatePermission()` — Create permission
- `useApprovePermission()` — Approve permission
- `useOvertime(params)` — Paginated overtime
- `useCreateOvertime()` — Create overtime

### Expense Hooks
- `useExpenses(params)` — Paginated expenses with amount range filter
- `useCreateExpense()` — Create expense
- `useApproveExpense()` — Approve expense

### Payroll Hooks
- `usePayrollRuns(params)` — Paginated payroll runs
- `useCreatePayrollRun()` — Create payroll run
- `useApprovePayroll()` — Approve payroll

### Approval Hooks
- `useApprovals(params)` — Paginated approvals with type/status filter
- `useApprovalStats(approverId)` — Approval statistics
- `useApproveRequest()` — Approve request (invalidates approvals + stats)
- `useRejectRequest()` — Reject request
- `useBulkApprove()` — Bulk approve multiple requests
- `useBulkReject()` — Bulk reject multiple requests

### Notification Hooks
- `useNotifications(params)` — Paginated notifications with unread filter
- `useMarkNotificationRead()` — Mark single as read
- `useMarkAllNotificationsRead()` — Mark all as read

### Report/Performance Hooks
- `useReport(type, params)` — Generate report
- `useGenerateReport()` — Trigger report generation
- `usePerformance(params)` — Performance data
- `useGoals(params)` — Paginated goals
- `useUpdateGoal()` — Update goal progress

---

## Usage Examples

### Paginated Employee List
```javascript
import { useEmployees } from '../query/hooks';

const EmployeeList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  const { data, isLoading, isFetching } = useEmployees({
    page,
    limit: 20,
    search,
    department,
    status: 'active',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <FlatList
      data={data.data}
      renderItem={({ item }) => <EmployeeCard employee={item} />}
      keyExtractor={item => item.id.toString()}
      onEndReached={() => data.pagination.hasNext && setPage(p => p + 1)}
      ListFooterComponent={isFetching ? <LoadingSpinner /> : null}
    />
  );
};
```

### Create Employee with Optimistic Update
```javascript
import { useCreateEmployee } from '../query/hooks';

const AddEmployeeForm = () => {
  const queryClient = useQueryClient();
  const createEmployee = useCreateEmployee();

  const handleSubmit = async (formData) => {
    try {
      // Optimistic update
      queryClient.setQueryData(['employees'], (old) => ({
        ...old,
        data: [...old.data, { ...formData, id: Date.now(), status: 'onboarding' }],
        pagination: { ...old.pagination, total: old.pagination.total + 1 },
      }));

      await createEmployee.mutateAsync(formData);
    } catch (error) {
      // Rollback on error
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  };

  return <EmployeeForm onSubmit={handleSubmit} />;
};
```

### Approval Center with Bulk Actions
```javascript
import { useApprovals, useBulkApprove, useBulkReject } from '../query/hooks';

const ApprovalCenter = () => {
  const { data, isLoading } = useApprovals({
    page: 1,
    limit: 50,
    status: 'pending',
    department: 'Engineering',
  });

  const bulkApprove = useBulkApprove();
  const bulkReject = useBulkReject();

  const handleBulkApprove = async (selectedIds) => {
    await bulkApprove.mutateAsync({
      ids: selectedIds,
      comment: 'Approved by manager',
    });
  };

  return (
    <ApprovalList
      approvals={data?.data || []}
      stats={data?.stats}
      pagination={data?.pagination}
      onBulkApprove={handleBulkApprove}
      onBulkReject={(ids) => bulkReject.mutateAsync({ ids, reason: 'Rejected' })}
    />
  );
};
```

---

## Performance Optimizations

### Caching Strategy
| Data Type | Stale Time | GC Time | Refetch Interval |
|-----------|-----------|---------|------------------|
| Employee list | 2 min | 30 min | - |
| Today's attendance | 30 sec | 5 min | 60 sec |
| Leave balances | 5 min | 30 min | - |
| Approvals | 30 sec | 5 min | 60 sec |
| Notifications | 30 sec | 5 min | 60 sec |
| Reports | 5 min | 30 min | - |
| Payroll runs | 5 min | 30 min | - |

### Pagination
- Server-side pagination with `page` and `limit`
- `hasNext` / `hasPrev` flags for infinite scroll
- Total count for progress indicators

### Filtering & Sorting
- All list endpoints support filtering by status, type, department, date range
- Amount range filtering for expenses (`minAmount`, `maxAmount`)
- Sorting by any field with ascending/descending order
- Full-text search for employees (name, role, department, email)

### Cache Invalidation
- Mutations automatically invalidate related queries
- `useCreateEmployee` → invalidates `['employees']`
- `useApproveLeave` → invalidates `['leave']` and `['leave', 'balances']`
- `useBulkApprove` → invalidates `['approvals']`

---

## Files Created/Updated

| File | Purpose |
|------|---------|
| `src/query/QueryProvider.js` | React Query provider with optimized config |
| `src/query/hooks.js` | 30+ API hooks for all entities |
| `App.js` | Updated with QueryProvider wrapper |
| `app/api/employees+api.ts` | Paginated employee API with search/filter/sort |
| `app/api/leave/requests+api.ts` | Paginated leave API with balance validation |
| `app/api/permission/requests+api.ts` | Paginated permission API with hour tracking |
| `app/api/overtime/requests+api.ts` | Paginated overtime API |
| `app/api/attendance+api.ts` | Paginated attendance API with date range |
| `app/api/expenses+api.ts` | Paginated expense API with amount range |
| `app/api/notifications+api.ts` | Paginated notification API with unread filter |
| `app/api/approvals+api.ts` | Paginated approval API with stats |
