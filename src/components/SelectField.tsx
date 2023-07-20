import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import { OptionProps } from "@/types/options";
import { SelectProps } from "@radix-ui/react-select";

import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";

interface SelectFieldProps {
  id: string;
  label: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  value?: string;
  onChange: (value: string) => void;
  placeHolder?: string;
  options: OptionProps[];
}

const SelectField = ({
  id,
  label,
  register,
  errors,
  onChange,
  value,
  required,
  placeHolder,
  options,
  ...props
}: SelectFieldProps & Partial<SelectProps>) => {
  return (
    <div className="grid grid-flow-row items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select
        onValueChange={(value) => onChange(value)}
        {...register(id, { required })}
        {...props}
      >
        <SelectTrigger
          id={id}
          value={value}
          className={
            errors[id] && "border-rose-600 focus-visible:ring-rose-400"
          }
        >
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.length === 0 && (
              <SelectItem value="" disabled>
                No data available
              </SelectItem>
            )}
            {options.map((option, key) => (
              <SelectItem key={key} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {errors[id] && (
        <span className="text-sm font-medium text-destructive">
          {errors[id]?.message as string}
        </span>
      )}
    </div>
  );
};

export default SelectField;
