import { supabase } from "./supabaseClient";

const TABLE = "exercises";

export async function listExercises() {
  const { data, error } = await supabase.from(TABLE).select("*").order("body_part").order("name");
  if (error) {
    console.error("종목 목록을 불러오지 못했습니다", error);
    return [];
  }
  return data;
}

export async function addExercise({ name, equipment_type, body_part }) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ name, equipment_type, body_part, is_custom: true })
    .select()
    .single();
  if (error) {
    console.error("종목을 추가하지 못했습니다", error);
    throw error;
  }
  return data;
}
