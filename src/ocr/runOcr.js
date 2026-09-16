import { resizeImageFile } from "../utils/image";

export async function runOcr(file, onProgress) {
  const { createWorker } = await import("tesseract.js");
  const resized = await resizeImageFile(file);

  const worker = await createWorker(["kor", "eng"], undefined, {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  try {
    const { data } = await worker.recognize(resized);
    return data.text;
  } finally {
    await worker.terminate();
  }
}
