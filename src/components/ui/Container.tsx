import { cn } from '@/lib/utils';

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("container 2xl:container my-6", className)}>{children}</div>;
};

export default Container;
