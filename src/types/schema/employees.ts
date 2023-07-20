import { TeamProps } from "./teams";

export interface EmployeesSchema {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  job_position: string;
  team: TeamProps;
  start_at: string;
  ends_in: string;
  billable_hours: number;
  avatar: string;
  created_at?: Date;
}

export type EmployeeProps = Pick<
  EmployeesSchema,
  "id" | "avatar" | "first_name" | "middle_name" | "last_name"
>;
