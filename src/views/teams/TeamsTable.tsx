import { Pencil, Trash2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

import EmptyData from "@/components/EmptyData";
import { SkeletonTableList } from "@/components/skeleton";
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
import { TeamsSchema } from "@/types/schema/teams";

interface TeamsTableProps {
  data: TeamsSchema[];
  className?: string;
  onDelete: (id: number) => void;
  isLoading: boolean;
  isSuccess: boolean;
}

const TeamsTable = ({
  data,
  className,
  onDelete,
  isLoading,
  isSuccess,
}: TeamsTableProps) => {
  const navigate = useNavigate();

  return (
    <>
      {isLoading && <SkeletonTableList />}

      {isSuccess && data.length >= 1 && (
        <div className={cn("border rounded-md border-border", className)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>QR Code</TableHead>
                <TableHead>Total Man Hrs.</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((team: TeamsSchema, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {team.team_name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {team.team_members}
                  </TableCell>
                  <TableCell>
                    <div className="w-8 p-0.5 border rounded-md border-border">
                      <QRCodeCanvas
                        id="qrcode-canvas"
                        value={team.qr_code}
                        className="!w-full !h-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{team.billable_hours.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex items-center justify-center p-0 rounded-full w-7 h-7"
                        onClick={() => navigate(`/${team.id}/edit`)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex items-center justify-center p-0 rounded-full w-7 h-7"
                        onClick={() => onDelete(team.id)}
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

export default TeamsTable;
