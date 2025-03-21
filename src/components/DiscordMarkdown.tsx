import * as React from "react"
import Markdown from 'react-markdown'
import { DiscordCode } from "@skyra/discord-components-react";
import { parseText } from "@/lib/parseUtils"

// react component make it type safe all it needs is children
import { cn } from "@/lib/utils"

export interface DiscordMarkdownProps {
  className?: string
  children: string
}

const DiscordMarkdown = React.forwardRef<HTMLDivElement, DiscordMarkdownProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("prose prose-sm max-w-none", className)}
        {...props}
      >
        <Markdown components={{
          // Handle code blocks with language
          pre({ children }) {
            return <>{children}</>;
          },
          code(props) {
            const { children, className } = props;
            const match = /language-(\w+)/.exec(className || '');
            if (match) {
              return (
                <DiscordCode multiline lang={match[1]}>
                  {String(children).replace(/\n$/, '')}
                </DiscordCode>
              );
            }
            return <>{parseText(String(children))}</>;
          },
          // Handle any text-containing elements by parsing with our utility
          p: ({ children }) => <div>{parseText(String(children))}</div>,
          span: ({ children }) => <span>{parseText(String(children))}</span>,
          a: ({ children }) => <span>{parseText(String(children))}</span>,
          strong: ({ children }) => <strong>{parseText(String(children))}</strong>,
          em: ({ children }) => <em>{parseText(String(children))}</em>,
          h1: ({ children }) => <h1>{parseText(String(children))}</h1>,
          h2: ({ children }) => <h2>{parseText(String(children))}</h2>,
          h3: ({ children }) => <h3>{parseText(String(children))}</h3>,
          h4: ({ children }) => <h4>{parseText(String(children))}</h4>,
          h5: ({ children }) => <h5>{parseText(String(children))}</h5>,
          h6: ({ children }) => <h6>{parseText(String(children))}</h6>
        }}>
          {children}
        </Markdown>
      </div>
    )
  }
)

export default DiscordMarkdown
