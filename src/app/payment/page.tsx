"use client";

import { useState } from "react";
import PayPalButton from "@/components/PayPalButton";

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("10"); // 기본 가격 10달러
  const [isPaid, setIsPaid] = useState(false);

  const handleSuccess = (details: any) => {
    console.log("✅ 결제 성공:", details);
    setIsPaid(true);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", color: "white", backgroundColor: "#121212", minHeight: "100vh" }}>
      <h1>🔹 플랜 선택</h1>
      <select
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", margin: "10px" }}
      >
        <option value="10">유료 버전 1 - $10</option>
        <option value="20">유료 버전 2 - $20</option>
      </select>

      <div style={{ marginTop: "20px" }}>
        {isPaid ? (
          <h2>✅ 결제가 완료되었습니다!</h2>
        ) : (
          <PayPalButton amount={selectedPlan} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
