import type { Section } from "../data/cheatsheet";

interface SidebarProps {
  sections: Section[];
  activeId: string;
  visited: Set<string>;
  searchQuery: string;
  onSelect: (id: string) => void;
  onSearchChange: (query: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  sections,
  activeId,
  visited,
  searchQuery,
  onSelect,
  onSearchChange,
  isOpen,
  onClose,
}: SidebarProps) {
  const progress = sections.length > 0
    ? Math.round((visited.size / sections.length) * 100)
    : 0;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-header">
          <h2>Study Guide</h2>
          <button className="sidebar-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="sidebar-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">
            {visited.size}/{sections.length} sections reviewed
          </span>
        </div>

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`sidebar-item ${activeId === section.id ? "sidebar-item--active" : ""}`}
              onClick={() => {
                onSelect(section.id);
                onClose();
              }}
            >
              <span className={`sidebar-item-check${visited.has(section.id) ? " sidebar-item-check--visited" : ""}`}>
                {visited.has(section.id) ? "\u2713" : "\u25CB"}
              </span>
              <span className="sidebar-item-title">{section.title}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
