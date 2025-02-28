import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Firebase 설정 (환경 변수에서 가져오기)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ✅ Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// ✅ Firestore 인스턴스 생성
const db = getFirestore(app);

// ✅ Firestore 오프라인 모드 활성화
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.error("📌 여러 개의 브라우저 탭에서 Firestore를 사용할 수 없습니다.");
  } else if (err.code === "unimplemented") {
    console.error("📌 현재 브라우저에서 Firestore 오프라인 모드가 지원되지 않습니다.");
  }
});

// ✅ Firebase 인증 객체 가져오기
const auth = getAuth(app);

export { db, auth };
