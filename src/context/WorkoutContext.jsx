import { createContext, useContext, useEffect, useState } from "react";
import * as workoutStore from "../data/workoutStore";
import { todayISODate } from "../utils/date";

const WorkoutContext = createContext(null);

export function WorkoutProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function refresh() {
    const data = await workoutStore.listSessions();
    setSessions(data);
  }

  useEffect(() => {
    let cancelled = false;
    workoutStore.listSessions().then((data) => {
      if (cancelled) return;
      setSessions(data);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function withSave(fn) {
    setIsSaving(true);
    try {
      await fn();
      await refresh();
    } finally {
      setIsSaving(false);
    }
  }

  function createSession(notes) {
    return withSave(() => workoutStore.createSession({ performed_at: todayISODate(), notes }));
  }

  function deleteSession(id) {
    return withSave(() => workoutStore.deleteSession(id));
  }

  function updateSessionNotes(id, notes) {
    return withSave(() => workoutStore.updateSession(id, { notes }));
  }

  function addExerciseToSession(sessionId, exerciseId) {
    return withSave(() => workoutStore.addExerciseToSession(sessionId, exerciseId));
  }

  function deleteExercise(id) {
    return withSave(() => workoutStore.deleteExercise(id));
  }

  function addSet(exerciseEntryId, nextSetIndex, { weight_kg, reps }) {
    return withSave(() => workoutStore.addSet(exerciseEntryId, { set_index: nextSetIndex, weight_kg, reps }));
  }

  function updateSet(id, updates) {
    return withSave(() => workoutStore.updateSet(id, updates));
  }

  function deleteSet(id) {
    return withSave(() => workoutStore.deleteSet(id));
  }

  const value = {
    sessions,
    isLoading,
    isSaving,
    createSession,
    deleteSession,
    updateSessionNotes,
    addExerciseToSession,
    deleteExercise,
    addSet,
    updateSet,
    deleteSet,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}
