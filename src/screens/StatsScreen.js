import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getHabits, getWeeklyStats, getMonthlyRate,
  getOverallStreak, getCompletionsForDate, todayKey,
} from '../storage';
import { colors, spacing, radius, typography } from '../theme';

export default function StatsScreen() {
  const [habits, setHabits] = useState([]);
  const [weekStats, setWeekStats] = useState([]);
  const [monthRate, setMonthRate] = useState(0);
  const [streak, setStreak] = useState(0);
  const [habitRates, setHabitRates] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    const h = await getHabits();
    const w = await getWeeklyStats(h);
    const m = await getMonthlyRate(h);
    const s = await getOverallStreak(h);
    setHabits(h);
    setWeekStats(w);
    setMonthRate(m);
    setStreak(s);

    // Per-habit 30-day completion rate
    const rates = await Promise.all(
      h.map(async (habit) => {
        let done = 0;
        for (let i = 0; i < 30; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const { format } = await import('date-fns');
          const key = format(d, 'yyyy-MM-dd');
          const c = await getCompletionsForDate(key);
          if (c.has(habit.id)) done++;
        }
        return { ...habit, rate: Math.round((done / 30) * 100) };
      })
    );
    setHabitRates(rates);
  }

  const statCards = [
    { num: `${monthRate}%`, label: 'Completion rate' },
    { num: `${streak}`, label: `Day streak 🔥` },
    { num: `${habits.length}`, label: 'Active habits' },
    { num: weekStats.filter((d) => d.rate >= 1).length.toString(), label: 'Perfect days' },
  ];

  const maxBar = Math.max(...weekStats.map((d) => d.total), 1);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>This month</Text>
        <Text style={styles.title}>Your progress</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stat Cards */}
        <View style={styles.statGrid}>
          {statCards.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statNum}>{s.num}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Weekly Bar Chart */}
        <Text style={styles.sectionLabel}>This week</Text>
        <View style={styles.card}>
          {weekStats.map((day, i) => (
            <View key={i} style={styles.barRow}>
              <Text style={styles.barDay}>{day.label}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${day.total > 0 ? (day.completed / day.total) * 100 : 0}%` },
                  ]}
                />
              </View>
              <Text style={styles.barVal}>
                {day.total > 0 ? `${day.completed}/${day.total}` : '—'}
              </Text>
            </View>
          ))}
        </View>

        {/* Habit Breakdown */}
        <Text style={styles.sectionLabel}>Habit breakdown</Text>
        <View style={[styles.card, { gap: spacing.md }]}>
          {habitRates.map((habit) => (
            <View key={habit.id} style={styles.habitRow}>
              <View style={[styles.habitIcon, { backgroundColor: habit.color }]}>
                <Text style={{ fontSize: 14 }}>{habit.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <View style={styles.rateTrack}>
                  <View style={[styles.rateFill, { width: `${habit.rate}%` }]} />
                </View>
              </View>
              <Text style={styles.rateLabel}>{habit.rate}%</Text>
            </View>
          ))}
          {habitRates.length === 0 && (
            <Text style={styles.emptyText}>No habits to show yet.</Text>
          )}
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  eyebrow: typography.caption,
  title: { ...typography.h1, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg },

  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    width: '48%',
  },
  statNum: { fontSize: 26, fontWeight: '600', color: colors.text, marginBottom: 2 },
  statLabel: typography.caption,

  sectionLabel: { ...typography.label, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  barDay: { ...typography.caption, width: 28 },
  barTrack: {
    flex: 1, height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full, overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radius.full },
  barVal: { ...typography.caption, width: 30, textAlign: 'right' },

  habitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  habitIcon: {
    width: 34, height: 34, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  habitName: { ...typography.caption, color: colors.text, fontWeight: '500', marginBottom: 4 },
  rateTrack: {
    height: 6, backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full, overflow: 'hidden',
  },
  rateFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radius.full },
  rateLabel: { ...typography.caption, width: 30, textAlign: 'right' },
  emptyText: { ...typography.caption, textAlign: 'center', padding: spacing.lg },
});
