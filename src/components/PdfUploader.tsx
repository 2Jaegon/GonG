import { useState } from "react";
import { useDropzone } from "react-dropzone";

// ✅ translations 객체의 타입을 명확하게 지정
const translations: Record<string, { uploadMessage: string }> = {
  KO: { uploadMessage: "📂 PDF 파일을 드래그하거나 클릭하여 업로드하세요" },
  EN: { uploadMessage: "📂 Drag or click to upload a PDF file" },
  JA: { uploadMessage: "📂 PDFファイルをドラッグまたはクリックしてアップロード" },
  ZH: { uploadMessage: "📂 拖动或点击上传PDF文件" },
  FR: { uploadMessage: "📂 Faites glisser ou cliquez pour télécharger un fichier PDF" },
  DE: { uploadMessage: "📂 Ziehen oder klicken Sie, um eine PDF-Datei hochzuladen" },
  ES: { uploadMessage: "📂 Arrastra o haz clic para subir un archivo PDF" },
};

export default function PdfUploader({ onUpload, language }: { onUpload: (file: File) => void; language: keyof typeof translations }) {
  const [fileName, setFileName] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFileName(file.name);
      onUpload(file);
    },
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-4 cursor-pointer bg-gray-800 text-white text-center">
      <input {...getInputProps()} />
      {fileName ? <p>📄 {fileName}</p> : <p>{translations[language]?.uploadMessage || translations.KO.uploadMessage}</p>}
    </div>
  );
}
