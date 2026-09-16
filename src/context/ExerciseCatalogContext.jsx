import { createContext, useContext, useEffect, useState } from "react";
import { listExercises, addExercise as addExerciseToStore } from "../data/exerciseStore";

const ExerciseCatalogContext = createContext(null);

export function ExerciseCatalogProvider({ children }) {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listExercises().then((data) => {
      if (cancelled) return;
      setExercises(data);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function addExercise(fields) {
    const created = await addExerciseToStore(fields);
    setExercises((list) =>
      [...list, created].sort((a, b) => a.body_part.localeCompare(b.body_part) || a.name.localeCompare(b.name))
    );
    return created;
  }

  return (
    <ExerciseCatalogContext.Provider value={{ exercises, isLoading, addExercise }}>
      {children}
    </ExerciseCatalogContext.Provider>
  );
}

export function useExerciseCatalog() {
  const ctx = useContext(ExerciseCatalogContext);
  if (!ctx) throw new Error("useExerciseCatalog must be used within ExerciseCatalogProvider");
  return ctx;
}
