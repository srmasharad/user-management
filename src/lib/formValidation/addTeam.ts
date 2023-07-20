import { z } from "zod";

import { stringValidate } from "../helpers";

export const teamSchema = z.object({
  team_name: stringValidate,
  team_password: stringValidate,
  team_members: stringValidate,
  billable_hours: z
    .string()
    .nonempty("Required field")
    .regex(/^\d+$/, "Must be a positive number"),
});

export type TeamSchemaType = z.infer<typeof teamSchema>;
