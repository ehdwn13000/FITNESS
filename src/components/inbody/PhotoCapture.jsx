import { useState } from "react";
import { runOcr } from "../../ocr/runOcr";
import { parseInBodyText } from "../../ocr/parseInBodyText";

export default function PhotoCapture({ onResult }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  function handleFile(e) {
    const selected = e.target.files[0];
    e.target.value = "";
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError(null);
  }

  async function handleAnalyze() {
    if (!file) return;
    setProgress(0);
    setError(null);
    try {
      const text = await runOcr(file, setProgress);
      onResult(parseInBodyText(text));
    } catch (err) {
      console.error(err);
      setError("사진을 분석하지 못했습니다. 다시 시도하거나 직접 입력해주세요.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="photo-capture">
      {previewUrl && <img className="photo-preview" src={previewUrl} alt="InBody 결과지 미리보기" />}

      <div className="photo-capture-buttons">
        <label className="photo-btn">
          사진 촬영
          <input type="file" accept="image/*" capture="environment" hidden onChange={handleFile} />
        </label>
        <label className="photo-btn">
          갤러리에서 선택
          <input type="file" accept="image/*" hidden onChange={handleFile} />
        </label>
      </div>

      {file && progress === null && (
        <button type="button" className="analyze-btn" onClick={handleAnalyze}>
          분석하기
        </button>
      )}

      {progress !== null && (
        <div className="ocr-progress">
          <div className="ocr-progress-bar" style={{ width: `${progress}%` }} />
          <span>사진을 분석하는 중... {progress}%</span>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      <button type="button" className="skip-btn" onClick={() => onResult(null)}>
        사진 없이 직접 입력
      </button>
    </div>
  );
}
