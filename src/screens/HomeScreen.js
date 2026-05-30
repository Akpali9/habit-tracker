import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import {
  getHabits, getCompletionsForDate,
  toggleCompletion, todayKey, getOverallStreak,
} from '../storage';
import { colors, spacing, radius, typography } from '../theme';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);
  const [completed, setCompleted] = useState(new Set());
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    const h = await getHabits();
    const c = await getCompletionsForDate(todayKey());
    const s = await getOverallStreak(h);
    setHabits(h);
    setCompleted(c);
    setStreak(s);
  }

  async function handleToggle(habitId) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isNowDone = await toggleCompletion(habitId, todayKey());
    setCompleted((prev) => {
      const next = new Set(prev);
      if (isNowDone) next.add(habitId);
      else next.delete(habitId);
      return next;
    });
  }

  const doneCount = habits.filter((h) => completed.has(h.id)).length;
  const progress = habits.length > 0 ? doneCount / habits.length : 0;
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()} {getEmoji(today.getHours())}
          </Text>
          <Text style={styles.title}>Your habits</Text>
          <Text style={styles.subtitle}>{format(today, 'EEEE, MMMM d')}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddHabit')}
          activeOpacity={0.7}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Streak Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerFire}>🔥</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerLabel}>Current streak</Text>
          <Text style={styles.bannerCount}>{streak} days</Text>
        </View>
        {/* Progress Ring */}
        <View style={styles.ringContainer}>
          <Text style={styles.ringText}>{doneCount}/{habits.length}</Text>
          <View style={[styles.ringTrack]}>
            <View
              style={[
                styles.ringFill,
                { width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.ringLabel}>today</Text>
        </View>
      </View>

      {/* Habits List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Today's habits</Text>

        {habits.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No habits yet.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddHabit')}>
              <Text style={styles.emptyLink}>Add your first habit →</Text>
            </TouchableOpacity>
          </View>
        )}

        {habits.map((habit) => {
          const done = completed.has(habit.id);
          return (
            <View key={habit.id} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: habit.color }]}>
                <Text style={styles.iconEmoji}>{habit.emoji}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{habit.name}</Text>
                <View style={styles.weekRow}>
                  {DAYS.map((d, i) => {
                    // Shift so Monday=0
                    const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                    const isToday = i === todayIdx;
                    const isPast = i < todayIdx;
                    return (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          isPast && styles.dotPast,
                          isToday && styles.dotToday,
                        ]}
                      >
                        <Text style={[styles.dotText, (isPast || isToday) && styles.dotTextActive]}>
                          {d}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
              <TouchableOpacity
                style={[styles.check, done && styles.checkDone]}
                onPress={() => handleToggle(habit.id)}
                activeOpacity={0.8}
              >
                {done && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getEmoji(h) {
  if (h < 6) return '🌙';
  if (h < 12) return '☀️';
  if (h < 17) return '🌤️';
  return '🌆';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: { ...typography.caption, marginBottom: 2 },
  title: { ...typography.h1, marginBottom: 2 },
  subtitle: typography.caption,
  addBtn: {
    width: 36, height: 36, borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 22, lineHeight: 36, textAlign: 'center' },

  banner: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bannerFire: { fontSize: 28 },
  bannerLabel: { fontSize: 12, color: '#aaa', marginBottom: 2 },
  bannerCount: { fontSize: 20, fontWeight: '600', color: '#fff' },
  ringContainer: { alignItems: 'center', gap: 4 },
  ringText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  ringTrack: {
    width: 60, height: 6, backgroundColor: '#333',
    borderRadius: radius.full, overflow: 'hidden',
  },
  ringFill: { height: '100%', backgroundColor: '#fff', borderRadius: radius.full },
  ringLabel: { fontSize: 11, color: '#aaa' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg },
  sectionLabel: { ...typography.label, marginBottom: spacing.sm },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  iconBox: {
    width: 44, height: 44, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  iconEmoji: { fontSize: 20 },
  cardInfo: { flex: 1 },
  cardName: { ...typography.h3, marginBottom: 6 },
  weekRow: { flexDirection: 'row', gap: 4 },
  dot: {
    width: 18, height: 18, borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  dotPast: { backgroundColor: colors.accent },
  dotToday: {
    backgroundColor: 'transparent',
    borderWidth: 1.5, borderColor: colors.accent,
  },
  dotText: { fontSize: 8, color: colors.textMuted },
  dotTextActive: { color: '#fff' },

  check: {
    width: 30, height: 30, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkMark: { color: '#fff', fontSize: 14, fontWeight: '600' },

  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  emptyLink: { ...typography.body, color: colors.accent, fontWeight: '500' },
});
