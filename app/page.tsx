"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Evita erro de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // Renderiza placeholder até montar no cliente
  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Carregando...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      
      {/* Teste 1: CSS inline com lógica JS */}
      <div style={{ 
        background: theme === "dark" ? "#0a0a0a" : "#ffffff",
        color: theme === "dark" ? "#ededed" : "#171717",
        padding: "2rem",
        marginLeft: "1rem",
        border: "2px solid red"
      }}>
        Teste 1 (JS): {theme}
      </div>
      
      {/* Teste 2: Classes Tailwind */}
      <div className="bg-white dark:bg-black text-black dark:text-white p-8 ml-4 border-2 border-blue-500">
        Teste 2 (Tailwind): {theme}
      </div>
    </div>
  );
}