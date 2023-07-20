import { FolderOpen } from "lucide-react";

const EmptyData = () => {
  return (
    <div className="flex items-center justify-center py-14 md:py-20 bg-slate-100 rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <FolderOpen size={32} strokeWidth={1.5} />
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="font-medium">No data to display</h1>
          <p className="text-slate-500">
            No data available. Please start adding your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyData;
