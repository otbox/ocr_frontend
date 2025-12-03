import Image from "next/image";
import TToggleButtonTheme from "./components/ui/TToggleButtonTheme";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <TToggleButtonTheme />
      <div className="bg-white dark:bg-neutral-900 text-black dark:text-white">
          Conteúdo
      </div>
    </div>
  );
}
