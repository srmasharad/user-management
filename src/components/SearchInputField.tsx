import { Loader, Search } from "lucide-react";

import { cn } from "@/lib/utils";

import { Input, InputProps } from "./ui/Input";

interface SearchInputFieldProps extends Partial<InputProps> {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isSearching: boolean;
  placeholder?: string;
  className?: string;
}

const SearchInputField = ({
  name,
  onChange,
  onKeyDown,
  placeholder,
  isSearching,
  className,
  ...props
}: SearchInputFieldProps) => {
  return (
    <div className="flex flex-row items-center gap-1.5">
      <label htmlFor={name} className="sr-only">
        Search
      </label>
      <div className="relative">
        <div className="absolute flex justify-center items-center h-full top-0 left-0 text-slate-600 w-9">
          <Search size={15} />
        </div>
        <Input
          type="text"
          id={name}
          placeholder={placeholder}
          aria-label="Search"
          className={cn("pl-8", className)}
          onChange={onChange}
          onKeyDown={onKeyDown}
          {...props}
        />
        {isSearching && (
          <div className="absolute flex justify-center items-center h-full top-0 right-0 w-9">
            <Loader size={16} className="text-slate-400 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInputField;
