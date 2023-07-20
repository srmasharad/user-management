import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import { Input, InputProps } from "./ui/Input";
import { Label } from "./ui/Label";

interface InputFieldProps {
  id: string;
  label: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const InputField = ({
  id,
  label,
  required,
  register,
  errors,
  ...rest
}: InputFieldProps & Partial<InputProps>) => {
  return (
    <div className="grid grid-flow-row items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className={
          errors[id] ? "border-rose-600 focus-visible:ring-rose-400" : ""
        }
        {...register(id, { required })}
        {...rest}
      />
      {errors[id] && (
        <span className="text-sm font-medium text-destructive">
          {errors[id]?.message as string}
        </span>
      )}
    </div>
  );
};

export default InputField;
