import { useMemo, useState } from "react";
import { useExerciseCatalog } from "../../context/ExerciseCatalogContext";

const BODY_PARTS = ["전체", "가슴", "등", "하체", "어깨", "팔", "코어"];
const EQUIPMENT_TYPES = ["머신", "프리웨이트", "맨몸"];

export default function ExercisePicker({ onPick, onCancel }) {
  const { exercises, addExercise } = useExerciseCatalog();
  const [bodyPart, setBodyPart] = useState("전체");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEquipment, setNewEquipment] = useState("프리웨이트");
  const [newBodyPart, setNewBodyPart] = useState("가슴");

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      if (bodyPart !== "전체" && ex.body_part !== bodyPart) return false;
      if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [exercises, bodyPart, search]);

  async function handleAddNew() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const created = await addExercise({ name: trimmed, equipment_type: newEquipment, body_part: newBodyPart });
    onPick(created.id);
  }

  return (
    <div className="exercise-picker">
      <div className="exercise-picker-filters">
        {BODY_PARTS.map((part) => (
          <button
            key={part}
            type="button"
            className={bodyPart === part ? "filter-chip active" : "filter-chip"}
            onClick={() => setBodyPart(part)}
          >
            {part}
          </button>
        ))}
      </div>
      <input
        className="exercise-search"
        placeholder="종목 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="exercise-picker-list">
        {filtered.map((ex) => (
          <button key={ex.id} type="button" className="exercise-option" onClick={() => onPick(ex.id)}>
            <span>{ex.name}</span>
            <span className="exercise-option-meta">{ex.equipment_type}</span>
          </button>
        ))}
        {filtered.length === 0 && !showAddForm && <p className="placeholder">검색 결과가 없습니다</p>}
      </div>

      {!showAddForm && (
        <button
          type="button"
          className="add-exercise-btn"
          onClick={() => {
            setShowAddForm(true);
            setNewName(search);
          }}
        >
          + 새 종목 추가
        </button>
      )}

      {showAddForm && (
        <div className="add-exercise-form">
          <input placeholder="종목 이름" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <select value={newEquipment} onChange={(e) => setNewEquipment(e.target.value)}>
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select value={newBodyPart} onChange={(e) => setNewBodyPart(e.target.value)}>
            {BODY_PARTS.filter((p) => p !== "전체").map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleAddNew} disabled={!newName.trim()}>
            추가하고 선택
          </button>
        </div>
      )}

      <button type="button" className="cancel-btn" onClick={onCancel}>
        취소
      </button>
    </div>
  );
}
