"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "./utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ICON_STROKE_WIDTH } from "../../../lib/constants";

interface DateRangePickerProps {
  className?: string;
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal border-border bg-input-background",
              !date && "text-muted-foreground"
            )}
            style={{ fontSize: "var(--text-sm)" }}
          >
            <CalendarIcon className="mr-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
            {date?.from ? (
              date.to ? (
                <span className="font-mono">
                  {format(date.from, "dd-MM-yyyy")} - {format(date.to, "dd-MM-yyyy")}
                </span>
              ) : (
                <span className="font-mono">{format(date.from, "dd-MM-yyyy")}</span>
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background text-foreground" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
