import { useState } from "react";
import { useInBody } from "../../context/InBodyContext";
import { confirmDelete } from "../../utils/confirm";
import { formatDate } from "../../utils/date";
import InBodyForm from "./InBodyForm";

function delta(current, previous) {
  if (current == null || previous == null) return null;
  const diff = Math.round((current - previous) * 10) / 10;
  if (diff === 0) return "-";
  return diff > 0 ? `+${diff}` : `${diff}`;
}

export default function InBodyRecordRow({ record, previous }) {
  const { updateRecord, deleteRecord } = useInBody();
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="inbody-record-row editing">
        <InBodyForm
          initial={record}
          mode="edit"
          onSave={(updates) => {
            updateRecord(record.id, updates);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="inbody-record-row">
      <button type="button" className="inbody-record-summary" onClick={() => setEditing(true)}>
        <span className="inbody-record-date">{formatDate(record.measured_at)}</span>
        <span className="inbody-record-metric">
          체중 {record.weight_kg ?? "-"}kg
          {previous && <span className="inbody-delta">{delta(record.weight_kg, previous.weight_kg)}</span>}
        </span>
        <span className="inbody-record-metric">
          체지방률 {record.body_fat_percent ?? "-"}%
          {previous && (
            <span className="inbody-delta">{delta(record.body_fat_percent, previous.body_fat_percent)}</span>
          )}
        </span>
        <span className="inbody-record-metric">골격근량 {record.skeletal_muscle_mass_kg ?? "-"}kg</span>
      </button>
      <button
        type="button"
        className="icon-btn"
        title="삭제"
        onClick={() => confirmDelete() && deleteRecord(record.id)}
      >
        ✕
      </button>
    </div>
  );
}
