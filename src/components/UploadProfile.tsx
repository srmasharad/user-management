import { ChangeEvent } from "react";

import { Check, Loader, UploadCloud } from "lucide-react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { useParams } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

interface UploadProfileProps {
  id: string;
  label: string;
  required?: boolean;
  avatarUrl: string;
  placeholder: string;
  isUploading: boolean;
  hasUploaded: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const UploadProfile = ({
  id,
  label,
  register,
  errors,
  avatarUrl,
  hasUploaded,
  isUploading,
  placeholder,
  onChange,
  required,
}: UploadProfileProps) => {
  const { empID } = useParams();
  return (
    <div className="flex items-center gap-6 mb-6">
      <Avatar className="w-20 h-20">
        <AvatarImage
          src={avatarUrl || placeholder}
          alt="avatar"
          className="object-cover object-center"
        />
        <AvatarFallback className="animate-pulse ">
          <div className="w-20 h-20 rounded-full bg-slate-200"></div>
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col max-w-sm gap-2">
        <Label htmlFor={id}>{label}</Label>

        <div className="flex items-center justify-start gap-2">
          <Button
            className="relative overflow-hidden"
            disabled={isUploading}
            variant="outline"
          >
            <UploadCloud size={20} className="mr-2" />
            <span>{`${empID ? "Change" : "Upload"} Profile Picture`}</span>
            <Input
              id={id}
              type="file"
              className="absolute top-0 right-0 w-full h-full opacity-0 cursor-pointer backdrop-opacity-0"
              {...register(id, { required })}
              onChange={
                isUploading
                  ? undefined
                  : (onChange as (event: ChangeEvent<HTMLInputElement>) => void)
              }
            />
          </Button>
          {isUploading && (
            <Loader size={16} className="text-slate-400 animate-spin" />
          )}
          {hasUploaded && !isUploading && (
            <Check
              size={16}
              strokeWidth={3}
              className="text-white bg-green-600 rounded-full p-0.5"
            />
          )}
        </div>
        {errors[id] && !avatarUrl && (
          <span className="text-sm font-medium text-destructive">
            {errors[id]?.message as string}
          </span>
        )}
      </div>
    </div>
  );
};

export default UploadProfile;
