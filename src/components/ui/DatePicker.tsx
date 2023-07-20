import { ChangeEvent, Dispatch, SetStateAction } from "react";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";

import { Input } from "./Input";
import { Label } from "./Label";

type DatePickerProps = {
  onSetDate: (value: Date | undefined) => void;
  date: Date | undefined;
  id: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  required?: boolean;
  label: string;
  customDate: string;
  setCustomDate: Dispatch<SetStateAction<string>>;
  onCustomDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const DatePicker = ({
  date,
  onSetDate,
  id,
  register,
  errors,
  required,
  label,
  customDate,
  setCustomDate,
  onCustomDateChange,
  ...props
}: DatePickerProps) => {
  return (
    <div className="grid grid-flow-row items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex">
        <Input
          type="text"
          value={customDate}
          onChange={(event) => onCustomDateChange(event)}
          placeholder={"e.g: Jul 03, 1998"}
          className={cn(
            "rounded-tr-none rounded-br-none",
            errors[id] && "border-rose-600 focus-visible:ring-rose-400"
          )}
        />

        <Popover>
          <PopoverTrigger id={id} asChild>
            <Button
              variant="outline"
              className={cn(
                "border-l-0 rounded-tl-none rounded-bl-none",
                errors[id] && "border-rose-600 focus-visible:ring-rose-400"
              )}
            >
              <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
              Pick
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              onSelect={(value) => {
                setCustomDate(format(value as Date, "PP"));
                onSetDate(value);
              }}
              initialFocus
              {...register(id, { required })}
              {...props}
            />
          </PopoverContent>
        </Popover>
      </div>
      {errors[id] && (
        <span className="text-sm font-medium text-destructive">
          {errors[id]?.message as string}
        </span>
      )}
    </div>
  );
};

export default DatePicker;
