import { api, ApiResponse } from './api';

export type ApprovalType = 'leave' | 'permission' | 'overtime' | 'expense' | 'correction' | 'policy_change';

export const APPROVAL_TYPES: Record<string, ApprovalType> = {
  LEAVE: 'leave',
  PERMISSION: 'permission',
  OVERTIME: 'overtime',
  EXPENSE: 'expense',
  CORRECTION: 'correction',
  POLICY_CHANGE: 'policy_change',
};

export interface ApprovalRequest {
  id?: string;
  type: ApprovalType;
  requesterId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  escalationLevel: number;
  data: Record<string, unknown>;
  approvalChain?: string[];
  currentApprover?: string | null;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  cancelledAt?: string;
  escalatedAt?: string;
  escalationReason?: string;
  comment?: string;
}

export interface ApprovalChainRule {
  max: number;
  approvers: string[];
}

export type ApprovalChain = string[] | ApprovalChainRule[];

export interface EscalationRule {
  threshold?: number;
  escalateTo: string;
  field?: string;
  alwaysEscalate?: boolean;
}

export interface ApprovalStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  avgApprovalTime: number;
}

export interface BulkApprovalResult {
  id: string;
  status: 'success' | 'error';
  data?: ApiResponse;
  error?: string;
}

export interface EscalationRuleConfig {
  threshold: number;
  escalateTo: string;
  field: string;
  alwaysEscalate?: boolean;
}

export interface CorrectionEscalationRule {
  alwaysEscalate: true;
  escalateTo: string;
}

export const ESCALATION_RULES: Record<string, EscalationRuleConfig | CorrectionEscalationRule> = {
  leave: { threshold: 10, escalateTo: 'hr_manager', field: 'days' },
  expense: { threshold: 1000, escalateTo: 'finance_mgr', field: 'amount' },
  permission: { threshold: 4, escalateTo: 'manager', field: 'duration' },
  overtime: { threshold: 20, escalateTo: 'hr_manager', field: 'monthlyHours' },
  correction: { alwaysEscalate: true, escalateTo: 'hr_manager' },
};

export const APPROVAL_CHAINS: Record<string, ApprovalChain> = {
  leave: ['manager', 'hr_manager'],
  permission: ['manager'],
  overtime: ['manager', 'hr_manager'],
  expense: [
    { max: 500, approvers: ['manager'] },
    { max: 5000, approvers: ['manager', 'finance_mgr'] },
    { max: Infinity, approvers: ['manager', 'finance_mgr', 'ceo'] },
  ],
  correction: ['hr_manager'],
};

export const getApprovalChain = (type: string, value?: number): string[] => {
  const chain = APPROVAL_CHAINS[type];
  if (!chain) return ['manager'];

  if (typeof chain[0] === 'string') return chain as string[];

  const rules = chain as ApprovalChainRule[];
  for (const rule of rules) {
    if (value !== undefined && value <= rule.max) return rule.approvers;
  }
  return rules[rules.length - 1].approvers;
};

export const needsEscalation = (type: string, value: number): boolean => {
  const rule = ESCALATION_RULES[type];
  if (!rule) return false;
  if (rule.alwaysEscalate) return true;
  return value >= (rule as EscalationRuleConfig).threshold;
};

export const getEscalationTarget = (type: string): string | null => {
  const rule = ESCALATION_RULES[type];
  return rule ? rule.escalateTo : null;
};

export const createApprovalRequest = async (
  type: ApprovalType,
  data: Record<string, unknown>,
  requesterId: string
): Promise<ApiResponse> => {
  const approvalData: Partial<ApprovalRequest> = {
    type,
    requesterId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    escalationLevel: 0,
    data,
  };

  const value = type === 'expense' ? (data.amount as number) : type === 'leave' ? (data.days as number) : (data.duration as number) || 0;
  const chain = getApprovalChain(type, value);
  approvalData.approvalChain = chain;
  approvalData.currentApprover = chain[0];

  const response = await api.post('/approvals', approvalData);
  return response;
};

export const approveRequest = async (
  approvalId: string,
  approverId: string,
  comment?: string
): Promise<ApiResponse> => {
  const approval = await api.get<ApprovalRequest>(`/approvals/${approvalId}`);
  const chain = approval.approvalChain || [];
  const currentIndex = chain.indexOf(approverId);

  if (currentIndex === -1) {
    throw new Error('You are not authorized to approve this request');
  }

  const isFinalApprover = currentIndex === chain.length - 1;

  const update: Record<string, unknown> = {
    status: isFinalApprover ? 'approved' : 'pending',
    approvedAt: new Date().toISOString(),
    approvedBy: approverId,
    comment,
    escalationLevel: currentIndex + 1,
    currentApprover: isFinalApprover ? null : chain[currentIndex + 1],
  };

  const response = await api.put(`/approvals/${approvalId}`, update);

  if (isFinalApprover) {
    await processApprovedRequest(approval);
  }

  return response;
};

export const rejectRequest = async (
  approvalId: string,
  approverId: string,
  reason: string
): Promise<ApiResponse> => {
  const update: Record<string, unknown> = {
    status: 'rejected',
    rejectedAt: new Date().toISOString(),
    rejectedBy: approverId,
    rejectionReason: reason,
  };

  return await api.put(`/approvals/${approvalId}`, update);
};

export const processApprovedRequest = async (approval: ApprovalRequest): Promise<void> => {
  switch (approval.type) {
    case APPROVAL_TYPES.LEAVE:
      await processApprovedLeave(approval);
      break;
    case APPROVAL_TYPES.PERMISSION:
      await processApprovedPermission(approval);
      break;
    case APPROVAL_TYPES.OVERTIME:
      await processApprovedOvertime(approval);
      break;
    case APPROVAL_TYPES.EXPENSE:
      await processApprovedExpense(approval);
      break;
    case APPROVAL_TYPES.CORRECTION:
      await processApprovedCorrection(approval);
      break;
  }
};

export const processApprovedLeave = async (approval: ApprovalRequest): Promise<void> => {
  const { data } = approval;
  await api.put(`/leave/requests/${data.requestId}/approve`);
  await api.post('/notifications', {
    userId: approval.requesterId,
    title: 'Leave Request Approved',
    message: `Your ${data.type} leave for ${data.startDate} to ${data.endDate} has been approved.`,
    type: 'success',
  });
};

export const processApprovedPermission = async (approval: ApprovalRequest): Promise<void> => {
  await api.put(`/permission/requests/${approval.data.requestId}/approve`);
  await api.post('/notifications', {
    userId: approval.requesterId,
    title: 'Permission Approved',
    message: `Your permission request for ${approval.data.date} has been approved.`,
    type: 'success',
  });
};

export const processApprovedOvertime = async (approval: ApprovalRequest): Promise<void> => {
  await api.put(`/overtime/requests/${approval.data.requestId}/approve`);
  await api.post('/notifications', {
    userId: approval.requesterId,
    title: 'Overtime Approved',
    message: `Your overtime request for ${approval.data.date} has been approved.`,
    type: 'success',
  });
};

export const processApprovedExpense = async (approval: ApprovalRequest): Promise<void> => {
  await api.put(`/expenses/${approval.data.requestId}/approve`);
  await api.post('/notifications', {
    userId: approval.requesterId,
    title: 'Expense Approved',
    message: `Your expense of $${approval.data.amount} has been approved.`,
    type: 'success',
  });
};

export const processApprovedCorrection = async (approval: ApprovalRequest): Promise<void> => {
  await api.put(`/attendance/corrections/${approval.data.requestId}/approve`);
  await api.post('/notifications', {
    userId: approval.requesterId,
    title: 'Correction Approved',
    message: `Your attendance correction for ${approval.data.date} has been approved.`,
    type: 'success',
  });
};

export const getPendingApprovals = async (
  approverId: string,
  filters: Record<string, string> = {}
): Promise<ApiResponse> => {
  const params = new URLSearchParams({ approverId, status: 'pending', ...filters });
  return api.get(`/approvals?${params}`);
};

export const getApprovalStats = async (approverId: string): Promise<ApprovalStats> => {
  const all = await api.get<ApprovalRequest[]>(`/approvals?approverId=${approverId}`);
  return {
    total: all.length,
    pending: all.filter(a => a.status === 'pending').length,
    approved: all.filter(a => a.status === 'approved').length,
    rejected: all.filter(a => a.status === 'rejected').length,
    avgApprovalTime: calculateAvgApprovalTime(all),
  };
};

export const calculateAvgApprovalTime = (approvals: ApprovalRequest[]): number => {
  const completed = approvals.filter(a => a.status === 'approved' && a.approvedAt);
  if (completed.length === 0) return 0;
  const totalHours = completed.reduce((sum, a) => {
    const created = new Date(a.createdAt);
    const approved = new Date(a.approvedAt!);
    return sum + (approved.getTime() - created.getTime()) / (1000 * 60 * 60);
  }, 0);
  return Math.round(totalHours / completed.length * 10) / 10;
};

export const bulkApprove = async (
  approvalIds: string[],
  approverId: string,
  comment?: string
): Promise<BulkApprovalResult[]> => {
  const results: BulkApprovalResult[] = [];
  for (const id of approvalIds) {
    try {
      const result = await approveRequest(id, approverId, comment);
      results.push({ id, status: 'success', data: result });
    } catch (error) {
      results.push({ id, status: 'error', error: (error as Error).message });
    }
  }
  return results;
};

export const bulkReject = async (
  approvalIds: string[],
  approverId: string,
  reason: string
): Promise<BulkApprovalResult[]> => {
  const results: BulkApprovalResult[] = [];
  for (const id of approvalIds) {
    try {
      const result = await rejectRequest(id, approverId, reason);
      results.push({ id, status: 'success', data: result });
    } catch (error) {
      results.push({ id, status: 'error', error: (error as Error).message });
    }
  }
  return results;
};

export const getApprovalHistory = async (
  requesterId: string,
  filters: Record<string, string> = {}
): Promise<ApiResponse> => {
  const params = new URLSearchParams({ requesterId, ...filters });
  return api.get(`/approvals/history?${params}`);
};

export const cancelApproval = async (
  approvalId: string,
  requesterId: string
): Promise<ApiResponse> => {
  const approval = await api.get<ApprovalRequest>(`/approvals/${approvalId}`);
  if (approval.requesterId !== requesterId) {
    throw new Error('You can only cancel your own requests');
  }
  if (approval.status !== 'pending') {
    throw new Error('Only pending requests can be cancelled');
  }
  return api.put(`/approvals/${approvalId}`, { status: 'cancelled', cancelledAt: new Date().toISOString() });
};

export const escalateApproval = async (
  approvalId: string,
  reason: string
): Promise<ApiResponse> => {
  const approval = await api.get<ApprovalRequest>(`/approvals/${approvalId}`);
  const chain = approval.approvalChain || [];
  const nextLevel = approval.escalationLevel + 1;

  if (nextLevel >= chain.length) {
    throw new Error('No higher approver available');
  }

  return api.put(`/approvals/${approvalId}`, {
    escalationLevel: nextLevel,
    currentApprover: chain[nextLevel],
    escalatedAt: new Date().toISOString(),
    escalationReason: reason,
  });
};
