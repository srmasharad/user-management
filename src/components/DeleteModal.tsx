import { ReactNode } from "react";

import { Loader, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/AlertDialog";

interface DeleteModalProps {
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: () => void;
  title: ReactNode;
  children: ReactNode;
}

const DeleteModal = ({
  open,
  title,
  onClose,
  onDelete,
  isDeleting,
  children,
}: DeleteModalProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={isDeleting ? undefined : onClose}
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? (
              <Loader size={16} className="mr-2 animate-spin" />
            ) : (
              <Trash2 size={16} className="mr-2" />
            )}
            Yes! Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
