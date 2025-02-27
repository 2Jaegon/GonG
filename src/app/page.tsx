"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import PdfUploader from "@/components/PdfUploader";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

if (typeof window !== "undefined" && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}
const translations: Record<string, { 
  errorTranslation: string; 
  networkError: string; 
  defaultTranslation: string; 
  selectText: string; 
  dragText: string; 
  translatedText: string; 
  translating: string; 
  translateButton: string; 
}> = {
  KO: {
    errorTranslation: "번역 실패",
    networkError: "번역 실패: 네트워크 오류",
    defaultTranslation: "번역 결과가 여기에 표시됩니다.",
    selectText: "🔍 선택한 텍스트:",
    dragText: "PDF에서 번역할 텍스트를 드래그하세요.",
    translatedText: "🎯 번역된 텍스트:",
    translating: "⏳ 번역 중...",
    translateButton: "번역하기",
  },
  EN: {
    errorTranslation: "Translation failed",
    networkError: "Translation failed: network error",
    defaultTranslation: "The translation results will be displayed here.",
    selectText: "🔍 Selected text:",
    dragText: "Drag the text you want to translate from the PDF.",
    translatedText: "🎯 Translated text:",
    translating: "⏳ Translating...",
    translateButton: "Translate",
  },
  JA: {
    errorTranslation: "翻訳に失敗しました",
    networkError: "翻訳に失敗しました: ネットワークエラー",
    defaultTranslation: "翻訳結果がここに表示されます。",
    selectText: "🔍 選択したテキスト:",
    dragText: "PDFから翻訳するテキストをドラッグしてください。",
    translatedText: "🎯 翻訳されたテキスト:",
    translating: "⏳ 翻訳中...",
    translateButton: "翻訳する",
  },
  ZH: {
    errorTranslation: "翻译失败",
    networkError: "翻译失败: 网络错误",
    defaultTranslation: "翻译结果将在此显示。",
    selectText: "🔍 选定的文本:",
    dragText: "从PDF中拖动要翻译的文本。",
    translatedText: "🎯 翻译后的文本:",
    translating: "⏳ 翻译中...",
    translateButton: "翻译",
  },
  FR: {
    errorTranslation: "Échec de la traduction",
    networkError: "Échec de la traduction: erreur réseau",
    defaultTranslation: "Les résultats de la traduction seront affichés ici.",
    selectText: "🔍 Texte sélectionné:",
    dragText: "Faites glisser le texte que vous souhaitez traduire depuis le PDF.",
    translatedText: "🎯 Texte traduit:",
    translating: "⏳ Traduction en cours...",
    translateButton: "Traduire",
  },
  DE: {
    errorTranslation: "Übersetzung fehlgeschlagen",
    networkError: "Übersetzung fehlgeschlagen: Netzwerkfehler",
    defaultTranslation: "Die Übersetzungsergebnisse werden hier angezeigt.",
    selectText: "🔍 Ausgewählter Text:",
    dragText: "Ziehen Sie den zu übersetzenden Text aus der PDF-Datei.",
    translatedText: "🎯 Übersetzter Text:",
    translating: "⏳ Übersetzung läuft...",
    translateButton: "Übersetzen",
  },
  ES: {
    errorTranslation: "Fallo en la traducción",
    networkError: "Fallo en la traducción: error de red",
    defaultTranslation: "Los resultados de la traducción se mostrarán aquí.",
    selectText: "🔍 Texto seleccionado:",
    dragText: "Arrastra el texto que deseas traducir desde el PDF.",
    translatedText: "🎯 Texto traducido:",
    translating: "⏳ Traduciendo...",
    translateButton: "Traducir",
  },
};

export default function Home() {
  const [user, setUser] = useState<any | null | undefined>(undefined);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [targetLang, setTargetLang] = useState<string>("KO");
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleUpload = (file: File) => {
    // setUploadedFile(file);
    setPdfUrl(URL.createObjectURL(file));
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection) {
      setSelectedText(selection.toString());
    }
  };

  const translateText = async () => {
    if (!selectedText) return;
    setLoading(true);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText, targetLang }),
      });
    
      const data = await response.json();
      setTranslatedText(data.translation || translations[targetLang].errorTranslation);
    } catch (error) {
      console.error(error);  // ✅ ESLint 오류 방지
      setTranslatedText(translations[targetLang].networkError);
    }    
    setLoading(false);
  };


  // ✅ Google 로그인 함수
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("구글 로그인 실패:", error);
    }
  };

  // 🔹 유저 정보가 확인되지 않으면 로딩 UI 표시
  if (user === undefined) {
    return <h2 style={{ color: "white", textAlign: "center" }}>로딩 중...</h2>;
  }

 // 🔹 로그인되지 않았다면 로그인 UI 표시
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <h2 style={{ color: "white", marginBottom: "20px" }}>Google 로그인 후 이용하세요</h2>
        <button
          onClick={signInWithGoogle}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Google 로그인
        </button>
      </div>
    );
  }


  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#121212", color: "#ffffff" }}>
    {/* 우측 상단 프로필 아이콘 */}
    <div style={{ position: "absolute", top: "6px", right: "6px", cursor: "pointer" }}>
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          backgroundColor: "#00c3ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        {user.displayName ? user.displayName[0].toUpperCase() : "U"}
      </div>

      {/* 프로필 드롭다운 (로그아웃 포함) */}
    {dropdownOpen && (
      <div
        style={{
          position: "absolute",
          top: "50px",
          right: "10px",
          backgroundColor: "#1e1e1e",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,  // ✅ PDF 뷰어보다 위로 설정
        }}
      >
        <p style={{ color: "white", marginBottom: "5px" }}>
          {user?.displayName || "사용자"}
        </p>
        <p style={{ color: "gray", fontSize: "12px", marginBottom: "10px" }}>
          {user?.email}
        </p>
        <button
          onClick={() => signOut(auth)}
          style={{
            backgroundColor: "#ff4b4b",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          로그아웃
        </button>
      </div>
    )}
    </div>
  
      {/* 왼쪽 UI */}
      <div
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "20px",
          borderRight: "2px solid #333",
          backgroundColor: "#1e1e1e",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#00c3ff" }}>Gon.G</h2>
          <select
            style={{
              padding: "5px",
              backgroundColor: "#333",
              color: "#ffffff",
              border: "1px solid #ffffff",
              borderRadius: "5px",
            }}
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="KO">한국어</option>
            <option value="EN">English</option>
            <option value="JA">日本語</option>
            <option value="ZH">中文</option>
            <option value="FR">Français</option>
            <option value="DE">Deutsch</option>
            <option value="ES">Español</option>
          </select>
        </div>
  
        {/* 선택한 텍스트 박스 */}
        <div
          style={{
            border: "2px solid #00c3ff",
            borderRadius: "8px",
            padding: "10px",
            flexGrow: "3",
            height: "35%",
            backgroundColor: "#222",
            marginBottom: "10px",
            overflowY: "auto",
          }}
        >
          <h4>{translations[targetLang].selectText}</h4>
          <p>{selectedText || translations[targetLang].dragText}</p>
        </div>
  
        {/* 번역된 텍스트 박스 */}
        <div
          style={{
            border: "2px solid #28a745",
            borderRadius: "8px",
            padding: "10px",
            flexGrow: "5",
            height: "55%",
            backgroundColor: "#222",
            marginBottom: "10px",
            overflowY: "auto",
          }}
        >
          <h4>{translations[targetLang].translatedText}</h4>
          {loading ? <p>{translations[targetLang].translating}</p> : <p>{translatedText || translations[targetLang].defaultTranslation}</p>}
        </div>
  
        {/* 번역 버튼 */}
        <button
          onClick={translateText}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#00c3ff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          {translations[targetLang].translateButton}
        </button>
  
        {/* PDF 업로드 UI */}
        <div>
          <div
            style={{
              border: "2px dashed #00c3ff",
              padding: "15px",
              cursor: "pointer",
              textAlign: "center",
              fontSize: "12px",
              borderRadius: "6px",
              backgroundColor: "#222",
              color: "#ffffff",
            }}
          >
            <PdfUploader onUpload={handleUpload} language={targetLang} />
          </div>
        </div>
      </div>
  
      {/* 오른쪽 (PDF 뷰어) */}
      <div
        style={{
          width: "70%",
          padding: "20px",
          backgroundColor: "#121212",
          height: "100vh",
          overflow: "hidden",
        }}
        onMouseUp={handleMouseUp}
      >
        {pdfUrl ? (
          <div style={{ border: "1px solid #00c3ff", padding: "10px", height: "100%", backgroundColor: "#1e1e1e" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfUrl} />
            </Worker>
          </div>
        ) : null}
      </div>
    </div>
  );
  
}
