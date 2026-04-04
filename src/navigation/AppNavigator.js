import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components/CommonStates';

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
import { OvertimeSuccessScreen } from '../screens/Overtime/OvertimeSuccessScreen';
import { PayslipHomeScreen } from '../screens/Finance/PayslipHomeScreen';
import { ExpenseOverviewScreen } from '../screens/Finance/ExpenseOverviewScreen';
import { ExpenseDetailScreen } from '../screens/Finance/ExpenseDetailScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
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

// HR Manager Screens
import { HRDashboardScreen } from '../screens/hr/HRDashboardScreen';
import { HRApprovalCenterScreen } from '../screens/hr/HRApprovalCenterScreen';
import { HREmployeeManagementScreen } from '../screens/hr/HREmployeeManagementScreen';
import { HRAttendanceManagementScreen } from '../screens/hr/HRAttendanceManagementScreen';
import { HRReportsScreen } from '../screens/hr/HRReportsScreen';
import { HRSettingsScreen } from '../screens/hr/HRSettingsScreen';

// Finance Manager Screens
import { FinanceDashboardScreen } from '../screens/finance-mgr/FinanceDashboardScreen';
import { PayrollManagementScreen } from '../screens/finance-mgr/PayrollManagementScreen';
import { FinanceExpenseManagementScreen } from '../screens/finance-mgr/FinanceExpenseManagementScreen';
import { FinanceReportsScreen } from '../screens/finance-mgr/FinanceReportsScreen';
import { FinanceSettingsScreen } from '../screens/finance-mgr/FinanceSettingsScreen';

// Department Manager Screens
import { ManagerDashboardScreen } from '../screens/manager/ManagerDashboardScreen';
import { MyTeamScreen } from '../screens/manager/MyTeamScreen';
import { ManagerApprovalScreen } from '../screens/manager/ManagerApprovalScreen';
import { TeamPlanningScreen } from '../screens/manager/TeamPlanningScreen';
import { TeamReportsScreen } from '../screens/manager/TeamReportsScreen';

// CEO Screens
import { CEODashboardScreen } from '../screens/ceo/CEODashboardScreen';
import { CEOAnalyticsScreen } from '../screens/ceo/CEOAnalyticsScreen';
import { DepartmentOverviewScreen } from '../screens/ceo/DepartmentOverviewScreen';
import { CompanyGoalsScreen } from '../screens/ceo/CompanyGoalsScreen';
import { CEOReportsScreen } from '../screens/ceo/CEOReportsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ==================== EMPLOYEE TABS ====================
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="CheckedOut" component={CheckedOutScreen} />
    <Stack.Screen name="Shortcuts" component={ShortcutsScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

const ActivityStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
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
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PayslipHome" component={PayslipHomeScreen} />
    <Stack.Screen name="ExpenseOverview" component={ExpenseOverviewScreen} />
    <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
    <Stack.Screen name="PayslipDetail" component={ExpenseDetailScreen} />
  </Stack.Navigator>
);

const NotificationStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotificationsMain" component={NotificationsScreen} />
  </Stack.Navigator>
);

const CenterButton = ({ onPress }) => (
  <TouchableOpacity style={styles.centerButton} onPress={onPress}>
    <View style={styles.centerButtonInner}>
      <Ionicons name="briefcase" size={24} color={colors.textInverse} />
    </View>
  </TouchableOpacity>
);

const EmployeeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Activity') iconName = focused ? 'time' : 'time-outline';
        else if (route.name === 'Center') return null;
        else if (route.name === 'Finance') iconName = focused ? 'wallet' : 'wallet-outline';
        else if (route.name === 'Notification') iconName = focused ? 'notifications' : 'notifications-outline';
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
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons = { 'HR Home': 'home', 'Approvals': 'checkmark-circle', 'Employees': 'people', 'Attendance': 'calendar', 'Reports': 'bar-chart', 'HR Settings': 'settings' };
        const name = route.name;
        return <Ionicons name={focused ? icons[name] : `${icons[name]}-outline`} size={size} color={color} />;
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
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons = { 'Finance Home': 'wallet', 'Payroll': 'card', 'Expenses': 'receipt', 'Fin Reports': 'bar-chart', 'Fin Settings': 'settings' };
        return <Ionicons name={focused ? icons[route.name] : `${icons[route.name]}-outline`} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    })}
  >
    <Tab.Screen name="Finance Home" component={FinanceDashboardScreen} />
    <Tab.Screen name="Payroll" component={PayrollManagementScreen} />
    <Tab.Screen name="Expenses" component={FinanceExpenseManagementScreen} />
    <Tab.Screen name="Fin Reports" component={FinanceReportsScreen} />
    <Tab.Screen name="Fin Settings" component={FinanceSettingsScreen} />
  </Tab.Navigator>
);

// ==================== DEPARTMENT MANAGER TABS ====================
const ManagerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons = { 'My Dashboard': 'home', 'My Team': 'people', 'Team Approvals': 'checkmark-circle', 'Planning': 'calendar', 'Team Reports': 'bar-chart' };
        return <Ionicons name={focused ? icons[route.name] : `${icons[route.name]}-outline`} size={size} color={color} />;
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
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons = { 'CEO Home': 'star', 'Analytics': 'stats-chart', 'Departments': 'business', 'Goals': 'flag', 'CEO Reports': 'bar-chart' };
        return <Ionicons name={focused ? icons[route.name] : `${icons[route.name]}-outline`} size={size} color={color} />;
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
export const AppNavigator = () => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Loading Karajo HR..." />;
  }

  const getRoleNavigator = () => {
    switch (role) {
      case 'hr_manager':
      case 'hr_specialist':
      case 'recruiter':
        return <HRTabs />;
      case 'finance_mgr':
      case 'accountant':
        return <FinanceTabs />;
      case 'manager':
        return <ManagerTabs />;
      case 'ceo':
        return <CEOTabs />;
      default:
        return <EmployeeTabs />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs">{() => getRoleNavigator()}</Stack.Screen>

            {/* Employee-only screens (accessible from any role via shortcuts) */}
            <Stack.Screen name="AIChat" component={AIChatScreen} />
            <Stack.Screen name="AIChatExpanded" component={AIChatExpandedScreen} />
            <Stack.Screen name="AIChatConversation" component={AIChatConversationScreen} />
            <Stack.Screen name="DocumentView" component={DocumentViewScreen} />
            <Stack.Screen name="AttendanceLocation" component={AttendanceLocationScreen} />
            <Stack.Screen name="FaceValidation" component={FaceValidationScreen} />
            <Stack.Screen name="QRValidation" component={QRValidationScreen} />
            <Stack.Screen name="AttendanceSuccess" component={AttendanceSuccessScreen} />
            <Stack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} />
            <Stack.Screen name="AttendanceFilter" component={AttendanceFilterScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="MonthlySummary" component={MonthlySummaryScreen} />
            <Stack.Screen name="AttendanceDetail" component={AttendanceDetailScreen} />
            <Stack.Screen name="AttendanceCalendar" component={AttendanceCalendarScreen} />
            <Stack.Screen name="CorrectionReason" component={CorrectionReasonScreen} />
            <Stack.Screen name="CorrectionForm" component={CorrectionFormScreen} />
            <Stack.Screen name="CorrectionSummary" component={CorrectionSummaryScreen} />
            <Stack.Screen name="CorrectionSubmitted" component={CorrectionSubmittedScreen} />
            <Stack.Screen name="LeaveHome" component={LeaveHomeScreen} />
            <Stack.Screen name="LeaveHistory" component={LeaveHistoryScreen} />
            <Stack.Screen name="SelectLeaveType" component={SelectLeaveTypeScreen} />
            <Stack.Screen name="SelectDates" component={SelectDatesScreen} />
            <Stack.Screen name="SelectDelegate" component={SelectDelegateScreen} />
            <Stack.Screen name="UploadDocument" component={UploadDocumentScreen} />
            <Stack.Screen name="LeaveReview" component={LeaveReviewScreen} />
            <Stack.Screen name="LeaveSuccess" component={LeaveSuccessScreen} />
            <Stack.Screen name="PermissionHome" component={PermissionHomeScreen} />
            <Stack.Screen name="PermissionRequest" component={PermissionRequestScreen} />
            <Stack.Screen name="PermissionReview" component={PermissionReviewScreen} />
            <Stack.Screen name="PermissionSuccess" component={PermissionSuccessScreen} />
            <Stack.Screen name="OvertimeHome" component={OvertimeHomeScreen} />
            <Stack.Screen name="OvertimeSuccess" component={OvertimeSuccessScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PenaltyHome" component={PenaltyHomeScreen} />
            <Stack.Screen name="PenaltyDetail" component={PenaltyDetailScreen} />
            <Stack.Screen name="PenaltyAppeal" component={PenaltyAppealScreen} />
            <Stack.Screen name="PenaltyReview" component={PenaltyReviewScreen} />
            <Stack.Screen name="PenaltySuccess" component={PenaltySuccessScreen} />
            <Stack.Screen name="EmployeeDirectory" component={EmployeeDirectoryScreen} />
            <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
            <Stack.Screen name="OrgChart" component={OrgChartScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="PerformanceDashboard" component={PerformanceDashboardScreen} />
            <Stack.Screen name="KPITracking" component={KPITrackingScreen} />
            <Stack.Screen name="PerformanceReview" component={PerformanceReviewScreen} />
            <Stack.Screen name="GoalSetting" component={GoalSettingScreen} />
            <Stack.Screen name="Feedback360" component={Feedback360Screen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
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
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabLabel: { fontSize: 11, fontWeight: '500', marginTop: 4 },
  centerButton: { top: -20, justifyContent: 'center', alignItems: 'center' },
  centerButtonInner: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
});
