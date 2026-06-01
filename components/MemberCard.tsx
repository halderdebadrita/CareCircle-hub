import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import type { FamilyMember } from '@/types';

type MemberCardProps = {
  member: FamilyMember;
  onPress?: () => void;
};

export function MemberCard({ member, onPress }: MemberCardProps) {
  const meta = [member.relation, member.age ? `${member.age} yrs` : null, member.blood_group].filter(Boolean).join(' - ');

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && onPress ? styles.pressed : null]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{member.name.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{member.name}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : <Text style={styles.meta}>Family member</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md
  },
  pressed: {
    opacity: 0.78
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.surfaceWarm,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '800'
  },
  content: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800'
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 3
  }
});
