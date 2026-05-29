import { supabase } from './supabase';
import type { Family, FamilyMember, MedicineLogWithMedicine, MedicineWithMember, Vital } from '@/types';

export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user?.id ?? null;
}

export async function getCurrentFamily(): Promise<Family | null> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from('families')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getActiveMedicines(familyId: string): Promise<MedicineWithMember[]> {
  const { data, error } = await supabase
    .from('medicines')
    .select('*, family_members!inner(id, name, family_id)')
    .eq('is_active', true)
    .eq('family_members.family_id', familyId)
    .order('timing', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as MedicineWithMember[];
}

export async function getMemberLogs(memberId: string): Promise<MedicineLogWithMedicine[]> {
  const { data, error } = await supabase
    .from('medicine_logs')
    .select('*, medicines(name)')
    .eq('member_id', memberId)
    .order('log_time', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as MedicineLogWithMedicine[];
}

export async function getMemberVitals(memberId: string): Promise<Vital[]> {
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('member_id', memberId)
    .order('recorded_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
