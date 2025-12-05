// app/(dashboard)/document/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/libs/auth/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Document {
  id: string;
  originalName: string;
  storageUrl: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  extractedText?: string;
  createdAt: string;
  conversations: Conversation[];
}

interface Conversation {
  id: string;
  messages: Message[];
  createdAt: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  async function loadDocument() {
    try {
      setIsLoading(true);
      const data = await api(`/documents/${documentId}`);
      setDocument(data);

      // Carregar histórico de conversas
      if (data.conversations && data.conversations.length > 0) {
        setChatHistory(data.conversations[0].messages || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDocument();

    // Polling para documentos em processamento
    const interval = setInterval(() => {
      if (document?.status === 'PROCESSING') {
        loadDocument();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [documentId, document?.status]);

  async function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    try {
      setIsAsking(true);

      const response = await api('/llm/ask', {
        method: 'POST',
        body: JSON.stringify({
          documentId,
          question: question.trim(),
        }),
      });

      // Adicionar pergunta e resposta ao histórico
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: response.answer },
      ]);

      setQuestion('');
    } catch (err: any) {
      alert('Erro ao fazer pergunta: ' + err.message);
    } finally {
      setIsAsking(false);
    }
  }

  async function downloadDocument(id: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/${id}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  
  const a = window.document.createElement("a");
  a.href = url;
  a.download = `document-${id}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">❌ {error || 'Documento não encontrado'}</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline mt-2 inline-block">
          Voltar para lista
        </Link>
      </div>
    );
  }
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:underline text-sm mb-2 inline-block"
          >
            ← Voltar para lista
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">{document.originalName}</h2>
          <p className="text-gray-600 mt-1">
            Enviado em {new Date(document.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="flex space-x-2">
          {document.status === 'COMPLETED' && (
            <button
  onClick={() => downloadDocument(document.id)}
  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
>
  📥 Download PDF
</button>)}
        </div>
      </div>

      {/* Status */}
      {document.status === 'PROCESSING' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
            <div>
              <p className="font-semibold text-yellow-800">Processando documento...</p>
              <p className="text-sm text-yellow-700">O OCR está extraindo o texto. Isso pode levar alguns segundos.</p>
            </div>
          </div>
        </div>
      )}

      {document?.status === 'FAILED' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-semibold text-red-800">❌ Falha no processamento</p>
          <p className="text-sm text-red-700 mt-1">Não foi possível extrair o texto do documento.</p>
        </div>
      )}

      {/* Layout: Imagem + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna Esquerda: Imagem e Texto Extraído */}
        <div className="space-y-6">
          {/* Imagem */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">📄 Documento</h3>
            {document?.storageUrl.endsWith('.pdf') ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-600">PDF não pode ser visualizado aqui</p>
                <a
                  href={document?.storageUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Abrir PDF
                </a>
              </div>
            ) : (
              <img
                src={document?.storageUrl}
                alt={document?.originalName}
                className="w-full rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Texto Extraído */}
          {document?.extractedText && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">📝 Texto Extraído (OCR)</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {document?.extractedText}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Chat com IA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[600px]">
          <h3 className="font-semibold text-gray-900 mb-4">💬 Chat com IA</h3>

          {document?.status !== 'COMPLETED' ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">🤖</p>
                <p>Aguarde o processamento terminar para fazer perguntas</p>
              </div>
            </div>
          ) : (
            <>
              {/* Histórico de Chat */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p className="text-4xl mb-2">💡</p>
                    <p>Faça uma pergunta sobre o documento</p>
                    <p className="text-sm mt-2">Exemplos:</p>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>• Qual o valor total?</li>
                      <li>• Quem é o fornecedor?</li>
                      <li>• Qual a data de emissão?</li>
                    </ul>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input de Pergunta */}
              <form onSubmit={handleAskQuestion} className="flex space-x-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Digite sua pergunta..."
                  disabled={isAsking}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  disabled={isAsking || !question.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isAsking ? '...' : '➤'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}