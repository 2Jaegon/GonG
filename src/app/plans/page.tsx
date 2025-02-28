"use client";

import { useRouter } from "next/navigation";

const plans = [
  {
    id: "free",
    title: "무료 플랜",
    price: "₩0",
    description: "DeepL 무료 API를 사용하여 드래그한 내용만 번역 가능",
    features: ["드래그한 부분만 번역", "기본 번역 품질", "무료 사용"],
    buttonText: "현재 플랜",
    buttonDisabled: true,
  },
  {
    id: "pro",
    title: "PRO 플랜",
    price: "₩9,900 / 월",
    description: "DeepL 유료 API를 사용하여 더 좋은 번역 품질 제공",
    features: ["드래그한 내용 더 좋게 번역", "글자수 제한 해제", "월 정액제"],
    buttonText: "플랜 선택",
    buttonDisabled: false,
  },
  {
    id: "premium",
    title: "PREMIUM 플랜",
    price: "₩19,900 / 월",
    description: "DeepL 유료 + OpenAI API로 번역 품질 + 요약 기능 제공",
    features: ["더 좋은 번역 품질", "번역 내용 분석 및 요약", "월 정액제"],
    buttonText: "플랜 선택",
    buttonDisabled: false,
  },
];

export default function PlansPage() {
  const router = useRouter();

  const handlePlanSelect = (planId: string) => {
    router.push(`/checkout?plan=${planId}`);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#121212", color: "#ffffff" }}>
      <div style={{ maxWidth: "900px", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "20px", color: "#00c3ff" }}>플랜 선택</h1>
        <p style={{ marginBottom: "30px", fontSize: "14px", color: "#bbb" }}>
          더 나은 번역 품질을 위해 PRO 또는 PREMIUM 플랜을 선택하세요.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{ flex: 1, padding: "20px", borderRadius: "10px", backgroundColor: "#222", border: "2px solid #00c3ff" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "10px", color: "#fff" }}>{plan.title}</h2>
              <p style={{ fontSize: "16px", marginBottom: "10px", color: "#ddd" }}>{plan.price}</p>
              <p style={{ fontSize: "12px", marginBottom: "10px", color: "#bbb" }}>{plan.description}</p>
              <ul style={{ textAlign: "left", fontSize: "12px", color: "#bbb", paddingLeft: "15px", marginBottom: "20px" }}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={{ marginBottom: "5px" }}>✔ {feature}</li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanSelect(plan.id)}
                disabled={plan.buttonDisabled}
                style={{
                  padding: "10px",
                  width: "100%",
                  backgroundColor: plan.buttonDisabled ? "#666" : "#00c3ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: plan.buttonDisabled ? "not-allowed" : "pointer",
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
