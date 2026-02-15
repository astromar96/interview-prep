import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Section } from "../data/cheatsheet";
import { CodeBlock } from "./CodeBlock";

interface ContentAreaProps {
  section: Section | undefined;
}

export function ContentArea({ section }: ContentAreaProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [section?.id]);

  if (!section) {
    return (
      <main className="content" ref={contentRef}>
        <div className="content-empty">
          <h2>Select a section to start studying</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="content" ref={contentRef}>
      <h1 className="content-title">{section.title}</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className;
            if (isInline) {
              return <code className="inline-code" {...props}>{children}</code>;
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          table({ children }) {
            return (
              <div className="table-wrapper">
                <table>{children}</table>
              </div>
            );
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {section.content}
      </ReactMarkdown>
    </main>
  );
}
