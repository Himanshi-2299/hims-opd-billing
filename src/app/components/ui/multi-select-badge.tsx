import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Checkbox } from "./checkbox";

export type MultiSelectOption = {
  id: string;
  label: string;
};

interface MultiSelectBadgeProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelectBadge({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  disabled = false,
  className,
}: MultiSelectBadgeProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (optionId: string) => {
    if (selected.includes(optionId)) {
      onChange(selected.filter((id) => id !== optionId));
    } else {
      onChange([...selected, optionId]);
    }
  };

  const handleRemove = (optionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(selected.filter((id) => id !== optionId));
  };

  const selectedOptions = options.filter((opt) => selected.includes(opt.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between min-h-[36px] h-auto py-2",
            className
          )}
          style={{ fontSize: "var(--text-base)" }}
        >
          <div className="flex flex-wrap gap-2 flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  key={option.id}
                  variant="default"
                  className="bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400"
                >
                  <span style={{ fontSize: "var(--text-xs)" }}>
                    {option.label}
                  </span>
                  {!disabled && (
                    <span
                      onClick={(e) => handleRemove(option.id, e)}
                      className="ml-1 hover:text-cyan-900 dark:hover:text-cyan-200 cursor-pointer"
                    >
                      <X className="size-3" />
                    </span>
                  )}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground" style={{ fontSize: "var(--text-base)" }}>
                {placeholder}
              </span>
            )}
          </div>
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-background text-foreground" align="start">
        <div className="max-h-[300px] overflow-auto p-2">
          <div className="space-y-1">
            {options.map((option) => {
              const isSelected = selected.includes(option.id);
              return (
                <div
                  key={option.id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent rounded-sm transition-colors"
                  onClick={() => handleToggle(option.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(option.id)}
                  />
                  <span
                    className="flex-1"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {option.label}
                  </span>
                  {isSelected && (
                    <Check className="size-4 text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}