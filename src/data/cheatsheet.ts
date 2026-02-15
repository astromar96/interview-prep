import raw from "./cheatsheet.md?raw";

export interface Section {
  id: string;
  title: string;
  content: string;
}

export function parseSections(markdown: string): Section[] {
  const sectionRegex = /^## \d+\.\s+/m;
  const parts = markdown.split(/(?=^## \d+\.\s)/m);

  const sections: Section[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Match section header like "## 1. Data Structures & Algorithms"
    const headerMatch = trimmed.match(/^## (\d+)\.\s+(.+)/);
    if (headerMatch) {
      const num = headerMatch[1];
      const title = headerMatch[2];
      // Remove the top-level header and any leading ---
      const content = trimmed
        .replace(/^## \d+\.\s+.+\n*/, "")
        .replace(/^---\s*$/m, "")
        .trim();
      sections.push({ id: `section-${num}`, title: `${num}. ${title}`, content });
      continue;
    }

    // Match "Quick Reference" section
    const quickRefMatch = trimmed.match(/^## Quick Reference/);
    if (quickRefMatch) {
      const content = trimmed.replace(/^## Quick Reference[^\n]*\n*/, "").trim();
      sections.push({ id: "quick-ref", title: "Quick Reference", content });
      continue;
    }

    // Check if it's the header (before any ## section)
    if (!sectionRegex.test(trimmed) && !trimmed.startsWith("## ")) {
      // This is the intro/header part — include it as a welcome section
      const titleMatch = trimmed.match(/^# (.+)/);
      if (titleMatch) {
        const content = trimmed.replace(/^# .+\n*/, "").replace(/^###[^\n]+\n*/m, "").trim();
        if (content) {
          sections.unshift({ id: "intro", title: "Overview", content });
        }
      }
    }
  }

  return sections;
}

export const sections = parseSections(raw);
