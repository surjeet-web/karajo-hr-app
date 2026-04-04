/**
 * Karajo HR Mobile App
 * 
 * App Analysis:
 * - Screens Found: 50+ screens across 10 modules
 * - Navigation Pattern: Bottom Tab Navigator (5 tabs) with nested Stack Navigators
 * - Design System: Blue primary (#2563EB), clean white cards, rounded corners, subtle shadows
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
 * 
 * Key Components:
 * - Button, Card, Badge, Header, Avatar, Input, ProgressBar, StatusTimeline
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
