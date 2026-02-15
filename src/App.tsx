import { useState, useEffect, useMemo, useCallback } from "react";
import { sections } from "./data/cheatsheet";
import { Sidebar } from "./components/Sidebar";
import { ContentArea } from "./components/ContentArea";
import "./App.css";

const STORAGE_KEY = "interview-prep-visited";
const THEME_KEY = "interview-prep-theme";

function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function loadTheme(): "dark" | "light" {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch { /* ignore */ }
  return "dark";
}

function App() {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [visited, setVisited] = useState<Set<string>>(loadVisited);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(loadTheme);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Mark section as visited
  useEffect(() => {
    if (activeId) {
      setVisited((prev) => {
        const next = new Set(prev);
        next.add(activeId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
        return next;
      });
    }
  }, [activeId]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeId),
    [activeId]
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const currentIdx = filteredSections.findIndex((s) => s.id === activeId);
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        const next = filteredSections[currentIdx + 1];
        if (next) setActiveId(next.id);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        const prev = filteredSections[currentIdx - 1];
        if (prev) setActiveId(prev.id);
      } else if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        document.querySelector<HTMLInputElement>(".sidebar-search input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeId, filteredSections]);

  return (
    <div className="app">
      <header className="app-header">
        <button
          className="hamburger"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle sidebar"
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="app-title">Senior SWE Interview Prep</h1>
        <div className="header-actions">
          <span className="kbd-hint">
            <kbd>/</kbd> search &middot; <kbd>j</kbd>/<kbd>k</kbd> navigate
          </span>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
          </button>
        </div>
      </header>

      <div className="app-body">
        <Sidebar
          sections={filteredSections}
          activeId={activeId}
          visited={visited}
          searchQuery={searchQuery}
          onSelect={setActiveId}
          onSearchChange={setSearchQuery}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ContentArea section={activeSection} />
      </div>
    </div>
  );
}

export default App;
