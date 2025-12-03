"use client";

import TToggleButtonTheme from "./components/ui/TToggleButtonTheme";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <TToggleButtonTheme />
      <div className="bg-white text-black dark:bg-neutral-900 dark:text-white p-8 rounded-lg">
        Conteúdo
      </div>
    </div>
  );
}