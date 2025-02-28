"use client"; // ✅ 클라이언트에서 실행

import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { auth } from "@/lib/firebase";

export default function SubscriptionButton() {
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = auth.currentUser;

  if (!user) {
    return <p style={{ color: "red" }}>로그인이 필요합니다.</p>;
  }

  const handleSubscription = async () => {
    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, plan: "pro" }), // ✅ 기본적으로 PRO 플랜 적용
      });

      if (!response.ok) {
        throw new Error("구독 정보 저장 실패");
      }

      setPaidFor(true);
      alert("✅ 구독 결제가 성공적으로 완료되었습니다!");
    } catch (err) {
      console.error("🚨 구독 상태 저장 오류:", err);
      setError("❌ 구독 상태를 저장하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      {paidFor ? (
        <p style={{ color: "green" }}>✅ 결제가 완료되었습니다!</p>
      ) : (
        <PayPalButtons
          style={{ layout: "vertical" }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: "P-XXXXXXXXXXX", // ✅ PayPal에서 생성한 구독 플랜 ID (수동으로 입력 필요)
            });
          }}
          onApprove={() => {
            handleSubscription(); // ✅ Firestore에 구독 상태 저장
          }}
          onError={(err) => {
            console.error("🚨 결제 오류 발생:", err);
            setError("❌ 결제 중 문제가 발생했습니다.");
          }}
        />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
