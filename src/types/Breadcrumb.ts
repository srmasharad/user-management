export interface BreadCrumbProps {
  items: {
    path: string;
    name: string;
    isCurrent?: boolean;
  }[];
  className?: string;
}
