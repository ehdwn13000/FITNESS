import { useEffect, useState } from "react";
import { useExerciseCatalog } from "../../context/ExerciseCatalogContext";
import { getExerciseProgress } from "../../data/workoutStore";
import { bestSet, estimatedOneRepMax, totalVolume, roundKg } from "../../utils/strength";
import { formatDate } from "../../utils/date";
import LineChart from "../charts/LineChart";

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

      {!isLoading && progress.length >= 2 && (
        <>
          <div className="chart-card">
            <p className="chart-title">추정 1RM 추이</p>
            <LineChart
              unit="kg"
              data={progress.map((entry) => {
                const best = bestSet(entry.sets);
                return {
                  label: formatDate(entry.date),
                  value: best ? roundKg(estimatedOneRepMax(best.weight_kg, best.reps)) : 0,
                };
              })}
            />
          </div>
          <div className="chart-card">
            <p className="chart-title">총 볼륨 추이</p>
            <LineChart
              unit="kg"
              data={progress.map((entry) => ({
                label: formatDate(entry.date),
                value: roundKg(totalVolume(entry.sets)),
              }))}
            />
          </div>
        </>
      )}

      {!isLoading && progress.length > 0 && (
        <div className="progress-list">
          {progress.map((entry, i) => {
            const best = bestSet(entry.sets);
            const e1rm = best ? roundKg(estimatedOneRepMax(best.weight_kg, best.reps)) : null;
            const volume = roundKg(totalVolume(entry.sets));
            return (
              <div key={i} className="progress-row">
                <span className="progress-date">{formatDate(entry.date)}</span>
                <span className="progress-sets">
                  {entry.sets.map((s) => `${s.weight_kg}kg×${s.reps}`).join(", ")}
                </span>
                <span className="progress-stats">
                  {best && <span className="progress-e1rm">추정1RM {e1rm}kg</span>}
                  <span className="progress-volume">볼륨 {volume}kg</span>
                </span>
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
