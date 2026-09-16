import { useEffect, useState } from "react";
import { useExerciseCatalog } from "../../context/ExerciseCatalogContext";
import { getExerciseProgress } from "../../data/workoutStore";
import { formatDate } from "../../utils/date";

export default function ExerciseProgressView() {
  const { exercises } = useExerciseCatalog();
  const [exerciseId, setExerciseId] = useState("");
  const [progress, setProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!exerciseId) {
      setProgress([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    getExerciseProgress(exerciseId).then((data) => {
      if (cancelled) return;
      setProgress(data);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  const grouped = groupByBodyPart(exercises);

  return (
    <div className="progress-view">
      <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
        <option value="">종목 선택</option>
        {Object.entries(grouped).map(([part, list]) => (
          <optgroup key={part} label={part}>
            {list.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {isLoading && <p className="placeholder">불러오는 중...</p>}

      {!isLoading && exerciseId && progress.length === 0 && (
        <p className="placeholder">이 종목의 기록이 아직 없습니다</p>
      )}

      {!isLoading && progress.length > 0 && (
        <div className="progress-list">
          {progress.map((entry, i) => {
            const maxWeight = Math.max(...entry.sets.map((s) => s.weight_kg));
            return (
              <div key={i} className="progress-row">
                <span className="progress-date">{formatDate(entry.date)}</span>
                <span className="progress-sets">
                  {entry.sets.map((s) => `${s.weight_kg}kg×${s.reps}`).join(", ")}
                </span>
                <span className="progress-max">최고 {maxWeight}kg</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function groupByBodyPart(exercises) {
  return exercises.reduce((acc, ex) => {
    (acc[ex.body_part] ??= []).push(ex);
    return acc;
  }, {});
}
