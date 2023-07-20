import { z } from "zod";

import {
  emailValidate,
  isValidTime12HourFormat,
  phoneValidate,
  stringNotRequired,
  stringValidate,
  timeRegex,
} from "../helpers";

export const employeeSchema = z.object({
  avatar: z.any().refine((file: File) => file?.length == 1, "Required field."),
  first_name: stringValidate,
  middle_name: stringNotRequired,
  last_name: stringValidate,
  dob: z.coerce
    .date({
      required_error: "Required field",
    })
    .min(new Date("1920-01-01"), "Date cannot go past January 1, 1920")
    .max(new Date(), "Date must be in the past")
    .refine(
      (date) => {
        const ageDifMs = Date.now() - date.getTime();
        const ageDate = new Date(ageDifMs);

        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        return age >= 18;
      },
      { message: "You must be 18 years or older" }
    ),
  gender: stringValidate,
  address: stringNotRequired,
  phone: phoneValidate,
  email: emailValidate,
  job_position: stringValidate,
  team: z.string().optional().or(z.literal("")),
  start_at: z
    .string()
    .nonempty("Required field")
    .regex(timeRegex, "Invalid start time format (HH:MM AM/PM)")
    .refine(
      (start_at) => isValidTime12HourFormat(start_at),
      "Invalid start time"
    ),
  ends_in: z
    .string()
    .nonempty("Required field")
    .regex(timeRegex, "Invalid start time format (HH:MM AM/PM)")
    .refine((ends_in) => isValidTime12HourFormat(ends_in), "Invalid end time"),
  billable_hours: z
    .string()
    .nonempty("Required field")
    .regex(/^\d+$/, "Must be a positive number"),
});

export type EmployeeSchemaType = z.infer<typeof employeeSchema>;
