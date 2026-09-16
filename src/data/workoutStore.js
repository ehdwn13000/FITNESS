import { supabase } from "./supabaseClient";

const SESSION_SELECT =
  "*, workout_exercises(*, exercises(id, name, body_part, equipment_type), workout_sets(*))";

export async function listSessions(limit = 30) {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(SESSION_SELECT)
    .order("performed_at", { ascending: false })
    .order("created_at", { ascending: false, foreignTable: "workout_exercises" })
    .limit(limit);

  if (error) {
    console.error("운동 기록을 불러오지 못했습니다", error);
    return [];
  }

  return data.map(normalizeSession);
}

function normalizeSession(session) {
  return {
    ...session,
    workout_exercises: (session.workout_exercises || [])
      .map((ex) => ({
        ...ex,
        workout_sets: (ex.workout_sets || []).sort((a, b) => a.set_index - b.set_index),
      }))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
  };
}

export async function createSession({ performed_at, notes }) {
  const { data, error } = await supabase
    .from("workout_sessions")
    .insert({ performed_at, notes: notes || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSession(id, updates) {
  const { error } = await supabase.from("workout_sessions").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteSession(id) {
  const { error } = await supabase.from("workout_sessions").delete().eq("id", id);
  if (error) throw error;
}

export async function addExerciseToSession(sessionId, exerciseId, notes) {
  const { data, error } = await supabase
    .from("workout_exercises")
    .insert({ session_id: sessionId, exercise_id: exerciseId, notes: notes || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExercise(id) {
  const { error } = await supabase.from("workout_exercises").delete().eq("id", id);
  if (error) throw error;
}

export async function addSet(exerciseEntryId, { set_index, weight_kg, reps }) {
  const { data, error } = await supabase
    .from("workout_sets")
    .insert({ exercise_id: exerciseEntryId, set_index, weight_kg, reps })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSet(id, updates) {
  const { error } = await supabase.from("workout_sets").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteSet(id) {
  const { error } = await supabase.from("workout_sets").delete().eq("id", id);
  if (error) throw error;
}

export async function getPreviousEntry(exerciseId, excludeEntryId) {
  const { data, error } = await supabase
    .from("workout_exercises")
    .select("id, workout_sessions(performed_at), workout_sets(weight_kg, reps)")
    .eq("exercise_id", exerciseId)
    .neq("id", excludeEntryId)
    .order("performed_at", { ascending: false, foreignTable: "workout_sessions" })
    .limit(1);

  if (error) {
    console.error("이전 기록을 불러오지 못했습니다", error);
    return null;
  }

  const entry = data?.[0];
  if (!entry || !entry.workout_sessions) return null;

  return { date: entry.workout_sessions.performed_at, sets: entry.workout_sets };
}

export async function getExerciseProgress(exerciseId) {
  const { data, error } = await supabase
    .from("workout_exercises")
    .select("id, workout_sessions(performed_at), workout_sets(weight_kg, reps, set_index)")
    .eq("exercise_id", exerciseId)
    .order("performed_at", { ascending: true, foreignTable: "workout_sessions" });

  if (error) {
    console.error("진행 추이를 불러오지 못했습니다", error);
    return [];
  }

  return data
    .filter((entry) => entry.workout_sessions)
    .map((entry) => ({
      date: entry.workout_sessions.performed_at,
      sets: [...entry.workout_sets].sort((a, b) => a.set_index - b.set_index),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}
