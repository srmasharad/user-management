import { supabase } from "@/supabaseClient";
import { EmployeeProps, EmployeesSchema } from "@/types/schema/employees";

export const getAllEmployees = async () => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select(`*, team(id, team_name)`)
      .order("id", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as EmployeesSchema[];
  } catch (error) {
    console.log(error);
  }
};

export const getEmployeesById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select(`*, team(id, team_name)`)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as EmployeesSchema;
  } catch (error) {
    console.log(error);
  }
};

export const getSearchEmployees = async (query?: string) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select(`*, team(id, team_name)`)
      .or(
        `first_name.ilike.%${String(
          query?.toLowerCase()
        )}%,middle_name.ilike.%${String(
          query?.toLowerCase()
        )}%,last_name.ilike.%${String(
          query?.toLowerCase()
        )}%,email.ilike.%${String(
          query?.toLowerCase()
        )}%,job_position.ilike.%${String(
          query?.toLowerCase()
        )}%,phone.ilike.%${String(query?.toLowerCase())}%`
      )
      .order("id", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as EmployeesSchema[];
  } catch (error) {
    console.log(error);
  }
};

export const getEmployeeOptions = async () => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select(`first_name,middle_name,last_name`)
      .order("id", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as EmployeeProps[];
  } catch (error) {
    console.log(error);
  }
};

export const getEmployeesCount = async () => {
  try {
    const { count, error } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(error.message);
    }

    return count;
  } catch (error) {
    console.log(error);
  }
};
