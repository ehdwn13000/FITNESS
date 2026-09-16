// Epley 공식: 무게×횟수가 다른 세트끼리도 "1회 최대 중량 기준"으로 비교할 수 있게 환산
export function estimatedOneRepMax(weightKg, reps) {
  if (!weightKg || !reps) return 0;
  if (reps === 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

export function bestSet(sets) {
  if (!sets || sets.length === 0) return null;
  return sets.reduce((best, s) => {
    if (!best) return s;
    return estimatedOneRepMax(s.weight_kg, s.reps) > estimatedOneRepMax(best.weight_kg, best.reps) ? s : best;
  }, null);
}

export function totalVolume(sets) {
  return (sets || []).reduce((sum, s) => sum + s.weight_kg * s.reps, 0);
}

export function roundKg(value) {
  return Math.round(value * 10) / 10;
}
