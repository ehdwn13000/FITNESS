import { useState } from "react";
import { useWorkout } from "../../context/WorkoutContext";
import { confirmDelete } from "../../utils/confirm";

export default function SetRow({ set, index }) {
  const { updateSet, deleteSet } = useWorkout();
  const [weight, setWeight] = useState(String(set.weight_kg));
  const [reps, setReps] = useState(String(set.reps));

  function commitWeight() {
    const parsed = parseFloat(weight);
    if (!Number.isNaN(parsed) && parsed !== set.weight_kg) updateSet(set.id, { weight_kg: parsed });
    else setWeight(String(set.weight_kg));
  }

  function commitReps() {
    const parsed = parseInt(reps, 10);
    if (!Number.isNaN(parsed) && parsed !== set.reps) updateSet(set.id, { reps: parsed });
    else setReps(String(set.reps));
  }

  return (
    <div className="set-row">
      <span className="set-index">{index + 1}</span>
      <input
        className="set-input"
        type="number"
        inputMode="decimal"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        onBlur={commitWeight}
      />
      <span className="set-unit">kg</span>
      <span className="set-x">×</span>
      <input
        className="set-input"
        type="number"
        inputMode="numeric"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onBlur={commitReps}
      />
      <span className="set-unit">회</span>
      <button
        type="button"
        className="icon-btn"
        title="세트 삭제"
        onClick={() => confirmDelete() && deleteSet(set.id)}
      >
        ✕
      </button>
    </div>
  );
}
