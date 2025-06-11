import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ColorPicker, type ColorPickerProps } from "./color-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";

export interface FormColorPickerProps extends Omit<ColorPickerProps, "value" | "onChange" | "defaultValue" | "label"> {
  name: string;
  label?: string;
  description?: React.ReactNode;
}

export function FormColorPicker({ name, label, description, ...props }: FormColorPickerProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="system-font" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}>
          {label && <FormLabel className="system-font" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}>{label}</FormLabel>}
          <FormControl>
            <ColorPicker
              value={field.value}
              onChange={field.onChange}
              {...props}
            />
          </FormControl>
          {description && <p className="text-sm text-muted-foreground system-font" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}>{description}</p>}
          <FormMessage className="system-font" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }} />
        </FormItem>
      )}
    />
  );
}