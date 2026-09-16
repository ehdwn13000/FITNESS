import { useState } from "react";
import { useInBody } from "../../context/InBodyContext";
import PhotoCapture from "./PhotoCapture";
import InBodyForm from "./InBodyForm";
import InBodyHistoryList from "./InBodyHistoryList";

export default function InBodyTab() {
  const { addRecord } = useInBody();
  const [view, setView] = useState("log");
  const [ocrResult, setOcrResult] = useState(undefined); // undefined = 촬영 단계, null = 수동입력, object = OCR 결과

  function handleSave(record) {
    addRecord(record);
    setOcrResult(undefined);
    setView("history");
  }

  return (
    <div className="inbody-tab">
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
          className={view === "history" ? "sub-tab active" : "sub-tab"}
          onClick={() => setView("history")}
        >
          히스토리
        </button>
      </div>

      {view === "log" ? (
        ocrResult === undefined ? (
          <PhotoCapture onResult={setOcrResult} />
        ) : (
          <InBodyForm initial={ocrResult} mode="new" onSave={handleSave} onCancel={() => setOcrResult(undefined)} />
        )
      ) : (
        <InBodyHistoryList />
      )}
    </div>
  );
}
