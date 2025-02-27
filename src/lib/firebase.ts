// Firebase 패키지 불러오기
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Firebase 환경변수 설정 (Firebase Console에서 복사한 값 넣기)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
