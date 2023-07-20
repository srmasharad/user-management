import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * `formatDate` convert date into "e.g; Jul 03, 2017" format.
 * @param date :: Date
 * @returns :: String
 */
export function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
