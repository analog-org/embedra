import * as React from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";

export interface TimePickerProps {
  time: string | undefined; // Format: "HH:mm"
  setTime: (time: string | undefined) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export function TimePicker({
  time,
  setTime,
  className,
  disabled = false,
  label,
  placeholder = "Select time",
}: TimePickerProps) {
  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value;
    setTime(timeString || undefined);
  };

  // Format display time
  const displayTime = time 
    ? format(parse(time, "HH:mm", new Date()), "h:mm a")
    : "";

  // Generate time options (every 30 minutes)
  const timeOptions = React.useMemo(() => {
    const options = [];
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 24 * 2; i++) {
      const timeString = format(date, "HH:mm");
      const displayString = format(date, "h:mm a");
      options.push({ value: timeString, label: displayString });
      date.setMinutes(date.getMinutes() + 30);
    }
    
    return options;
  }, []);

  return (
    <div className={cn("grid gap-2", className)}>
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !time && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <Clock className="mr-2 h-4 w-4" />
            {time ? displayTime : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" side="right" align="start">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={time || ""}
                onChange={handleInputChange}
                className="w-full"
                disabled={disabled}
              />
            </div>
          </div>
          <div className="py-2 max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-1 p-2">
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  className={cn(
                    "justify-start font-normal",
                    time === option.value && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setTime(option.value)}
                  disabled={disabled}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}