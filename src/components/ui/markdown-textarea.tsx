"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { 
  Bold, 
  Italic, 
  Code, 
  Underline, 
  Strikethrough,
  Eye // Add the Eye icon for spoilers
} from "lucide-react"

export interface MarkdownTextareaProps extends React.ComponentProps<typeof Textarea> {
  toolbarClassName?: string
}

export const MarkdownTextarea = React.forwardRef<HTMLTextAreaElement, MarkdownTextareaProps>(
  ({ className, toolbarClassName, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const [value, setValue] = React.useState(props.value || props.defaultValue || "")
    const [activeFormats, setActiveFormats] = React.useState<Record<string, boolean>>({})
    
    // Ensure our ref works with the forwarded ref
    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement)

    // Check if text has formatting applied
    const hasFormatting = (
      text: string,
      selection: { start: number, end: number },
      format: { start: string, end: string }
    ): boolean => {
      const selectedText = text.substring(selection.start, selection.end)
      if (!selectedText) return false

      // Check if text starts with format.start and ends with format.end
      return (
        text.substring(selection.start - format.start.length, selection.start) === format.start &&
        text.substring(selection.end, selection.end + format.end.length) === format.end
      )
    }

    // Remove formatting from text
    const removeFormatting = (
      text: string,
      selection: { start: number, end: number },
      format: { start: string, end: string }
    ) => {
      const newText = 
        text.substring(0, selection.start - format.start.length) + 
        text.substring(selection.start, selection.end) + 
        text.substring(selection.end + format.end.length)
      
      return {
        text: newText,
        selection: {
          start: selection.start - format.start.length,
          end: selection.end - format.start.length
        }
      }
    }

    // Toggle formatting at cursor position
    const toggleFormat = (
      format: { start: string; end: string },
      formatKey: string,
      defaultText?: string
    ) => {
      if (!textareaRef.current) return
      
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const selection = { start, end }
      
      // Check if we should remove or add formatting
      if (start !== end && hasFormatting(text, selection, format)) {
        // Remove formatting
        const result = removeFormatting(text, selection, format)
        
        textarea.value = result.text
        
        // Create synthetic event
        const event = Object.create(new Event("input", { bubbles: true }))
        Object.defineProperty(event, 'target', { value: textarea })
        
        setValue(result.text)
        
        if (onChange) {
          onChange(event as React.ChangeEvent<HTMLTextAreaElement>)
        }
        
        // Update selection
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(result.selection.start, result.selection.end)
        }, 0)
        
        // Update active formats
        setActiveFormats(prev => ({ ...prev, [formatKey]: false }))
      } else {
        // Add formatting
        const selectedText = text.substring(start, end)
        const replacement = 
          selectedText.length > 0 
            ? format.start + selectedText + format.end 
            : format.start + (defaultText || "") + format.end
        
        const newText = 
          text.substring(0, start) + replacement + text.substring(end)
        
        // Update textarea value
        textarea.value = newText
        
        // Create synthetic event
        const event = Object.create(new Event("input", { bubbles: true }))
        Object.defineProperty(event, 'target', { value: textarea })
        
        setValue(newText)
        
        if (onChange) {
          onChange(event as React.ChangeEvent<HTMLTextAreaElement>)
        }
        
        // Update cursor position
        setTimeout(() => {
          textarea.focus()
          if (selectedText.length > 0) {
            textarea.setSelectionRange(
              start + format.start.length,
              end + format.start.length
            )
          } else {
            const newPos = start + format.start.length + (defaultText?.length || 0)
            textarea.setSelectionRange(newPos, newPos)
          }
        }, 0)
        
        // Update active formats
        if (selectedText.length > 0) {
          setActiveFormats(prev => ({ ...prev, [formatKey]: true }))
        }
      }
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)
      if (onChange) {
        onChange(e)
      }
    }
    
    // Check active formats on selection change
    const updateActiveFormats = React.useCallback(() => {
      if (!textareaRef.current) return
      
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const selection = { start, end }
      
      setActiveFormats({
        bold: hasFormatting(text, selection, { start: "**", end: "**" }),
        italic: hasFormatting(text, selection, { start: "*", end: "*" }),
        code: hasFormatting(text, selection, { start: "```", end: "```" }),
        underline: hasFormatting(text, selection, { start: "__", end: "__" }),
        strikethrough: hasFormatting(text, selection, { start: "~~", end: "~~" }),
        spoiler: hasFormatting(text, selection, { start: "||", end: "||" })
      })
    }, [])
    
    // Add event listeners to update format state on selection change
    React.useEffect(() => {
      const textarea = textareaRef.current
      if (!textarea) return
      
      const events = ['mouseup', 'keyup', 'click', 'focus']
      events.forEach(event => {
        textarea.addEventListener(event, updateActiveFormats)
      })
      
      return () => {
        events.forEach(event => {
          textarea?.removeEventListener(event, updateActiveFormats)
        })
      }
    }, [updateActiveFormats])
    
    // Format handlers with keys for active state
    const formatBold = () => toggleFormat({ start: "**", end: "**" }, "bold", "bold text")
    const formatItalic = () => toggleFormat({ start: "*", end: "*" }, "italic", "italic text")
    const formatCode = () => toggleFormat({ start: "```", end: "```" }, "code", "code")
    const formatUnderline = () => toggleFormat({ start: "__", end: "__" }, "underline", "underlined text")
    const formatStrikethrough = () => toggleFormat({ start: "~~", end: "~~" }, "strikethrough", "strikethrough text")
    const formatSpoiler = () => toggleFormat({ start: "||", end: "||" }, "spoiler", "spoiler text")

    return (
      <div className="flex flex-col gap-2 w-full items-end">
        <ToggleGroup 
          type="multiple" 
          className={cn("justify-end", toolbarClassName)}
          variant="outline"
          value={Object.keys(activeFormats).filter(key => activeFormats[key])}
        >
          <ToggleGroupItem value="bold" onClick={formatBold} aria-label="Bold text">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" onClick={formatItalic} aria-label="Italic text">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="code" onClick={formatCode} aria-label="Code block">
            <Code className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" onClick={formatUnderline} aria-label="Underlined text">
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough" onClick={formatStrikethrough} aria-label="Strikethrough text">
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="spoiler" onClick={formatSpoiler} aria-label="Spoiler text">
            <Eye className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Textarea
          ref={textareaRef}
          className={className}
          value={value}
          onChange={handleInputChange}
          onSelect={updateActiveFormats}
          {...props}
        />
      </div>
    )
  }
)

MarkdownTextarea.displayName = "MarkdownTextarea"
