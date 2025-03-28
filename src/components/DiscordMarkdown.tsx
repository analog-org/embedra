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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
export interface DiscordMarkdownProps {
  className?: string;
  children: string;
}

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
            code(props) {
              const { children, className, node, ref, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
                return match ? (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                  style={oneDark}
                  customStyle={} // Discord dark theme code block color
                />
                ) : (
                <DiscordCode className="bg-[#2f3136]">
                  {children}
                </DiscordCode>
                );
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
