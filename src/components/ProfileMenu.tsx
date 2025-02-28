"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ProfileMenu({ user }: { user: any }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  return (
    <div style={{ position: "relative", cursor: "pointer" }}>
      {/* ✅ 프로필 아이콘 (이미지 or 첫 글자) */}
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "#00c3ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
          color: "white",
          overflow: "hidden",
        }}
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          user?.displayName ? user.displayName[0].toUpperCase() : "U"
        )}
      </div>

      {/* ✅ 드롭다운 메뉴 */}
      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            right: "0px",
            backgroundColor: "#1e1e1e",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000, // ✅ PDF 뷰어보다 위로 설정
            width: "160px",
          }}
        >
          {/* 사용자 정보 표시 */}
          <p style={{ color: "white", fontSize: "14px", marginBottom: "5px" }}>
            {user?.displayName || "사용자"}
          </p>
          <p style={{ color: "gray", fontSize: "12px", marginBottom: "10px" }}>
            {user?.email}
          </p>

          {/* ✅ 플랜 보기 버튼 */}
          <button
            onClick={() => router.push("/plans")}
            style={{
              backgroundColor: "#00c3ff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "7px 10px",
              cursor: "pointer",
              width: "100%",
              marginBottom: "5px",
              fontSize: "14px",
            }}
          >
            플랜 보기
          </button>

          {/* ✅ 로그아웃 버튼 */}
          <button
            onClick={() => signOut(auth)}
            style={{
              backgroundColor: "#ff4b4b",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "7px 10px",
              cursor: "pointer",
              width: "100%",
              fontSize: "14px",
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
