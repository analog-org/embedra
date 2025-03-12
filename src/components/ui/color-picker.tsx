import * as React from "react";
import { Saturation, Hue, useColor, type IColor } from "react-color-palette";
import "react-color-palette/css";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onChangeComplete?: (value: string) => void;
  className?: string;
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
          <PopoverTrigger  asChild>
            <div className="relative w-full">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-sm border pointer-events-none"
                style={{ backgroundColor: color.hex }}
              />
              <Input
                value={color.hex}
                className="pl-10"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="flex flex-col gap-4 w-[200px]">
              <Saturation 
                height={150} 
                color={color} 
                onChange={handleChange}
                onChangeComplete={handleChangeComplete}
                disabled={disabled}
              />
              <Hue 
                color={color} 
                onChange={handleChange}
                onChangeComplete={handleChangeComplete}
                disabled={disabled}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

export { ColorPicker, useColor };