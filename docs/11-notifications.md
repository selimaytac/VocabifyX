# VocabifyX – Notifications

> **Reference:** [Onboarding](./09-onboarding.md) · [Analytics](./12-analytics.md)

---

## Philosophy

Notifications must **help**, not harass. Every notification should feel like a helpful nudge from a study partner, not spam. Max 3–4 per day, well-timed, varied in copy.

---

## Notification Schedule

All notifications are **local notifications** (no server push in MVP). Scheduled at onboarding completion based on user's local timezone.

### Daily Notification Windows

| Slot | Time (Local) | Type | Frequency |
|------|-------------|------|-----------|
| Morning | 08:00–09:00 | Study reminder | Daily |
| Afternoon | 12:30–13:30 | Quick session nudge | Weekdays only |
| Evening | 19:00–20:00 | Streak protection / review | Daily |
| Night | 21:30–22:00 | Motivational / achievement | 3x/week |

> Max 3 notifications on weekdays, max 2 on weekends. Firebase Remote Config: `max_notifs_per_day`

---

## Notification Types

### 1. Study Reminder
Triggered when user hasn't studied yet today.

**Copy variants (rotated daily):**
- EN: "Time for a quick vocab session! 📚 Keep that streak alive."
- EN: "Your words are waiting for you. 5 minutes is enough!"
- EN: "Ready to level up? Open VocabifyX and squeeze in a session."
- TR: "Bugün henüz çalışmadın! 5 dakika yeterli. 📖"
- TR: "Kelimelerini bekliyor. Serinle devam edelim!"
- TR: "Streakini kaybetme! Hızlı bir oturum yap. 🔥"

### 2. Streak Protection
Triggered when user has an active streak ≥ 3 days and hasn't studied yet (fires at 20:00).

- EN: "🔥 {streakDays}-day streak at risk! Study before midnight."
- EN: "Don't break your {streakDays}-day streak! Quick session now →"
- TR: "{streakDays} günlük serisini kaybetme! Hemen çalış. 🔥"

### 3. Achievement Unlocked
Triggered immediately after an achievement is unlocked (if app is backgrounded).

- EN: "🏆 Achievement unlocked: {achievementName}! Check it out."
- TR: "🏆 Başarım açıldı: {achievementName}! Hemen bak."

### 4. Level Up
Triggered immediately on level-up (if app is backgrounded).

- EN: "⬆️ You leveled up to {levelName}! Open VocabifyX to celebrate."
- TR: "⬆️ {levelName} seviyesine ulaştın! Kutlamak için aç."

### 5. Motivational (3x/week, Night slot)
Random motivational copy, not linked to any action.

- EN: "Every word you learn opens a new door. Keep going! 🌟"
- EN: "Consistency beats talent. See you tomorrow? 🎯"
- TR: "Öğrendiğin her kelime yeni bir kapı açar. Devam et! 🌟"
- TR: "Tutarlılık, yetenekten üstündür. Yarın da burada ol. 🎯"

---

## Implementation

```typescript
// services/notifications/index.ts
import * as Notifications from 'expo-notifications'

export const scheduleReminders = async (userPrefs: NotificationPrefs) => {
  await Notifications.cancelAllScheduledNotificationsAsync()

  if (!userPrefs.enabled) return

  // Schedule morning reminder (daily)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'VocabifyX',
      body: pickRandom(studyReminderCopy[userPrefs.language]),
      data: { screen: 'home', trigger: 'morning_reminder' },
    },
    trigger: {
      hour: 8,
      minute: 30,
      repeats: true,
    },
  })

  // Schedule evening streak protection (daily, only if streak ≥ 3)
  // ... etc
}

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync()
}
```

---

## Notification Permissions

- Request permission during onboarding Step 3 or Step 4
- If denied: show in-app reminder to enable from Settings on next session
- Don't request again for 7 days if denied

---

## User Settings (Settings Screen)

```
Notification Settings
  ├── [ Toggle ] Notifications On/Off
  ├── [ Toggle ] Study Reminders
  ├── [ Toggle ] Streak Alerts
  ├── [ Toggle ] Achievement Alerts
  └── Quiet Hours: [ none / 22:00–08:00 / Custom ]
```

---

## Analytics Events

```typescript
track('notification_permission_granted')
track('notification_permission_denied')
track('notification_received', { type, trigger })
track('notification_tapped', { type, trigger, screen })
```
