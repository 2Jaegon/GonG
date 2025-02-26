import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text, targetLang } = req.body;
  const API_KEY = process.env.DEEPL_API_KEY; // ✅ 환경 변수에서 API 키 로드

  if (!API_KEY) {
    console.error("🚨 DeepL API 키가 없습니다.");
    return res.status(500).json({ error: "DeepL API 키가 설정되지 않았습니다." });
  }

  console.log("📨 DeepL API 요청:", { text, targetLang });

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
      }),
    });

    console.log("🔄 응답 상태 코드:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🚨 DeepL API 요청 실패:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log("✅ 번역 결과:", data);

    return res.status(200).json({ translation: data.translations[0].text });

  } catch (error) {
    console.error("🚨 번역 요청 중 오류 발생:", error);
    return res.status(500).json({ error: "Translation failed: Network error" });
  }
}
