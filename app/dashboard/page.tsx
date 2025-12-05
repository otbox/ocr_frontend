"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/libs/auth/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Document {
  id: string;
  originalName: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  fileSize: number;
  extractedText?: string;
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function loadDocuments() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api('/documents');
      setDocuments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja deletar este documento?')) {
      return;
    }

    try {
      await api(`/documents/${id}`, { method: 'DELETE' });
      setDocuments(docs => docs.filter(doc => doc.id !== id));
    } catch (err: any) {
      alert('Erro ao deletar: ' + err.message);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }

  function getStatusBadge(status: 'PROCESSING' | 'COMPLETED' | 'FAILED') {
    const styles = {
      PROCESSING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
    };

    const labels = {
      PROCESSING: '🔄 Processando',
      COMPLETED: '✅ Concluído',
      FAILED: '❌ Falhou',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">❌ {error}</p>
        <button
          onClick={loadDocuments}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Meus Documentos</h2>
          <p className="text-gray-600 mt-1">
            {documents.length} {documents.length === 1 ? 'documento' : 'documentos'}
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
        >
          ➕ Novo Upload
        </Link>
      </div>

      {/* Lista de Documentos */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum documento ainda
          </h3>
          <p className="text-gray-600 mb-6">
            Faça upload do seu primeiro documento para começar
          </p>
          <Link
            href="/dashboard/upload"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Fazer Upload
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doc.originalName}
                    </h3>
                    {getStatusBadge(doc.status)}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>📅 {formatDate(doc.createdAt)}</span>
                    <span>💾 {formatFileSize(doc.fileSize)}</span>
                  </div>

                  {doc.extractedText && (
                    <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                      {doc.extractedText.substring(0, 150)}...
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {doc.status === 'COMPLETED' && (
                    <>
                      <Link
                        href={`/dashboard/document/${doc.id}`}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
                      >
                        Ver Detalhes
                      </Link>
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/documents/${doc.id}/download`}
                        target="_blank"
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition font-medium text-sm"
                      >
                        📥 Download
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão de Refresh */}
      <div className="text-center">
        <button
          onClick={loadDocuments}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          🔄 Atualizar Lista
        </button>
      </div>
    </div>
  );
}