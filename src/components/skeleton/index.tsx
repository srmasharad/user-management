import { Separator } from "../ui/Separator";
import { Skeleton } from "../ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";

export const SkeletonTableList = () => {
  const rowlengths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const colLengths = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="border rounded-md border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {colLengths.map((index) => (
              <TableHead key={index}>
                <Skeleton className="h-4" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowlengths.map((index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const SkeletonUserDetail = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2 w-36" />
          <Skeleton className="w-24 h-2" />
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid items-start gap-4 mb-6 md:grid-cols-2">
        <div className="grid grid-flow-row items-center gap-1.5">
          <Skeleton className="w-20 h-1.5" />
          <Skeleton className="w-32 h-2" />
        </div>
        <div className="grid grid-flow-row items-center gap-1.5">
          <Skeleton className="w-20 h-1.5" />
          <Skeleton className="w-32 h-2" />
        </div>
        <div className="grid grid-flow-row items-center gap-1.5">
          <Skeleton className="w-20 h-1.5" />
          <Skeleton className="w-32 h-2" />
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid items-start gap-4 mb-6 md:grid-cols-2">
        <div className="grid grid-flow-row items-center gap-1.5">
          <Skeleton className="w-20 h-1.5" />
          <Skeleton className="w-32 h-2" />
        </div>
        <div className="grid grid-flow-row items-center gap-1.5">
          <Skeleton className="w-20 h-1.5" />
          <Skeleton className="w-32 h-2" />
        </div>
        <div className="grid grid-flow-row items-center gap-1.5">
          <Skeleton className="w-20 h-1.5" />
          <Skeleton className="w-32 h-2" />
        </div>
        <div className="grid grid-flow-row items-center gap-1.5">
          <Skeleton className="w-20 h-1.5" />
          <Skeleton className="w-32 h-2" />
        </div>
      </div>
    </>
  );
};
