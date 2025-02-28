import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();
    const API_KEY = process.env.DEEPL_API_KEY;

    if (!API_KEY) {
      console.error("🚨 DeepL API 키가 없습니다.");
      return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    console.log("📨 DeepL API 요청:", { text, targetLang });

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🚨 DeepL API 요청 실패:", errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    console.log("✅ 번역 결과:", data);

    return NextResponse.json({ translation: data.translations[0].text });
  } catch (error) {
    console.error("🚨 번역 요청 중 오류 발생:", error);
    return NextResponse.json({ error: "Translation failed: Network error" }, { status: 500 });
  }
}
