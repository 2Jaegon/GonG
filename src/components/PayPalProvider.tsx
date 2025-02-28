"use client"; // ✅ 클라이언트 컴포넌트로 설정

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "", // ✅ 환경 변수에서 가져오기
  currency: "USD",
  intent: "capture",
};

export default function PayPalProvider({ children }: { children: React.ReactNode }) {
  return <PayPalScriptProvider options={initialOptions}>{children}</PayPalScriptProvider>;
}
