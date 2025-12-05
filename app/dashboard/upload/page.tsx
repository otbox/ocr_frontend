// app/(dashboard)/upload/page.tsx
"use client";

import { useState, useRef } from "react";
import { uploadFile } from "@/app/libs/auth/api";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFileChange(selectedFile: File | null) {
    if (!selectedFile) return;

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Tipo de arquivo inválido. Use JPEG, PNG ou PDF.');
      return;
    }

    // Validar tamanho (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo: 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Preview (apenas para imagens)
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }

  async function handleUpload() {
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      const result = await uploadFile('/documents/upload', file);

      // Redirecionar para a página de detalhes
      router.push(`/dashboard/document/${result.id}`);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload');
      setIsUploading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Upload de Documento</h2>
        <p className="text-gray-600 mt-1">
          Faça upload de uma nota fiscal para extrair informações com OCR
        </p>
      </div>

      {/* Área de Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Drag and Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />

          {!file ? (
            <>
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Arraste e solte seu arquivo aqui
              </p>
              <p className="text-gray-600 mb-6">ou</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Selecionar Arquivo
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Formatos aceitos: JPEG, PNG, PDF • Tamanho máximo: 10MB
              </p>
            </>
          ) : (
            <div className="space-y-4">
              {preview && (
                <div className="max-w-md mx-auto">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {file.type.startsWith('image/') ? '🖼️' : '📄'}
                    </span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Fazendo Upload...</span>
                  </span>
                ) : (
                  '⬆️ Fazer Upload'
                )}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Escolher outro arquivo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Informações */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ O que acontece após o upload?</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Seu documento será processado com OCR (Tesseract)</li>
          <li>✓ O texto será extraído automaticamente</li>
          <li>✓ Você poderá fazer perguntas sobre o documento usando IA</li>
          <li>✓ O processamento pode levar alguns segundos</li>
        </ul>
      </div>
    </div>
  );
}