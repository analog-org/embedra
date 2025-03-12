import * as React from "react";
import { ColorPicker as RCPColorPicker, useColor, type IColor } from "react-color-palette";
import "react-color-palette/css";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onChangeComplete?: (value: string) => void;
  className?: string;
  hideInput?: Array<"hex" | "rgb" | "hsv">;
  label?: string;
  disabled?: boolean;
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ 
    value, 
    defaultValue = "#000000", 
    onChange, 
    onChangeComplete,
    className,
    hideInput = ["rgb", "hsv"],
    label,
    disabled = false,
    ...props 

  }, ref) => {
    const [color, setColor] = useColor(value || defaultValue);
    
    const handleChange = React.useCallback((newColor: IColor) => {
      setColor(newColor);
      onChange?.(newColor.hex);
    }, [onChange]);

    const handleChangeComplete = React.useCallback((newColor: IColor) => {
      onChangeComplete?.(newColor.hex);
    }, [onChangeComplete]);

    // Update internal state when value prop changes
    React.useEffect(() => {
      if (value && value !== color.hex) {
        const [newColor] = useColor(value);
        setColor(newColor);
      }
    }, [value]);

    return (
      <div ref={ref} className={cn("grid gap-2", className)} {...props}>
        {label && <Label>{label}</Label>}
        <Popover>
          <PopoverTrigger disabled={disabled} asChild>
            <button
              type="button"
              className={cn(
                "border-input ring-offset-background focus-visible:ring-ring flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-5 w-5 rounded-sm border"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.hex}</span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <RCPColorPicker
              height={180}
              color={color}
              onChange={handleChange}
              onChangeComplete={handleChangeComplete}
              hideInput={hideInput}
              hideAlpha
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

export { ColorPicker, useColor };