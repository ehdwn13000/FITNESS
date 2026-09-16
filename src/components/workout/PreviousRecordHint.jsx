import { useEffect, useState } from "react";
import { getPreviousEntry } from "../../data/workoutStore";
import { bestSet, estimatedOneRepMax, totalVolume, roundKg } from "../../utils/strength";
import { formatDate } from "../../utils/date";

export default function PreviousRecordHint({ exerciseId, excludeEntryId }) {
  const [previous, setPrevious] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    getPreviousEntry(exerciseId, excludeEntryId).then((data) => {
      if (!cancelled) setPrevious(data);
    });
    return () => {
      cancelled = true;
    };
  }, [exerciseId, excludeEntryId]);

  if (!previous) return null;

  const best = bestSet(previous.sets);
  if (!best) return null;

  const e1rm = roundKg(estimatedOneRepMax(best.weight_kg, best.reps));
  const volume = roundKg(totalVolume(previous.sets));

  return (
    <div className="previous-record-hint">
      지난번({formatDate(previous.date)}) 최고 {best.weight_kg}kg×{best.reps} · 추정1RM {e1rm}kg · 볼륨 {volume}kg
    </div>
  );
}
