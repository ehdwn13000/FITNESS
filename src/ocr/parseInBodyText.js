const FIELD_DEFS = [
  { key: "weight_kg", keywords: ["체중", "몸무게", "weight"] },
  { key: "skeletal_muscle_mass_kg", keywords: ["골격근량", "골격근", "skeletal muscle", "smm"] },
  { key: "body_fat_mass_kg", keywords: ["체지방량", "body fat mass", "bfm"] },
  { key: "body_fat_percent", keywords: ["체지방률", "percent body fat", "pbf"] },
  { key: "bmi", keywords: ["bmi"] },
  { key: "inbody_score", keywords: ["인바디점수", "인바디 점수", "inbody score"] },
];

const NUMBER_RE = /\d{1,3}(?:\.\d{1,2})?/;

export function parseInBodyText(rawText) {
  const lines = (rawText || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const result = {
    weight_kg: null,
    skeletal_muscle_mass_kg: null,
    body_fat_mass_kg: null,
    body_fat_percent: null,
    bmi: null,
    inbody_score: null,
  };
  const matchedKeys = [];

  for (const { key, keywords } of FIELD_DEFS) {
    const value = findValueForKeywords(lines, keywords);
    if (value !== null) {
      result[key] = value;
      matchedKeys.push(key);
    }
  }

  return { ...result, matchedKeys, rawText: rawText || "" };
}

function findValueForKeywords(lines, keywords) {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase();
    const hit = lowerKeywords.find((k) => lowerLine.includes(k));
    if (!hit) continue;

    const afterKeyword = lines[i].slice(lowerLine.indexOf(hit) + hit.length);
    const sameLineMatch = afterKeyword.match(NUMBER_RE) || lines[i].match(NUMBER_RE);
    if (sameLineMatch) return parseFloat(sameLineMatch[0]);

    if (lines[i + 1]) {
      const nextLineMatch = lines[i + 1].match(NUMBER_RE);
      if (nextLineMatch) return parseFloat(nextLineMatch[0]);
    }
  }

  return null;
}
