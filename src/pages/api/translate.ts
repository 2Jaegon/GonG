import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, targetLang } = req.body;
  const apiKey = process.env.NEXT_PUBLIC_DEEPL_API_KEY;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "텍스트 또는 번역 언어가 제공되지 않았습니다." });
  }

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang.toUpperCase(),
      }),
    });

    const data = await response.json();
    res.status(200).json({ translation: data.translations[0].text });
  } catch (error) {
    res.status(500).json({ error: "번역 요청 실패" });
  }
}
