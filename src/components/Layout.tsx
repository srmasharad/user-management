import { User, Users } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { getEmployeesCount } from "@/services/employeesService";
import { getTeamsCount } from "@/services/teamsService";
import { useQuery } from "@tanstack/react-query";

import Container from "./ui/Container";

const Layout = () => {
  const { pathname } = useLocation();

  // Get the employee count
  const { data: empCount } = useQuery({
    queryKey: ["employee-count"],
    queryFn: () => getEmployeesCount(),
  });

  // Get the employee count
  const { data: teamCount } = useQuery({
    queryKey: ["team-count"],
    queryFn: () => getTeamsCount(),
  });

  return (
    <Container>
      <h1 className="mb-4 text-lg font-medium">Manage Users</h1>

      <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
        {pathname === "/" && (
          <div className="border rounded-md shadow bg-card text-card-foreground">
            <div className="flex flex-row items-center justify-between p-6 pb-2 space-y-0">
              <h3 className="text-sm font-medium tracking-tight">Teams</h3>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{teamCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </div>
          </div>
        )}

        <div className="border rounded-md shadow bg-card text-card-foreground">
          <div className="flex flex-row items-center justify-between p-6 pb-2 space-y-0">
            <h3 className="text-sm font-medium tracking-tight">Employees</h3>
            <User className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{empCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-start mb-6">
        <div className="grid items-center justify-center h-10 grid-cols-2 p-1 rounded-md bg-muted text-muted-foreground">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-5 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                isActive ? "bg-background text-foreground shadow-sm" : ""
              }`
            }
          >
            <Users size={18} className="mr-1.5" /> Teams
          </NavLink>
          <NavLink
            to="employees"
            className={({ isActive }) =>
              `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-5 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                isActive ? "bg-background text-foreground shadow-sm" : ""
              }`
            }
          >
            <User size={18} className="mr-1.5" /> Employees
          </NavLink>
        </div>
      </div>

      <Outlet />
    </Container>
  );
};

export default Layout;
