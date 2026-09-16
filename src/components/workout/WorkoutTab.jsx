import { useState } from "react";
import { useWorkout } from "../../context/WorkoutContext";
import SessionCard from "./SessionCard";
import ExerciseProgressView from "./ExerciseProgressView";

export default function WorkoutTab() {
  const { sessions, isLoading, createSession } = useWorkout();
  const [view, setView] = useState("log");

  if (isLoading) return <p className="placeholder">불러오는 중...</p>;

  return (
    <div className="workout-tab">
      <div className="sub-tabs">
        <button
          type="button"
          className={view === "log" ? "sub-tab active" : "sub-tab"}
          onClick={() => setView("log")}
        >
          기록
        </button>
        <button
          type="button"
          className={view === "progress" ? "sub-tab active" : "sub-tab"}
          onClick={() => setView("progress")}
        >
          진행 추이
        </button>
      </div>

      {view === "log" ? (
        <>
          <button type="button" className="new-session-btn" onClick={() => createSession(null)}>
            + 새 운동 세션 시작
          </button>
          {sessions.length === 0 && <p className="placeholder">아직 기록이 없습니다</p>}
          <div className="session-list">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </>
      ) : (
        <ExerciseProgressView />
      )}
    </div>
  );
}
