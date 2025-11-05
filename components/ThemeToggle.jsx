import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform"
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
