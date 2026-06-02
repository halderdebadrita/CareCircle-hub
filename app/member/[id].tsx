import { useCallback, useMemo, useState } from 'react';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/constants/theme';
import { getMemberLogs, getMemberVitals } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import type { FamilyMember, MedicineLogWithMedicine, Vital } from '@/types';

type TimelineItem = {
  id: string;
  kind: 'medicine' | 'vital';
  title: string;
  detail: string;
  date: string;
};

export default function MemberTimelineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [logs, setLogs] = useState<MedicineLogWithMedicine[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadTimeline() {
        if (!id) {
          return;
        }

        const { data: memberRow, error: memberError } = await supabase
          .from('family_members')
          .select('*')
          .eq('id', id)
          .single();

        if (memberError) {
          throw memberError;
        }

        const [logRows, vitalRows] = await Promise.all([getMemberLogs(id), getMemberVitals(id)]);
        setMember(memberRow);
        setLogs(logRows);
        setVitals(vitalRows);
        setLoading(false);
      }

      loadTimeline().catch((loadError: Error) => {
        setError(loadError.message);
        setLoading(false);
      });
    }, [id])
  );

  const timeline = useMemo<TimelineItem[]>(() => {
    const medicineItems = logs.map((log) => ({
      id: log.id,
      kind: 'medicine' as const,
      title: log.status === 'taken' ? 'Medicine taken' : 'Medicine skipped',
      detail: [log.medicines?.name, log.notes].filter(Boolean).join(' - ') || 'Care board update',
      date: log.log_time
    }));

    const vitalItems = vitals.map((vital) => ({
      id: vital.id,
      kind: 'vital' as const,
      title: vital.type === 'bp' ? 'BP reading' : `${vital.type} reading`,
      detail: [vital.value_1, vital.value_2, vital.context].filter(Boolean).join(' - '),
      date: vital.recorded_at
    }));

    return [...medicineItems, ...vitalItems].sort(
      (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
    );
  }, [logs, vitals]);

  if (loading) {
    return (
      <Screen footer={false}>
        <LoadingState message="Loading Health Timeline..." />
      </Screen>
    );
  }

  return (
    <Screen title="Health Timeline" subtitle={member?.name ?? 'Family member'}>
      <Stack.Screen options={{ title: 'Timeline' }} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {member ? (
        <View style={styles.profile}>
          <Text style={styles.profileName}>{member.name}</Text>
          <Text style={styles.profileMeta}>
            {[member.relation, member.age ? `${member.age} yrs` : null, member.blood_group].filter(Boolean).join(' - ') ||
              'Family member'}
          </Text>
          {member.notes ? <Text style={styles.notes}>{member.notes}</Text> : null}
        </View>
      ) : null}

      {timeline.length ? (
        <View style={styles.timeline}>
          {timeline.map((item) => (
            <View key={`${item.kind}-${item.id}`} style={styles.item}>
              <View style={[styles.dot, item.kind === 'medicine' ? styles.medicineDot : styles.vitalDot]} />
              <View style={styles.itemContent}>
                <Text style={styles.itemDate}>{new Date(item.date).toLocaleString()}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDetail}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <EmptyState title="No timeline entries yet" message="Medicine actions and readings will appear here." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 14
  },
  profile: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md
  },
  profileName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800'
  },
  profileMeta: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 4
  },
  notes: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm
  },
  timeline: {
    gap: spacing.md
  },
  item: {
    flexDirection: 'row',
    gap: spacing.md
  },
  dot: {
    borderRadius: 7,
    height: 14,
    marginTop: 8,
    width: 14
  },
  medicineDot: {
    backgroundColor: colors.primary
  },
  vitalDot: {
    backgroundColor: colors.accent
  },
  itemContent: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md
  },
  itemDate: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.xs
  },
  itemTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800'
  },
  itemDetail: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    textTransform: 'capitalize'
  }
});
