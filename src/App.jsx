import { useState } from "react";
import { ExerciseCatalogProvider } from "./context/ExerciseCatalogContext";
import { WorkoutProvider } from "./context/WorkoutContext";
import { InBodyProvider } from "./context/InBodyContext";
import WorkoutTab from "./components/workout/WorkoutTab";
import InBodyTab from "./components/inbody/InBodyTab";
import "./App.css";

const TABS = [
  { key: "workout", label: "운동 기록" },
  { key: "inbody", label: "InBody" },
];

function AppShell() {
  const [tab, setTab] = useState("workout");

  return (
    <div className="app">
      <header className="app-header">
        <h1>피트니스</h1>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={tab === t.key ? "tab active" : "tab"}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="app-main">
        {tab === "workout" && <WorkoutTab />}
        {tab === "inbody" && <InBodyTab />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ExerciseCatalogProvider>
      <WorkoutProvider>
        <InBodyProvider>
          <AppShell />
        </InBodyProvider>
      </WorkoutProvider>
    </ExerciseCatalogProvider>
  );
}

export default App;
