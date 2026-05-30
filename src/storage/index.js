import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const HABITS_KEY = '@habits';
const COMPLETIONS_KEY = '@completions';

// ─── Habits ───────────────────────────────────────────────────────────────────

export async function getHabits() {
  try {
    const raw = await AsyncStorage.getItem(HABITS_KEY);
    return raw ? JSON.parse(raw) : getDefaultHabits();
  } catch {
    return getDefaultHabits();
  }
}

export async function saveHabit(habit) {
  const habits = await getHabits();
  const existing = habits.findIndex((h) => h.id === habit.id);
  if (existing >= 0) {
    habits[existing] = habit;
  } else {
    habits.push(habit);
  }
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export async function deleteHabit(id) {
  const habits = await getHabits();
  const updated = habits.filter((h) => h.id !== id);
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updated));
}

// ─── Completions ──────────────────────────────────────────────────────────────

export function todayKey() {
  return format(new Date(), 'yyyy-MM-dd');
}

export async function getCompletions() {
  try {
    const raw = await AsyncStorage.getItem(COMPLETIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Returns Set of habitIds completed on a given date string
export async function getCompletionsForDate(dateStr) {
  const all = await getCompletions();
  return new Set(all[dateStr] || []);
}

export async function toggleCompletion(habitId, dateStr) {
  const all = await getCompletions();
  const daySet = new Set(all[dateStr] || []);
  if (daySet.has(habitId)) {
    daySet.delete(habitId);
  } else {
    daySet.add(habitId);
  }
  all[dateStr] = Array.from(daySet);
  await AsyncStorage.setItem(COMPLETIONS_KEY, JSON.stringify(all));
  return daySet.has(habitId); // return new state
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getStreakForHabit(habitId) {
  const all = await getCompletions();
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = format(d, 'yyyy-MM-dd');
    if ((all[key] || []).includes(habitId)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export async function getOverallStreak(habits) {
  const all = await getCompletions();
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = format(d, 'yyyy-MM-dd');
    const done = new Set(all[key] || []);
    const allDone = habits.every((h) => done.has(h.id));
    if (allDone && habits.length > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export async function getWeeklyStats(habits) {
  const all = await getCompletions();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = format(d, 'yyyy-MM-dd');
    const done = (all[key] || []).length;
    days.push({
      date: key,
      label: format(d, 'EEE'),
      completed: done,
      total: habits.length,
      rate: habits.length > 0 ? done / habits.length : 0,
    });
  }
  return days;
}

export async function getMonthlyRate(habits) {
  const all = await getCompletions();
  let total = 0;
  let done = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = format(d, 'yyyy-MM-dd');
    total += habits.length;
    done += (all[key] || []).length;
  }
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

function getDefaultHabits() {
  return [
    { id: '1', name: 'Morning run', emoji: '🏃', color: '#E8F5E9', createdAt: new Date().toISOString() },
    { id: '2', name: 'Read 20 pages', emoji: '📚', color: '#E3F2FD', createdAt: new Date().toISOString() },
    { id: '3', name: 'Meditate', emoji: '🧘', color: '#FCE4EC', createdAt: new Date().toISOString() },
    { id: '4', name: 'Drink 2L water', emoji: '💧', color: '#FFF8E1', createdAt: new Date().toISOString() },
  ];
}
