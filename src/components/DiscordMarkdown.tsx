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

export interface DiscordMarkdownProps {
  className?: string;
  children: string;
}

const DiscordMarkdown = React.forwardRef<HTMLDivElement, DiscordMarkdownProps>(
  ({ className, children, ...props }, ref) => {
    // First, parse Discord entities directly
    const parsedDiscordContent = React.useMemo(
      () => parseText(children),
      [children]
    );

    // Then handle markdown separately
    const renderMarkdown = (content: React.ReactNode): React.ReactNode => {
      // If it's not a string, return as is (probably already a component)
      if (typeof content !== "string") return content;

      // For string content, process with markdown
      return (
        <Markdown
          components={{
            pre({ children }) {
              return <>{children}</>;
            },
            code(props) {
              const { children, className } = props;
              const match = /language-(\w+)/.exec(className || "");
              if (match) {
                return (
                  <DiscordCode multiline lang={match[1]}>
                    {String(children).replace(/\n$/, "")}
                  </DiscordCode>
                );
              }
              return <>{children}</>;
            },
            // Use simpler components to avoid nesting issues
            p: ({ children }) => <div>{children}</div>,
            span: ({ children }) => <span>{children}</span>,
            a: ({ href, children }) => (
              <DiscordLink
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </DiscordLink>
            ),
            blockquote: ({ children }) => (
              <DiscordQuote>{children}</DiscordQuote>
            ),
            strong: ({ children }) => <DiscordBold>{children}</DiscordBold>,
            em: ({ children }) => <em>{children}</em>,
            h1: ({ children }) => (
              <DiscordHeader level={1}>{parseText(children)}</DiscordHeader>
            ),
            h2: ({ children }) => (
              <DiscordHeader level={2}>{children}</DiscordHeader>
            ),
            h3: ({ children }) => (
              <DiscordHeader level={3}>{children}</DiscordHeader>
            ),
            ul: ({ children }) => (
              <DiscordUnorderedList>{children}</DiscordUnorderedList>
            ),
            ol: ({ children }) => (
              <DiscordOrderedList>{children}</DiscordOrderedList>
            ),
            li: ({ children }) => <DiscordListItem>{children}</DiscordListItem>,
            i: ({ children }) => <DiscordItalic>{children}</DiscordItalic>,
            u: ({ children }) => (
              <DiscordUnderlined>{children}</DiscordUnderlined>
            ),
            small: ({ children }) => (
              <DiscordSubscript className="text-sm">
                {children}
              </DiscordSubscript>
            ),
            b: ({ children }) => <DiscordBold>{children}</DiscordBold>,
            // for that hidden text - use a standard component like div with custom class
            details: ({ children }) => (
              <DiscordSpoiler> {children} </DiscordSpoiler>
            ),
          }}
        >
          {content}
        </Markdown>
      );
    };

    // Process and render the content
    const renderContent = () => {
      // If parseText returned an array, process each item
      if (Array.isArray(parsedDiscordContent)) {
        return parsedDiscordContent.map((part, index) =>
          typeof part === "string"
            ? renderMarkdown(part)
            : React.cloneElement(part as React.ReactElement, {
                key: `entity-${index}`,
              })
        );
      }

      // If parseText returned a string, process it with markdown
      if (typeof parsedDiscordContent === "string") {
        return renderMarkdown(parsedDiscordContent);
      }

      // Otherwise, it's probably already a component
      return parsedDiscordContent;
    };

    return (
      <div
        ref={ref}
        className={cn("prose prose-sm max-w-none", className)}
        {...props}
      >
        {renderContent()}
      </div>
    );
  }
);

export default DiscordMarkdown;
