"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function Auth({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(); // 로그인 성공 시 호출
    } catch (err) {
      setError("인증 실패! 이메일과 비밀번호를 확인하세요.");
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "auto", padding: "20px", backgroundColor: "#222", color: "#fff", borderRadius: "10px" }}>
      <h2>{isRegistering ? "회원가입" : "로그인"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#00c3ff", color: "#fff", border: "none", borderRadius: "5px" }}>
          {isRegistering ? "회원가입" : "로그인"}
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "10px", cursor: "pointer", color: "#00c3ff" }} onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "이미 계정이 있으신가요? 로그인" : "계정이 없으신가요? 회원가입"}
      </p>
    </div>
  );
}
