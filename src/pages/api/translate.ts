import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.DEEPL_API_KEY || "";

const DEEPL_API_URL = API_KEY.startsWith("free-")
  ? "https://api-free.deepl.com/v2/translate"
  : "https://api.deepl.com/v2/translate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🚀 [API 호출됨]: /api/translate"); // ✅ API가 실행되는지 확인하는 로그

  if (req.method !== "POST") {
    console.error("❌ 잘못된 요청 방식 (GET 요청)");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    console.error("❌ 요청 파라미터 누락");
    return res.status(400).json({ error: "Missing text or target language" });
  }

  try {
    console.log("📨 [DeepL 요청]:", { text, targetLang, apiUrl: DEEPL_API_URL });

    const response = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        auth_key: API_KEY,
        text: text.toString(),
        target_lang: targetLang.toUpperCase(),
      }).toString(),
    });

    console.log("🔄 [응답 상태 코드]:", response.status);

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("🚨 [API 요청 실패]:", errorMessage);
      return res.status(response.status).json({ error: "Translation failed" });
    }

    const data = await response.json();
    console.log("✅ [번역 성공]:", data);

    return res.status(200).json({ translation: data.translations[0].text });

  } catch (error) {
    console.error("🚨 [서버 오류 발생]:", error);
    return res.status(500).json({ error: "Translation failed: Network error" });
  }
}
