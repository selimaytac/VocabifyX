/**
 * notifications.service.ts
 *
 * STUB — expo-notifications removed temporarily due to iOS build incompatibility
 * (expo-notifications@55.0.11 breaks with expo-modules-core@55.0.13)
 *
 * TODO Sprint 5: Restore when compatible version is available.
 * All functions are no-ops that return safely without errors.
 */

export type ReminderTime = "morning" | "afternoon" | "evening" | "night";

export async function requestNotificationPermission(): Promise<boolean> {
  return false;
}

export async function scheduleReminders(
  _reminderTime: ReminderTime,
  _streakProtection: boolean,
  _currentStreak: number,
  _titleStudy: string,
  _bodyStudy: string,
  _titleStreak: string,
  _bodyStreak: string,
): Promise<void> {
  // no-op stub
}

export async function cancelAllNotifications(): Promise<void> {
  // no-op stub
}

export async function scheduleReEngagementNotification(
  _title: string,
  _body: string,
): Promise<void> {
  // no-op stub
}

export async function cancelReEngagementNotification(): Promise<void> {
  // no-op stub
}
