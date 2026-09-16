import { useWorkout } from "../../context/WorkoutContext";
import { confirmDelete } from "../../utils/confirm";
import SetRow from "./SetRow";

export default function ExerciseEntryCard({ entry }) {
  const { addSet, deleteExercise } = useWorkout();
  const sets = entry.workout_sets;
  const exercise = entry.exercises;

  function handleAddSet() {
    const last = sets[sets.length - 1];
    const nextIndex = sets.length + 1;
    addSet(entry.id, nextIndex, {
      weight_kg: last ? last.weight_kg : 0,
      reps: last ? last.reps : 0,
    });
  }

  return (
    <div className="exercise-entry-card">
      <div className="exercise-entry-header">
        <span className="exercise-name">{exercise?.name ?? "(삭제된 종목)"}</span>
        {exercise && <span className="exercise-tag">{exercise.body_part}</span>}
        <button
          type="button"
          className="icon-btn"
          title="종목 삭제"
          onClick={() => confirmDelete() && deleteExercise(entry.id)}
        >
          ✕
        </button>
      </div>
      <div className="set-list">
        {sets.map((set, i) => (
          <SetRow key={set.id} set={set} index={i} />
        ))}
      </div>
      <button type="button" className="add-set-btn" onClick={handleAddSet}>
        + 세트 추가
      </button>
    </div>
  );
}
