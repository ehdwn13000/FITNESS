import { useState } from "react";
import { todayISODate } from "../../utils/date";

const FIELDS = [
  { key: "weight_kg", label: "체중 (kg)" },
  { key: "skeletal_muscle_mass_kg", label: "골격근량 (kg)" },
  { key: "body_fat_mass_kg", label: "체지방량 (kg)" },
  { key: "body_fat_percent", label: "체지방률 (%)" },
  { key: "bmi", label: "BMI" },
  { key: "inbody_score", label: "인바디 점수" },
];

export default function InBodyForm({ initial, mode = "new", onSave, onCancel }) {
  const [measuredAt, setMeasuredAt] = useState(initial?.measured_at || todayISODate());
  const [values, setValues] = useState(() =>
    FIELDS.reduce((acc, f) => {
      const v = initial?.[f.key];
      acc[f.key] = v != null ? String(v) : "";
      return acc;
    }, {})
  );
  const [showRaw, setShowRaw] = useState(false);

  const isOcrAttempt = mode === "new" && Array.isArray(initial?.matchedKeys);
  const matchedKeys = initial?.matchedKeys || [];

  function handleChange(key, value) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const record = { measured_at: measuredAt, raw_ocr_text: initial?.rawText ?? initial?.raw_ocr_text ?? null };
    for (const f of FIELDS) {
      const raw = values[f.key];
      record[f.key] = raw === "" ? null : parseFloat(raw);
    }
    onSave(record);
  }

  return (
    <form className="inbody-form" onSubmit={handleSubmit}>
      <label className="inbody-field">
        <span>측정일</span>
        <input type="date" value={measuredAt} onChange={(e) => setMeasuredAt(e.target.value)} required />
      </label>

      {FIELDS.map((f) => {
        const matched = matchedKeys.includes(f.key);
        return (
          <label key={f.key} className="inbody-field">
            <span>
              {f.label}
              {isOcrAttempt && matched && <span className="ocr-badge">OCR 인식됨</span>}
              {isOcrAttempt && !matched && <span className="ocr-badge missing">직접 입력 필요</span>}
            </span>
            <input
              type="number"
              step="0.1"
              value={values[f.key]}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={isOcrAttempt && !matched ? "값을 찾지 못했습니다" : ""}
            />
          </label>
        );
      })}

      {(initial?.rawText || initial?.raw_ocr_text) && (
        <div className="raw-ocr-toggle">
          <button type="button" onClick={() => setShowRaw((s) => !s)}>
            {showRaw ? "원본 인식 텍스트 숨기기" : "원본 인식 텍스트 보기"}
          </button>
          {showRaw && <pre className="raw-ocr-text">{initial.rawText ?? initial.raw_ocr_text}</pre>}
        </div>
      )}

      <div className="inbody-form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="save-btn">
          저장
        </button>
      </div>
    </form>
  );
}
