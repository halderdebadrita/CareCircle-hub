export type Family = {
  id: string;
  name: string;
  created_by: string | null;
  created_at: string;
};

export type FamilyMember = {
  id: string;
  family_id: string;
  name: string;
  relation: string | null;
  age: number | null;
  blood_group: string | null;
  notes: string | null;
  created_at: string;
};

export type Medicine = {
  id: string;
  member_id: string;
  name: string;
  dosage: string | null;
  timing: string;
  frequency: string | null;
  food_instruction: string | null;
  is_active: boolean;
  created_at: string;
};

export type MedicineLog = {
  id: string;
  medicine_id: string;
  member_id: string;
  status: 'taken' | 'skipped';
  log_time: string;
  notes: string | null;
};

export type MedicineLogWithMedicine = MedicineLog & {
  medicines: Pick<Medicine, 'name'> | null;
};

export type Vital = {
  id: string;
  member_id: string;
  type: 'bp' | 'sugar' | 'temperature' | 'weight' | 'pulse';
  value_1: string;
  value_2: string | null;
  context: string | null;
  recorded_at: string;
  notes: string | null;
};

export type MedicineWithMember = Medicine & {
  family_members: Pick<FamilyMember, 'id' | 'name'> | null;
};
