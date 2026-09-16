import { useState } from "react";
import { useWorkout } from "../../context/WorkoutContext";
import { confirmDelete } from "../../utils/confirm";
import { formatDate } from "../../utils/date";
import ExerciseEntryCard from "./ExerciseEntryCard";
import ExercisePicker from "./ExercisePicker";

export default function SessionCard({ session }) {
  const { updateSessionNotes, deleteSession, addExerciseToSession } = useWorkout();
  const [notes, setNotes] = useState(session.notes || "");
  const [showPicker, setShowPicker] = useState(false);

  function commitNotes() {
    if (notes !== (session.notes || "")) updateSessionNotes(session.id, notes || null);
  }

  function handlePick(exerciseId) {
    addExerciseToSession(session.id, exerciseId);
    setShowPicker(false);
  }

  return (
    <div className="session-card">
      <div className="session-card-header">
        <span className="session-date">{formatDate(session.performed_at)}</span>
        <button
          type="button"
          className="icon-btn"
          title="세션 삭제"
          onClick={() => confirmDelete() && deleteSession(session.id)}
        >
          ✕
        </button>
      </div>
      <textarea
        className="session-notes"
        placeholder="메모 (선택)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={commitNotes}
      />
      {session.workout_exercises.map((entry) => (
        <ExerciseEntryCard key={entry.id} entry={entry} />
      ))}
      {showPicker ? (
        <ExercisePicker onPick={handlePick} onCancel={() => setShowPicker(false)} />
      ) : (
        <button type="button" className="add-exercise-btn" onClick={() => setShowPicker(true)}>
          + 종목 추가
        </button>
      )}
    </div>
  );
}
