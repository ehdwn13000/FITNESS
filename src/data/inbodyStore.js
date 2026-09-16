import { supabase } from "./supabaseClient";

const TABLE = "inbody_records";

export async function listRecords() {
  const { data, error } = await supabase.from(TABLE).select("*").order("measured_at", { ascending: false });
  if (error) {
    console.error("InBody 기록을 불러오지 못했습니다", error);
    return [];
  }
  return data;
}

export async function addRecord(record) {
  const { data, error } = await supabase.from(TABLE).insert(record).select().single();
  if (error) throw error;
  return data;
}

export async function updateRecord(id, updates) {
  const { error } = await supabase.from(TABLE).update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteRecord(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
