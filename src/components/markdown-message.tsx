"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSanitize from "rehype-sanitize";

type Props = { text: string };

export default function MarkdownMessage({ text }: Props) {
  return (
    <ReactMarkdown
      // GitHub-flavored markdown + single newline -> <br/>
      remarkPlugins={[remarkGfm, remarkBreaks]}
      // Sanitize output (raw HTML is ignored unless you add rehype-raw explicitly)
      rehypePlugins={[rehypeSanitize]}
      // Custom renderers for style/behavior
      components={{
        a: ({ node, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline text-blue-400 hover:text-blue-300 break-words"
          />
        ),
        code: ({ inline, className, children, ...props }) =>
          inline ? (
            <code
              {...props}
              className="rounded bg-black/30 px-1 py-[2px] text-[0.9em]"
            >
              {children}
            </code>
          ) : (
            <pre className="bg-black/40 rounded-lg p-3 overflow-x-auto">
              <code {...props}>{children}</code>
            </pre>
          ),
        p: ({ node, ...props }) => (
          <p {...props} className="mb-2 last:mb-0 leading-relaxed" />
        ),
        ul: ({ node, ...props }) => (
          <ul {...props} className="list-disc pl-5 space-y-1" />
        ),
        ol: ({ node, ...props }) => (
          <ol {...props} className="list-decimal pl-5 space-y-1" />
        ),
        li: ({ node, ...props }) => <li {...props} className="mb-1" />,
        h1: ({ node, ...props }) => (
          <h1 {...props} className="text-xl font-semibold mb-2" />
        ),
        h2: ({ node, ...props }) => (
          <h2 {...props} className="text-lg font-semibold mb-2" />
        ),
        h3: ({ node, ...props }) => (
          <h3 {...props} className="text-base font-semibold mb-1" />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            {...props}
            className="border-l-2 border-zinc-600 pl-3 italic text-zinc-300"
          />
        ),
        hr: () => <hr className="my-3 border-zinc-700" />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
