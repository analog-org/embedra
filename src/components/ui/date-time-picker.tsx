import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";

export interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  date,
  setDate,
  className,
  disabled = false,
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(date);

  // Format time for the TimePicker
  const timeValue = selectedDateTime
    ? `${selectedDateTime.getHours().toString().padStart(2, "0")}:${selectedDateTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : undefined;

  // Handle time selection from TimePicker
  const handleTimeChange = (time: string | undefined) => {
    if (!time || !selectedDateTime) return;

    const [hours, minutes] = time.split(":").map(Number);
    
    const newDateTime = set(selectedDateTime, {
      hours: hours || 0,
      minutes: minutes || 0,
      seconds: 0,
    });
    
    setSelectedDateTime(newDateTime);
    setDate(newDateTime);
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setSelectedDateTime(undefined);
      setDate(undefined);
      return;
    }

    // Preserve time if there was a previously selected date
    let newDateTime = selectedDate;
    if (selectedDateTime) {
      newDateTime = set(selectedDate, {
        hours: selectedDateTime.getHours(),
        minutes: selectedDateTime.getMinutes(),
        seconds: 0,
      });
    }

    setSelectedDateTime(newDateTime);
    setDate(newDateTime);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP p") : <span>Pick a date and time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDateTime}
            onSelect={handleDateSelect}
            initialFocus
            disabled={disabled}
          />
          <div className="p-3 border-t border-border">
            <TimePicker
              time={timeValue}
              setTime={handleTimeChange}
              disabled={disabled || !selectedDateTime}
              placeholder="Select time"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}