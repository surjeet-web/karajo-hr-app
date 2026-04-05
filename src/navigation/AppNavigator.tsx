import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components/CommonStates';
import type { RoleId } from '../utils/rbac';
import { AnimatedTabButton } from '../components/AnimatedTabButton';

// Employee Screens
import { HomeScreen } from '../screens/Home/HomeScreen';
import { CheckedOutScreen } from '../screens/Home/CheckedOutScreen';
import { ShortcutsScreen } from '../screens/Home/ShortcutsScreen';
import { NotificationsScreen } from '../screens/Home/NotificationsScreen';
import { AIChatScreen } from '../screens/AIChat/AIChatScreen';
import { AIChatExpandedScreen } from '../screens/AIChat/AIChatExpandedScreen';
import { AIChatConversationScreen } from '../screens/AIChat/AIChatConversationScreen';
import { DocumentViewScreen } from '../screens/AIChat/DocumentViewScreen';
import { ActivityListScreen } from '../screens/Activity/ActivityListScreen';
import { ActivityFilterScreen } from '../screens/Activity/ActivityFilterScreen';
import { AddActivityScreen } from '../screens/Activity/AddActivityScreen';
import { EditActivityScreen } from '../screens/Activity/EditActivityScreen';
import { ActivityDetailScreen } from '../screens/Activity/ActivityDetailScreen';
import { TimesheetWeeklyScreen } from '../screens/Activity/TimesheetWeeklyScreen';
import { TimesheetMonthlyScreen } from '../screens/Activity/TimesheetMonthlyScreen';
import { SubmitConfirmationScreen } from '../screens/Activity/SubmitConfirmationScreen';
import { TimesheetSubmittedScreen } from '../screens/Activity/TimesheetSubmittedScreen';
import { ApprovalStatusScreen } from '../screens/Activity/ApprovalStatusScreen';
import { RevisionRequestedScreen } from '../screens/Activity/RevisionRequestedScreen';
import { AttendanceLocationScreen } from '../screens/Attendance/AttendanceLocationScreen';
import { FaceValidationScreen } from '../screens/Attendance/FaceValidationScreen';
import { QRValidationScreen } from '../screens/Attendance/QRValidationScreen';
import { AttendanceSuccessScreen } from '../screens/Attendance/AttendanceSuccessScreen';
import { AttendanceHistoryScreen } from '../screens/Attendance/AttendanceHistoryScreen';
import { AttendanceFilterScreen } from '../screens/Attendance/AttendanceFilterScreen';
import { MonthlySummaryScreen } from '../screens/Attendance/MonthlySummaryScreen';
import { AttendanceDetailScreen } from '../screens/Attendance/AttendanceDetailScreen';
import { AttendanceCalendarScreen } from '../screens/Attendance/AttendanceCalendarScreen';
import { CorrectionReasonScreen } from '../screens/Attendance/CorrectionReasonScreen';
import { CorrectionFormScreen } from '../screens/Attendance/CorrectionFormScreen';
import { CorrectionSummaryScreen } from '../screens/Attendance/CorrectionSummaryScreen';
import { CorrectionSubmittedScreen } from '../screens/Attendance/CorrectionSubmittedScreen';
import { LeaveHomeScreen } from '../screens/Leave/LeaveHomeScreen';
import { LeaveHistoryScreen } from '../screens/Leave/LeaveHistoryScreen';
import { SelectLeaveTypeScreen } from '../screens/Leave/SelectLeaveTypeScreen';
import { SelectDatesScreen } from '../screens/Leave/SelectDatesScreen';
import { SelectDelegateScreen } from '../screens/Leave/SelectDelegateScreen';
import { UploadDocumentScreen } from '../screens/Leave/UploadDocumentScreen';
import { LeaveReviewScreen } from '../screens/Leave/LeaveReviewScreen';
import { LeaveSuccessScreen } from '../screens/Leave/LeaveSuccessScreen';
import { PermissionHomeScreen } from '../screens/Permission/PermissionHomeScreen';
import { PermissionRequestScreen } from '../screens/Permission/PermissionRequestScreen';
import { PermissionReviewScreen } from '../screens/Permission/PermissionReviewScreen';
import { PermissionSuccessScreen } from '../screens/Permission/PermissionSuccessScreen';
import { OvertimeHomeScreen } from '../screens/Overtime/OvertimeHomeScreen';
import { OvertimeRequestScreen } from '../screens/Overtime/OvertimeRequestScreen';
import { OvertimeReviewScreen } from '../screens/Overtime/OvertimeReviewScreen';
import { OvertimeSuccessScreen } from '../screens/Overtime/OvertimeSuccessScreen';
import { PayslipHomeScreen } from '../screens/Finance/PayslipHomeScreen';
import { ExpenseOverviewScreen } from '../screens/Finance/ExpenseOverviewScreen';
import { ExpenseDetailScreen } from '../screens/Finance/ExpenseDetailScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { PersonalInfoScreen } from '../screens/Profile/PersonalInfoScreen';
import { IdentityVerificationScreen } from '../screens/Profile/IdentityVerificationScreen';
import { EmploymentInfoScreen } from '../screens/Profile/EmploymentInfoScreen';
import { PenaltyHomeScreen } from '../screens/Penalty/PenaltyHomeScreen';
import { PenaltyDetailScreen } from '../screens/Penalty/PenaltyDetailScreen';
import { PenaltyAppealScreen } from '../screens/Penalty/PenaltyAppealScreen';
import { PenaltyReviewScreen } from '../screens/Penalty/PenaltyReviewScreen';
import { PenaltySuccessScreen } from '../screens/Penalty/PenaltySuccessScreen';
import { EmployeeDirectoryScreen } from '../screens/Employee/EmployeeDirectoryScreen';
import { EmployeeDetailScreen } from '../screens/Employee/EmployeeDetailScreen';
import { OrgChartScreen } from '../screens/Employee/OrgChartScreen';
import { OnboardingScreen } from '../screens/Employee/OnboardingScreen';
import { PerformanceDashboardScreen } from '../screens/Performance/PerformanceDashboardScreen';
import { KPITrackingScreen } from '../screens/Performance/KPITrackingScreen';
import { PerformanceReviewScreen } from '../screens/Performance/PerformanceReviewScreen';
import { GoalSettingScreen } from '../screens/Performance/GoalSettingScreen';
import { Feedback360Screen } from '../screens/Performance/Feedback360Screen';

// Auth
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { ChangePasswordScreen } from '../screens/auth/ChangePasswordScreen';

// HR Manager Screens
import { HRDashboardScreen } from '../screens/hr/HRDashboardScreen';
import { HRApprovalCenterScreen } from '../screens/hr/HRApprovalCenterScreen';
import { HREmployeeManagementScreen } from '../screens/hr/HREmployeeManagementScreen';
import { HREmployeeProfileScreen } from '../screens/hr/HREmployeeProfileScreen';
import { HRAttendanceManagementScreen } from '../screens/hr/HRAttendanceManagementScreen';
import { HRReportsScreen } from '../screens/hr/HRReportsScreen';
import { HRSettingsScreen } from '../screens/hr/HRSettingsScreen';
import { HRAnalyticsScreen } from '../screens/hr/HRAnalyticsScreen';
import { HRLeaveManagementScreen } from '../screens/hr/HRLeaveManagementScreen';
import { HROnboardingManagementScreen } from '../screens/hr/HROnboardingManagementScreen';
import { HROffboardingScreen } from '../screens/hr/HROffboardingScreen';
import { OffboardingScreen } from '../screens/Offboarding/OffboardingScreen';
import { HRPolicyManagementScreen } from '../screens/hr/HRPolicyManagementScreen';
import { HRComplianceScreen } from '../screens/hr/HRComplianceScreen';
import { HRBulkActionsScreen } from '../screens/hr/HRBulkActionsScreen';
import { HRApprovalDetailScreen } from '../screens/hr/HRApprovalDetailScreen';
import { HRReportDetailScreen } from '../screens/hr/HRReportDetailScreen';

// Finance Manager Screens
import { FinanceDashboardScreen } from '../screens/finance-mgr/FinanceDashboardScreen';
import { PayrollManagementScreen } from '../screens/finance-mgr/PayrollManagementScreen';
import { FinanceExpenseManagementScreen } from '../screens/finance-mgr/FinanceExpenseManagementScreen';
import { FinanceReportsScreen } from '../screens/finance-mgr/FinanceReportsScreen';
import { FinanceSettingsScreen } from '../screens/finance-mgr/FinanceSettingsScreen';
import { FinanceEmployeeScreen } from '../screens/finance-mgr/FinanceEmployeeScreen';
import { FinanceBudgetScreen } from '../screens/finance-mgr/FinanceBudgetScreen';
import { FinanceTaxScreen } from '../screens/finance-mgr/FinanceTaxScreen';
import { FinanceAuditScreen } from '../screens/finance-mgr/FinanceAuditScreen';
import { PayrollDetailScreen } from '../screens/finance-mgr/PayrollDetailScreen';
import { PayrollHistoryScreen } from '../screens/finance-mgr/PayrollHistoryScreen';
import { FinanceReportDetailScreen } from '../screens/finance-mgr/FinanceReportDetailScreen';

// Department Manager Screens
import { ManagerDashboardScreen } from '../screens/manager/ManagerDashboardScreen';
import { MyTeamScreen } from '../screens/manager/MyTeamScreen';
import { ManagerApprovalScreen } from '../screens/manager/ManagerApprovalScreen';
import { TeamPlanningScreen } from '../screens/manager/TeamPlanningScreen';
import { TeamReportsScreen } from '../screens/manager/TeamReportsScreen';
import { TeamAttendanceScreen } from '../screens/manager/TeamAttendanceScreen';
import { TeamPerformanceScreen } from '../screens/manager/TeamPerformanceScreen';
import { TeamGoalsScreen } from '../screens/manager/TeamGoalsScreen';

// CEO Screens
import { CEODashboardScreen } from '../screens/ceo/CEODashboardScreen';
import { CEOAnalyticsScreen } from '../screens/ceo/CEOAnalyticsScreen';
import { DepartmentOverviewScreen } from '../screens/ceo/DepartmentOverviewScreen';
import { DepartmentDetailScreen } from '../screens/ceo/DepartmentDetailScreen';
import { CompanyGoalsScreen } from '../screens/ceo/CompanyGoalsScreen';
import { CEOReportsScreen } from '../screens/ceo/CEOReportsScreen';
import { WorkforcePlanningScreen } from '../screens/ceo/WorkforcePlanningScreen';

// ==================== TYPES ====================

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string; email?: string };
  ChangePassword: undefined;
  MainTabs: undefined;
  AIChat: undefined;
  AIChatExpanded: undefined;
  AIChatConversation: undefined;
  DocumentView: undefined;
  AttendanceLocation: undefined;
  FaceValidation: undefined;
  QRValidation: undefined;
  AttendanceSuccess: undefined;
  AttendanceHistory: undefined;
  AttendanceFilter: undefined;
  MonthlySummary: undefined;
  AttendanceDetail: undefined;
  AttendanceCalendar: undefined;
  CorrectionReason: undefined;
  CorrectionForm: undefined;
  CorrectionSummary: undefined;
  CorrectionSubmitted: undefined;
  LeaveHome: undefined;
  LeaveHistory: undefined;
  SelectLeaveType: undefined;
  SelectDates: undefined;
  SelectDelegate: undefined;
  UploadDocument: undefined;
  LeaveReview: undefined;
  LeaveSuccess: undefined;
  PermissionHome: undefined;
  PermissionRequest: undefined;
  PermissionReview: undefined;
  PermissionSuccess: undefined;
  OvertimeHome: undefined;
  OvertimeRequest: undefined;
  OvertimeReview: undefined;
  OvertimeSuccess: undefined;
  Profile: undefined;
  PenaltyHome: undefined;
  PenaltyDetail: undefined;
  PenaltyAppeal: undefined;
  PenaltyReview: undefined;
  PenaltySuccess: undefined;
  EmployeeDirectory: undefined;
  EmployeeDetail: undefined;
  OrgChart: undefined;
  Onboarding: undefined;
  PerformanceDashboard: undefined;
  KPITracking: undefined;
  PerformanceReview: undefined;
  GoalSetting: undefined;
  Feedback360: undefined;
  HREmployeeProfile: undefined;
  HRApprovalDetail: undefined;
  HRReportDetail: undefined;
  HRAnalytics: undefined;
  HRLeaveManagement: undefined;
  HROnboardingManagement: undefined;
  HROffboarding: undefined;
  HRPolicyManagement: undefined;
  HRCompliance: undefined;
  HRBulkActions: undefined;
  FinanceEmployee: undefined;
  FinanceBudget: undefined;
  FinanceTax: undefined;
  FinanceAudit: undefined;
  PayrollDetail: undefined;
  PayrollHistory: undefined;
  FinanceReportDetail: undefined;
  PersonalInfo: undefined;
  IdentityVerification: undefined;
  EmploymentInfo: undefined;
  TeamAttendance: undefined;
  TeamPerformance: undefined;
  TeamGoals: undefined;
  DepartmentDetail: undefined;
  WorkforcePlanning: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  CheckedOut: undefined;
  Shortcuts: undefined;
  Notifications: undefined;
};

export type ActivityStackParamList = {
  ActivityList: undefined;
  ActivityFilter: undefined;
  AddActivity: undefined;
  EditActivity: undefined;
  ActivityDetail: undefined;
  TimesheetWeekly: undefined;
  TimesheetMonthly: undefined;
  SubmitConfirmation: undefined;
  TimesheetSubmitted: undefined;
  ApprovalStatus: undefined;
  RevisionRequested: undefined;
};

export type FinanceStackParamList = {
  PayslipHome: undefined;
  ExpenseOverview: undefined;
  ExpenseDetail: undefined;
  PayslipDetail: undefined;
};

export type NotificationStackParamList = {
  NotificationsMain: undefined;
};

export type EmployeeTabParamList = {
  Home: undefined;
  Activity: undefined;
  Center: undefined;
  Finance: undefined;
  Notification: undefined;
};

export type HRTabParamList = {
  'HR Home': undefined;
  Approvals: undefined;
  Employees: undefined;
  Attendance: undefined;
  Reports: undefined;
  'HR Settings': undefined;
};

export type FinanceMgrTabParamList = {
  'Finance Home': undefined;
  Employees: undefined;
  Payroll: undefined;
  Expenses: undefined;
  Reports: undefined;
};

export type ManagerTabParamList = {
  'My Dashboard': undefined;
  'My Team': undefined;
  'Team Approvals': undefined;
  Planning: undefined;
  'Team Reports': undefined;
};

export type CEOTabParamList = {
  'CEO Home': undefined;
  Analytics: undefined;
  Departments: undefined;
  Goals: undefined;
  'CEO Reports': undefined;
};

export type UserRole = RoleId;

// ==================== NAVIGATORS ====================

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// ==================== EMPLOYEE TABS ====================

const HomeStack = () => (
  <Stack.Navigator<HomeStackParamList> screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="CheckedOut" component={CheckedOutScreen} />
    <Stack.Screen name="Shortcuts" component={ShortcutsScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

const ActivityStack = () => (
  <Stack.Navigator<ActivityStackParamList> screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ActivityList" component={ActivityListScreen} />
    <Stack.Screen name="ActivityFilter" component={ActivityFilterScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name="AddActivity" component={AddActivityScreen} />
    <Stack.Screen name="EditActivity" component={EditActivityScreen} />
    <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
    <Stack.Screen name="TimesheetWeekly" component={TimesheetWeeklyScreen} />
    <Stack.Screen name="TimesheetMonthly" component={TimesheetMonthlyScreen} />
    <Stack.Screen name="SubmitConfirmation" component={SubmitConfirmationScreen} />
    <Stack.Screen name="TimesheetSubmitted" component={TimesheetSubmittedScreen} />
    <Stack.Screen name="ApprovalStatus" component={ApprovalStatusScreen} />
    <Stack.Screen name="RevisionRequested" component={RevisionRequestedScreen} />
  </Stack.Navigator>
);

const FinanceStack = () => (
  <Stack.Navigator<FinanceStackParamList> screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PayslipHome" component={PayslipHomeScreen} />
    <Stack.Screen name="ExpenseOverview" component={ExpenseOverviewScreen} />
    <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
    <Stack.Screen name="PayslipDetail" component={ExpenseDetailScreen} />
  </Stack.Navigator>
);

const NotificationStack = () => (
  <Stack.Navigator<NotificationStackParamList> screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotificationsMain" component={NotificationsScreen} />
  </Stack.Navigator>
);

// ==================== CENTER BUTTON ====================

interface CenterButtonProps {
  onPress: () => void;
}

const CenterButton: React.FC<CenterButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.centerButton} onPress={onPress}>
    <View style={styles.centerButtonInner}>
      <Ionicons name="briefcase" size={24} color={colors.textInverse} />
    </View>
  </TouchableOpacity>
);

const EmployeeTabs = () => (
  <Tab.Navigator<EmployeeTabParamList>
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Activity') iconName = focused ? 'time' : 'time-outline';
        else if (route.name === 'Center') return null;
        else if (route.name === 'Finance') iconName = focused ? 'wallet' : 'wallet-outline';
        else if (route.name === 'Notification') iconName = focused ? 'notifications' : 'notifications-outline';
        else return 'home-outline' as keyof typeof Ionicons.glyphMap;
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Activity" component={ActivityStack} />
    <Tab.Screen name="Center" component={ShortcutsScreen} options={{ tabBarButton: (props) => <CenterButton {...props} /> }} />
    <Tab.Screen name="Finance" component={FinanceStack} />
    <Tab.Screen name="Notification" component={NotificationStack} />
  </Tab.Navigator>
);

// ==================== HR MANAGER TABS ====================

const HRTabs = () => (
  <Tab.Navigator<HRTabParamList>
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          'HR Home': 'home',
          'Approvals': 'checkmark-circle',
          'Employees': 'people',
          'Attendance': 'calendar',
          'Reports': 'bar-chart',
          'HR Settings': 'settings',
        };
        const name = route.name;
        const iconName = icons[name];
        return <Ionicons name={focused ? iconName : `${iconName}-outline` as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    })}
  >
    <Tab.Screen name="HR Home" component={HRDashboardScreen} />
    <Tab.Screen name="Approvals" component={HRApprovalCenterScreen} />
    <Tab.Screen name="Employees" component={HREmployeeManagementScreen} />
    <Tab.Screen name="Attendance" component={HRAttendanceManagementScreen} />
    <Tab.Screen name="Reports" component={HRReportsScreen} />
    <Tab.Screen name="HR Settings" component={HRSettingsScreen} />
  </Tab.Navigator>
);

// ==================== FINANCE MANAGER TABS ====================

const FinanceTabs = () => (
  <Tab.Navigator<FinanceMgrTabParamList>
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          'Finance Home': 'wallet',
          'Employees': 'people',
          'Payroll': 'card',
          'Expenses': 'receipt',
          'Reports': 'bar-chart',
        };
        const iconName = icons[route.name];
        return <Ionicons name={focused ? iconName : `${iconName}-outline` as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    })}
  >
    <Tab.Screen name="Finance Home" component={FinanceDashboardScreen} />
    <Tab.Screen name="Employees" component={FinanceEmployeeScreen} />
    <Tab.Screen name="Payroll" component={PayrollManagementScreen} />
    <Tab.Screen name="Expenses" component={FinanceExpenseManagementScreen} />
    <Tab.Screen name="Reports" component={FinanceReportsScreen} />
  </Tab.Navigator>
);

// ==================== DEPARTMENT MANAGER TABS ====================

const ManagerTabs = () => (
  <Tab.Navigator<ManagerTabParamList>
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          'My Dashboard': 'home',
          'My Team': 'people',
          'Team Approvals': 'checkmark-circle',
          'Planning': 'calendar',
          'Team Reports': 'bar-chart',
        };
        const iconName = icons[route.name];
        return <Ionicons name={focused ? iconName : `${iconName}-outline` as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    })}
  >
    <Tab.Screen name="My Dashboard" component={ManagerDashboardScreen} />
    <Tab.Screen name="My Team" component={MyTeamScreen} />
    <Tab.Screen name="Team Approvals" component={ManagerApprovalScreen} />
    <Tab.Screen name="Planning" component={TeamPlanningScreen} />
    <Tab.Screen name="Team Reports" component={TeamReportsScreen} />
  </Tab.Navigator>
);

// ==================== CEO TABS ====================

const CEOTabs = () => (
  <Tab.Navigator<CEOTabParamList>
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          'CEO Home': 'star',
          'Analytics': 'stats-chart',
          'Departments': 'business',
          'Goals': 'flag',
          'CEO Reports': 'bar-chart',
        };
        const iconName = icons[route.name];
        return <Ionicons name={focused ? iconName : `${iconName}-outline` as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    })}
  >
    <Tab.Screen name="CEO Home" component={CEODashboardScreen} />
    <Tab.Screen name="Analytics" component={CEOAnalyticsScreen} />
    <Tab.Screen name="Departments" component={DepartmentOverviewScreen} />
    <Tab.Screen name="Goals" component={CompanyGoalsScreen} />
    <Tab.Screen name="CEO Reports" component={CEOReportsScreen} />
  </Tab.Navigator>
);

// ==================== ROOT NAVIGATOR ====================

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Loading Karajo HR..." />;
  }

  const RoleNavigator: React.FC = () => {
    switch (role) {
      case 'hr_manager':
      case 'hr_specialist':
      case 'recruiter':
        return <HRTabs />;
      case 'finance_mgr':
      case 'accountant':
        return <FinanceTabs />;
      case 'manager':
      case 'team_lead':
        return <ManagerTabs />;
      case 'ceo':
        return <CEOTabs />;
      default:
        return <EmployeeTabs />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 250,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={RoleNavigator} options={{ animation: 'fade', animationDuration: 200, gestureEnabled: false }} />

              {/* Employee-only screens (accessible from any role via shortcuts) */}
              <Stack.Screen name="AIChat" component={AIChatScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="AIChatExpanded" component={AIChatExpandedScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="AIChatConversation" component={AIChatConversationScreen} />
              <Stack.Screen name="DocumentView" component={DocumentViewScreen} />
              <Stack.Screen name="AttendanceLocation" component={AttendanceLocationScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="FaceValidation" component={FaceValidationScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="QRValidation" component={QRValidationScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="AttendanceSuccess" component={AttendanceSuccessScreen} options={{ animation: 'fade', animationDuration: 300, gestureEnabled: false }} />
              <Stack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} />
              <Stack.Screen name="AttendanceFilter" component={AttendanceFilterScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="MonthlySummary" component={MonthlySummaryScreen} />
              <Stack.Screen name="AttendanceDetail" component={AttendanceDetailScreen} />
              <Stack.Screen name="AttendanceCalendar" component={AttendanceCalendarScreen} />
              <Stack.Screen name="CorrectionReason" component={CorrectionReasonScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="CorrectionForm" component={CorrectionFormScreen} />
              <Stack.Screen name="CorrectionSummary" component={CorrectionSummaryScreen} />
              <Stack.Screen name="CorrectionSubmitted" component={CorrectionSubmittedScreen} options={{ animation: 'fade', animationDuration: 300, gestureEnabled: false }} />
              <Stack.Screen name="LeaveHome" component={LeaveHomeScreen} />
              <Stack.Screen name="LeaveHistory" component={LeaveHistoryScreen} />
              <Stack.Screen name="SelectLeaveType" component={SelectLeaveTypeScreen} />
              <Stack.Screen name="SelectDates" component={SelectDatesScreen} />
              <Stack.Screen name="SelectDelegate" component={SelectDelegateScreen} />
              <Stack.Screen name="UploadDocument" component={UploadDocumentScreen} />
              <Stack.Screen name="LeaveReview" component={LeaveReviewScreen} />
              <Stack.Screen name="LeaveSuccess" component={LeaveSuccessScreen} options={{ animation: 'fade', animationDuration: 300, gestureEnabled: false }} />
              <Stack.Screen name="PermissionHome" component={PermissionHomeScreen} />
              <Stack.Screen name="PermissionRequest" component={PermissionRequestScreen} />
              <Stack.Screen name="PermissionReview" component={PermissionReviewScreen} />
              <Stack.Screen name="PermissionSuccess" component={PermissionSuccessScreen} options={{ animation: 'fade', animationDuration: 300, gestureEnabled: false }} />
              <Stack.Screen name="OvertimeHome" component={OvertimeHomeScreen} />
              <Stack.Screen name="OvertimeRequest" component={OvertimeRequestScreen} />
              <Stack.Screen name="OvertimeReview" component={OvertimeReviewScreen} />
              <Stack.Screen name="OvertimeSuccess" component={OvertimeSuccessScreen} options={{ animation: 'fade', animationDuration: 300, gestureEnabled: false }} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
              <Stack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
              <Stack.Screen name="EmploymentInfo" component={EmploymentInfoScreen} />
              <Stack.Screen name="PenaltyHome" component={PenaltyHomeScreen} />
              <Stack.Screen name="PenaltyDetail" component={PenaltyDetailScreen} />
              <Stack.Screen name="PenaltyAppeal" component={PenaltyAppealScreen} />
              <Stack.Screen name="PenaltyReview" component={PenaltyReviewScreen} />
              <Stack.Screen name="PenaltySuccess" component={PenaltySuccessScreen} options={{ animation: 'fade', animationDuration: 300, gestureEnabled: false }} />
              <Stack.Screen name="EmployeeDirectory" component={EmployeeDirectoryScreen} />
              <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
              <Stack.Screen name="OrgChart" component={OrgChartScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade', animationDuration: 300, gestureEnabled: false }} />
              <Stack.Screen name="Offboarding" component={OffboardingScreen} options={{ animation: 'fade', animationDuration: 300, gestureEnabled: false }} />
              <Stack.Screen name="PerformanceDashboard" component={PerformanceDashboardScreen} />
              <Stack.Screen name="KPITracking" component={KPITrackingScreen} />
              <Stack.Screen name="PerformanceReview" component={PerformanceReviewScreen} />
              <Stack.Screen name="GoalSetting" component={GoalSettingScreen} />
              <Stack.Screen name="Feedback360" component={Feedback360Screen} />
              
              {/* HR Management Screens */}
              <Stack.Screen name="HREmployeeProfile" component={HREmployeeProfileScreen} />
              <Stack.Screen name="HRApprovalDetail" component={HRApprovalDetailScreen} />
              <Stack.Screen name="HRReportDetail" component={HRReportDetailScreen} />
              <Stack.Screen name="HRAnalytics" component={HRAnalyticsScreen} />
              <Stack.Screen name="HRLeaveManagement" component={HRLeaveManagementScreen} />
              <Stack.Screen name="HROnboardingManagement" component={HROnboardingManagementScreen} />
              <Stack.Screen name="HROffboarding" component={HROffboardingScreen} />
              <Stack.Screen name="HRPolicyManagement" component={HRPolicyManagementScreen} />
              <Stack.Screen name="HRCompliance" component={HRComplianceScreen} />
              <Stack.Screen name="HRBulkActions" component={HRBulkActionsScreen} />
              
              {/* Finance Management Screens */}
              <Stack.Screen name="FinanceEmployee" component={FinanceEmployeeScreen} />
              <Stack.Screen name="FinanceBudget" component={FinanceBudgetScreen} />
              <Stack.Screen name="FinanceTax" component={FinanceTaxScreen} />
              <Stack.Screen name="FinanceAudit" component={FinanceAuditScreen} />
              <Stack.Screen name="PayrollDetail" component={PayrollDetailScreen} />
              <Stack.Screen name="PayrollHistory" component={PayrollHistoryScreen} />
              <Stack.Screen name="FinanceReportDetail" component={FinanceReportDetailScreen} />
              
              {/* Manager Management Screens */}
              <Stack.Screen name="TeamAttendance" component={TeamAttendanceScreen} />
              <Stack.Screen name="TeamPerformance" component={TeamPerformanceScreen} />
              <Stack.Screen name="TeamGoals" component={TeamGoalsScreen} />
              
              {/* CEO Management Screens */}
              <Stack.Screen name="DepartmentDetail" component={DepartmentDetailScreen} />
              <Stack.Screen name="WorkforcePlanning" component={WorkforcePlanningScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabLabel: { fontSize: 11, fontWeight: '500' as const, marginTop: 4 },
  centerButton: { top: -20, justifyContent: 'center' as const, alignItems: 'center' as const },
  centerButtonInner: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary,
    justifyContent: 'center' as const, alignItems: 'center' as const,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
});
