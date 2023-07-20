import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import EmptyData from "@/components/EmptyData";
import { SkeletonTableList } from "@/components/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import { EmployeesSchema } from "@/types/schema/employees";

interface EmployeesTableProps {
  data: EmployeesSchema[];
  onDelete: (id: number) => void;
  isLoading: boolean;
  isSuccess: boolean;
  onSheetOpen?: (id: number) => void;
  className?: string;
}

const EmployeesTable = ({
  data,
  className,
  onDelete,
  isLoading,
  isSuccess,
  onSheetOpen,
}: EmployeesTableProps) => {
  const navigate = useNavigate();

  return (
    <>
      {isLoading && <SkeletonTableList />}

      {isSuccess && data.length >= 1 && (
        <div className={cn("border rounded-md border-border", className)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Current Team</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Billable Hours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((emp: EmployeesSchema, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{emp.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={emp.avatar}
                          alt={`${emp.id}-${emp.first_name} avatar`}
                          className="object-cover object-center"
                          loading="eager"
                        />
                        <AvatarFallback className="animate-pulse ">
                          <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                        </AvatarFallback>
                      </Avatar>
                      {`${emp.first_name} ${emp.middle_name ?? ""} ${
                        emp.last_name
                      }`}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {emp.team === null ? (
                      <span className="text-green-600">Available</span>
                    ) : (
                      emp.team.team_name
                    )}
                  </TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.job_position}</TableCell>
                  <TableCell>{emp.billable_hours} hours/week</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex items-center justify-center p-0 rounded-full w-7 h-7"
                        onClick={() => onSheetOpen?.(emp.id)}
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex items-center justify-center p-0 rounded-full w-7 h-7"
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex items-center justify-center p-0 rounded-full w-7 h-7"
                        onClick={() => onDelete(emp.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {data && data.length < 1 && <EmptyData />}
    </>
  );
};

export default EmployeesTable;
