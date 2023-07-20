import { ReactNode } from "react";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { BreadCrumbProps } from "@/types/Breadcrumb";

import BreadCrumb from "./ui/Breadcrumb";
import { Button } from "./ui/Button";
import { Separator } from "./ui/Separator";

interface PageHeaderProps {
  pageTitle: ReactNode;
  items: BreadCrumbProps["items"];
}

const PageHeader = ({ pageTitle, items }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-start mb-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="items-center justify-center flex-none w-10 h-10 p-2 rounded-full"
        >
          <ArrowLeft size={18} />
        </Button>
      </div>

      <h1 className="mb-1 text-lg font-medium">{pageTitle}</h1>
      <BreadCrumb items={items} />

      <Separator className="mb-6" />
    </>
  );
};

export default PageHeader;
