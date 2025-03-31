import * as React from "react";
import Markdown from "react-markdown";
import {
  DiscordCode,
  DiscordCustomEmoji,
  DiscordBold,
  DiscordItalic,
  DiscordUnderlined,
  DiscordSubscript,
  DiscordSpoiler,
  DiscordQuote,
  DiscordHeader,
  DiscordUnorderedList,
  DiscordOrderedList,
  DiscordListItem,
  DiscordLink,
  DiscordTime,
} from "@skyra/discord-components-react";
import { parseText } from "@/lib/parseUtils";
import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import "./discord-hljs.css";

export interface DiscordMarkdownProps {
  className?: string;
  children: string;
}

const CodeBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const codeRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {

    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [children]);

  return (
    <pre className="theme-dark ">
      <code 
        ref={codeRef} 
        className={cn("", className)} 
        style={{ backgroundColor: "#2f3136", display: "block", padding: "0.5rem", marginRight: "0.5rem", marginBottom: "0.5rem", }}
      >
        {children}
      </code>
    </pre>
  );
};

const DiscordMarkdown = React.forwardRef<HTMLDivElement, DiscordMarkdownProps>(
  ({ className, children, ...props }, ref) => {
    // Remove pre-parsing so that Markdown processes the entire raw text:
    const renderMarkdown = (content: string): React.ReactNode => {
      return (
        <Markdown
          skipHtml
          remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
          remarkRehypeOptions={{}}
          components={{
            pre({ children }) {
              return (
                <>
                  {typeof children === "string"
                    ? parseText(children)
                    : children}
                </>
              );
            },
            code({ children, className, ...rest }) {
              // If there's no className or it's explicitly "language-" (i.e. triple backticks without a language)
              if (!className) {
                if(content.includes("```") && content.includes(children as string)) {
                  return <CodeBlock className={className}>{children}</CodeBlock>;
                }
                return <DiscordCode>{children}</DiscordCode>;
              }
              // Otherwise, it's a multi-line code block with a specified language (```js, etc.)
              return <CodeBlock className={className}>{children}</CodeBlock>;
            },
            // Use simpler components to avoid nesting issues
            p: ({ children }) => (
              <div>
                {typeof children === "string" ? parseText(children) : children}
              </div>
            ),
            span: ({ children }) => (
              <span>
                {typeof children === "string" ? parseText(children) : children}
              </span>
            ),
            a: ({ href, children }) => (
              <DiscordLink
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {typeof children === "string" ? parseText(children) : children}
              </DiscordLink>
            ),
            blockquote: ({ children }) => (
              <DiscordQuote>
                {typeof children === "string" ? parseText(children) : children}
              </DiscordQuote>
            ),
            strong: ({ children }) => (
              <DiscordBold>
                {typeof children === "string" ? parseText(children) : children}
              </DiscordBold>
            ),
            em: ({ children }) => (
              <em>
                {typeof children === "string" ? parseText(children) : children}
              </em>
            ),
            h1: ({ children }) => (
              <DiscordHeader level={1}>
                {Array.isArray(children)
                  ? children
                  : parseText(children as string)}
              </DiscordHeader>
            ),
            h2: ({ children }) => (
              <DiscordHeader level={2}>
                {Array.isArray(children)
                  ? children
                  : parseText(children as string)}
              </DiscordHeader>
            ),
            h3: ({ children }) => (
              <DiscordHeader level={3}>
                {Array.isArray(children)
                  ? children
                  : parseText(children as string)}
              </DiscordHeader>
            ),
            ul: ({ children }) => (
              <DiscordUnorderedList>{children}</DiscordUnorderedList>
            ),
            ol: ({ children }) => (
              <DiscordOrderedList>{children}</DiscordOrderedList>
            ),
            li: ({ children }) => (
              <DiscordListItem>
                {typeof children === "string" ? parseText(children) : children}
              </DiscordListItem>
            ),
            i: ({ children }) => (
              <DiscordItalic>
                {typeof children === "string" ? parseText(children) : children}
              </DiscordItalic>
            ),
            u: ({ children }) => (
              <DiscordUnderlined>
                {typeof children === "string" ? parseText(children) : children}
              </DiscordUnderlined>
            ),
            small: ({ children }) => (
              <DiscordSubscript className="text-sm">
                {typeof children === "string" ? parseText(children) : children}
              </DiscordSubscript>
            ),
            b: ({ children }) => (
              <DiscordBold>
                {typeof children === "string" ? parseText(children) : children}
              </DiscordBold>
            ),
            details: ({ children }) => (
              <DiscordSpoiler>
                {typeof children === "string" ? parseText(children) : children}
              </DiscordSpoiler>
            ),
            del: ({ children }) => (
              <del>
                {typeof children === "string" ? parseText(children) : children}
              </del>
            ),
    
            // add any additional rules as needed
          }}
        >
          {content}
        </Markdown>
      );
    };

    return (
      <div
        ref={ref}
        className={cn("prose prose-sm max-w-none", className)}
        {...props}
      >
        {renderMarkdown(children)}
      </div>
    );
  }
);

export default DiscordMarkdown;
