export interface TeamsSchema {
  id: number;
  team_name: string;
  team_password: string;
  team_members: string;
  billable_hours: number;
  qr_code: string;
  created_at?: Date;
}

export type TeamProps = Pick<TeamsSchema, "id" | "team_name">;
