export const colors = {
  background: '#F7F5F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F0EDE8',
  border: '#E0DDD8',
  borderLight: '#EDEBE7',
  text: '#1A1A1A',
  textSecondary: '#888888',
  textMuted: '#BBBBBB',
  accent: '#1A1A1A',
  accentContrast: '#FFFFFF',
  success: '#4CAF50',
  // Habit icon backgrounds
  habitColors: [
    { bg: '#E8F5E9', emoji: '🏃' },
    { bg: '#E3F2FD', emoji: '📚' },
    { bg: '#FCE4EC', emoji: '🧘' },
    { bg: '#FFF8E1', emoji: '💧' },
    { bg: '#F3E5F5', emoji: '🎨' },
    { bg: '#E0F2F1', emoji: '🍎' },
  ],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '600', color: colors.text },
  h2: { fontSize: 20, fontWeight: '600', color: colors.text },
  h3: { fontSize: 16, fontWeight: '500', color: colors.text },
  body: { fontSize: 15, fontWeight: '400', color: colors.text },
  caption: { fontSize: 13, fontWeight: '400', color: colors.textSecondary },
  label: { fontSize: 11, fontWeight: '500', color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },
};
