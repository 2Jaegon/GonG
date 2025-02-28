"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { auth } from "@/lib/firebase";

const exchangeRate = process.env.EXCHANGE_RATE ? parseFloat(process.env.EXCHANGE_RATE) : 1300;

const plans = {
  free: { name: "무료 플랜", price: 0 },
  pro: { name: "PRO 플랜", price: 9900 },
  premium: { name: "PREMIUM 플랜", price: 19900 },
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "free";
  const [plan, setPlan] = useState(plans.free);
  const user = auth.currentUser;

  useEffect(() => {
    if (plans[planId]) {
      setPlan(plans[planId]);
    }
  }, [planId]);

  const handleSubscription = async (selectedPlan: string) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, plan: selectedPlan }),
      });

      if (!response.ok) {
        throw new Error("구독 정보 저장 실패");
      }

      alert(`${plans[selectedPlan].name} 구독이 완료되었습니다!`);
      router.push("/");
    } catch (err) {
      console.error("🚨 구독 상태 저장 오류:", err);
      alert("❌ 구독 상태를 저장하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#121212", color: "#ffffff" }}>
        <div style={{ maxWidth: "500px", textAlign: "center", padding: "20px", backgroundColor: "#1e1e1e", borderRadius: "10px" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#00c3ff" }}>결제하기</h1>
          <p style={{ fontSize: "18px", marginBottom: "10px", color: "#fff" }}>{plan.name}</p>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#00c3ff" }}>{plan.price === 0 ? "무료" : `₩${plan.price.toLocaleString()} / 월`}</p>

          {/* PayPal 결제 버튼 */}
          {plan.price > 0 ? (
            <div style={{ marginTop: "20px" }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: (plan.price / exchangeRate).toFixed(2), // ✅ 환율 변수 활용
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order?.capture().then(() => handleSubscription(planId));
                }}
              />
            </div>
          ) : (
            <button
              onClick={() => handleSubscription("free")}
              style={{ padding: "10px", width: "100%", backgroundColor: "#00c3ff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "20px" }}
            >
              무료 플랜으로 계속하기
            </button>
          )}

          {/* 돌아가기 버튼 */}
          <button
            onClick={() => router.push("/plans")}
            style={{ padding: "10px", width: "100%", backgroundColor: "#444", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}
          >
            플랜 선택으로 돌아가기
          </button>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
