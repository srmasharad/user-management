import { Dot } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { BreadCrumbProps } from "@/types/Breadcrumb";

const BreadCrumb = ({ items, className }: BreadCrumbProps) => {
  return (
    <nav
      className={cn("justify-between mb-4", className)}
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center">
        <li>
          <div className="flex items-center">
            <NavLink
              to="/"
              className="text-[13px] font-medium text-slate-500 hover:text-primary"
            >
              Manage Users
            </NavLink>
          </div>
        </li>
        {items &&
          items.map((item, index) => (
            <li key={index} aria-current="page">
              <div className="flex items-center">
                <Dot className="text-slate-300" />
                {item.isCurrent ? (
                  <div className="text-[13px] font-medium">{item.name}</div>
                ) : (
                  <NavLink
                    to={item.path}
                    className="text-[13px] font-medium text-slate-500 hover:text-primary"
                  >
                    {item.name}
                  </NavLink>
                )}
              </div>
            </li>
          ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
