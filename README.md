# HabitTracker

A clean, minimal habit tracking app built with React Native + Expo.

## Features
- ✅ Track daily habits with one tap
- 🔥 Streak tracking (daily + per-habit)
- 📊 Weekly bar chart & monthly completion rate
- ➕ Add/edit habits with custom emoji + color
- 💾 Persistent storage via AsyncStorage
- 📳 Haptic feedback on interactions

## Project Structure

```
HabitTracker/
├── App.js                        # Root entry point
├── app.json                      # Expo config
├── src/
│   ├── navigation/
│   │   └── index.js              # Bottom tabs + modal stack
│   ├── screens/
│   │   ├── HomeScreen.js         # Today's habits
│   │   ├── StatsScreen.js        # Progress & analytics
│   │   └── AddHabitScreen.js     # Create/edit habit
│   ├── storage/
│   │   └── index.js              # AsyncStorage helpers
│   └── theme/
│       └── index.js              # Colors, spacing, typography
```

## Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS/Android)

### Install & Run

```bash
cd HabitTracker
npm install
npx expo start
```

Then scan the QR code with Expo Go on your phone.

### Run on Simulator

```bash
# iOS (Mac only)
npx expo start --ios

# Android
npx expo start --android
```

## Next Steps

### Notifications
Reminders are wired up via `expo-notifications`. Add scheduling in `src/storage/index.js`:

```js
import * as Notifications from 'expo-notifications';

export async function scheduleReminder(habitId, hour, minute) {
  await Notifications.scheduleNotificationAsync({
    content: { title: "Habit reminder", body: "Time to check in!" },
    trigger: { hour, minute, repeats: true },
  });
}
```

### Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build
eas build --platform ios
eas build --platform android
```

### Adding More Screens
- **History screen** — calendar heatmap view (consider `react-native-calendars`)
- **Settings screen** — notification times, theme toggle, data export
- **Habit detail** — long-press a habit to see its full history
