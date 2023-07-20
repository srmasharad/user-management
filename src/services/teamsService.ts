import { supabase } from "@/supabaseClient";
import { TeamProps, TeamsSchema } from "@/types/schema/teams";

export const getAllTeams = async () => {
  try {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as TeamsSchema[];
  } catch (error) {
    console.log(error);
  }
};

export const getTeamsById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as TeamsSchema;
  } catch (error) {
    console.log(error);
  }
};

export const getSearchTeams = async (query?: string) => {
  try {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .or(`team_name.ilike.%${String(query?.toLowerCase())}%`)
      .order("id", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as TeamsSchema[];
  } catch (error) {
    console.log(error);
  }
};

export const getSearchByManHours = async (hoursCount?: number) => {
  try {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .lte("billable_hours", hoursCount)
      .order("id", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as TeamsSchema[];
  } catch (error) {
    console.log(error);
  }
};

export const getTeamOptions = async () => {
  try {
    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        id,
        team_name
      `
      )
      .order("id", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as TeamProps[];
  } catch (error) {
    console.log(error);
  }
};

export const getTeamsCount = async () => {
  try {
    const { count, error } = await supabase
      .from("teams")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(error.message);
    }

    return count;
  } catch (error) {
    console.log(error);
  }
};
