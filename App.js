/**
 * Karajo HR Mobile App
 * 
 * App Analysis:
 * - Screens: 54 screens across 13 modules
 * - Navigation: Bottom Tab (5 tabs) with nested Stack Navigators
 * - Design System: Blue primary (#2563EB), clean white cards, rounded corners, subtle shadows
 * - State: Store-based with AsyncStorage persistence
 * - Services: API layer ready for backend integration
 * 
 * Modules:
 * 1. Home - Dashboard with attendance check-in, quick actions, recent updates
 * 2. AI Chat - KarajoAI assistant for HR queries
 * 3. Activity/Timesheet - Time tracking, activity logs, timesheet submission
 * 4. Attendance - Location/face/QR validation, history, corrections
 * 5. Leave - Leave balance, requests, history
 * 6. Permission - Short leave requests
 * 7. Overtime - Overtime tracking and requests
 * 8. Finance - Payslips and expense management
 * 9. Profile - Employee profile and settings
 * 10. Penalty - Disciplinary actions and appeals
 * 11. Employee - Directory, org chart, onboarding
 * 12. Performance - KPIs, goals, reviews, 360 feedback
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
