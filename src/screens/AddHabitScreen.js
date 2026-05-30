import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { saveHabit } from '../storage';
import { colors, spacing, radius, typography } from '../theme';

const EMOJIS = ['🏃', '📚', '🧘', '💧', '🎨', '🍎', '💤', '✍️', '🎯', '💪', '🧠', '🌿'];
const BG_COLORS = [
  '#E8F5E9', '#E3F2FD', '#FCE4EC', '#FFF8E1',
  '#F3E5F5', '#E0F2F1', '#FBE9E7', '#E8EAF6',
];

export default function AddHabitScreen({ navigation, route }) {
  const editing = route?.params?.habit;

  const [name, setName] = useState(editing?.name || '');
  const [emoji, setEmoji] = useState(editing?.emoji || '🏃');
  const [color, setColor] = useState(editing?.color || BG_COLORS[0]);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your habit.');
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const habit = {
      id: editing?.id || Date.now().toString(),
      name: name.trim(),
      emoji,
      color,
      createdAt: editing?.createdAt || new Date().toISOString(),
    };
    await saveHabit(habit);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Nav bar */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.navCancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>{editing ? 'Edit habit' : 'New habit'}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.navSave}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Preview */}
        <View style={styles.preview}>
          <View style={[styles.previewIcon, { backgroundColor: color }]}>
            <Text style={{ fontSize: 32 }}>{emoji}</Text>
          </View>
          <Text style={styles.previewName}>{name || 'Habit name'}</Text>
        </View>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Evening walk"
          placeholderTextColor={colors.textMuted}
          autoFocus
          returnKeyType="done"
          maxLength={40}
        />

        {/* Emoji */}
        <Text style={styles.label}>Icon</Text>
        <View style={styles.emojiGrid}>
          {EMOJIS.map((e) => (
            <TouchableOpacity
              key={e}
              style={[styles.emojiOpt, emoji === e && styles.emojiSelected]}
              onPress={() => { setEmoji(e); Haptics.selectionAsync(); }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 22 }}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color */}
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorGrid}>
          {BG_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorOpt,
                { backgroundColor: c },
                color === c && styles.colorSelected,
              ]}
              onPress={() => { setColor(c); Haptics.selectionAsync(); }}
              activeOpacity={0.8}
            />
          ))}
        </View>

        {/* Save button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>{editing ? 'Save changes' : 'Add habit'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  nav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  navCancel: { ...typography.body, color: colors.textSecondary },
  navTitle: { ...typography.h3 },
  navSave: { ...typography.body, color: colors.accent, fontWeight: '600' },

  scroll: { flex: 1 },
  content: { padding: spacing.lg },

  preview: { alignItems: 'center', paddingVertical: spacing.xl },
  previewIcon: {
    width: 80, height: 80, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  previewName: { ...typography.h2, color: colors.textSecondary },

  label: { ...typography.label, marginBottom: spacing.sm, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.5, borderColor: colors.border,
    padding: spacing.md,
    fontSize: 16, color: colors.text,
  },

  emojiGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
  },
  emojiOpt: {
    width: 48, height: 48, borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  emojiSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },

  colorGrid: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  colorOpt: {
    width: 36, height: 36, borderRadius: radius.full,
    borderWidth: 2, borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: colors.accent,
  },

  saveBtn: {
    marginTop: spacing.xl + spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
