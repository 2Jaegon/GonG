import type { NextApiRequest, NextApiResponse } from "next";

const DEEPL_API_URL = process.env.DEEPL_API_KEY.startsWith("free-")
  ? "https://api-free.deepl.com/v2/translate"
  : "https://api.deepl.com/v2/translate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    console.error("❌ Missing text or target language");
    return res.status(400).json({ error: "Missing text or target language" });
  }

  try {
    console.log("📨 DeepL API 요청:", { text, targetLang, apiUrl: DEEPL_API_URL });

    const response = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
      }),
    });

    console.log("🔄 응답 상태 코드:", response.status);

    if (!response.ok) {
      console.error("🚨 API 요청 실패:", await response.text());
      return res.status(500).json({ error: "Translation failed" });
    }

    const data = await response.json();
    console.log("✅ 번역 결과:", data);

    return res.status(200).json({ translation: data.translations[0].text });

  } catch (error) {
    console.error("🚨 번역 요청 중 오류 발생:", error);
    return res.status(500).json({ error: "Translation failed: Network error" });
  }
}
