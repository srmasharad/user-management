import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { EmployeesSchema } from "@/types/schema/employees";

import { SkeletonUserDetail } from "./skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Separator } from "./ui/Separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/Sheet";

interface EmployeeDetailSheetProps {
  data: EmployeesSchema;
  onOpen: boolean;
  onClose: () => void;
  employeeId: number;
  isLoading: boolean;
  isSuccess: boolean;
}

const EmployeeDetailSheet = ({
  data,
  onOpen,
  onClose,
  employeeId,
  isLoading,
  isSuccess,
}: EmployeeDetailSheetProps) => {
  const navigate = useNavigate();

  return (
    <Sheet open={onOpen}>
      <SheetContent onClose={onClose}>
        <SheetHeader className="mb-6">
          <SheetTitle>Employee Information</SheetTitle>
        </SheetHeader>

        {isLoading && <SkeletonUserDetail />}

        {isSuccess && (
          <>
            <div className="flex flex-col gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={data.avatar}
                  alt={`${data.id}-${data.first_name} avatar`}
                  className="object-cover object-center"
                  loading="eager"
                />
                <AvatarFallback className="animate-pulse ">
                  <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="text-base font-semibold">{`${data.first_name} ${
                  data.middle_name ?? ""
                } ${data.last_name}`}</h2>
                <h3 className="text-[13px] text-muted-foreground">
                  {data.email}
                </h3>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid items-start gap-4 mb-6 md:grid-cols-2">
              <div className="grid grid-flow-row items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Designation
                </Label>
                <div className="text-sm">{data.job_position}</div>
              </div>
              <div className="grid grid-flow-row items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">Contact</Label>
                <div className="text-sm">{data.phone}</div>
              </div>
              <div className="grid grid-flow-row items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">Address</Label>
                <div className="text-sm">{data.address}</div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid items-start gap-4 mb-6 md:grid-cols-2">
              <div className="grid grid-flow-row items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">DOB</Label>
                <div className="text-sm">
                  {new Date(data?.dob).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </div>
              </div>
              <div className="grid grid-flow-row items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">Gender</Label>
                <div className="text-sm">{data?.gender}</div>
              </div>
              <div className="grid grid-flow-row items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Start/End
                </Label>
                <div className="text-sm">{`${data?.start_at?.toUpperCase()} - ${data?.ends_in?.toUpperCase()}`}</div>
              </div>
              <div className="grid grid-flow-row items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Billable Hours
                </Label>
                <div className="text-sm">{`${data?.billable_hours} hours`}</div>
              </div>
            </div>
          </>
        )}

        <SheetFooter className="absolute bottom-0 left-0 z-10 w-full px-4 py-3 bg-white border-t-[1px]">
          <Button
            onClick={() =>
              !isLoading
                ? navigate(`/employees/${Number(employeeId)}/edit`)
                : undefined
            }
            disabled={isLoading}
            className="px-6"
          >
            <Pencil size={14} className="mr-2" />
            Edit Profile
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeDetailSheet;
