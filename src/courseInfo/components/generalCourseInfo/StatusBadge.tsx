import { Badge } from '@openedx/paragon';

interface StatusBadgeProps {
  status: string;
}

const STATUS_VARIANTS: Record<string, string> = {
  active: 'success',
  archived: 'light',
  upcoming: 'warning',
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getBadgeVariant = (status: string) => {
    return STATUS_VARIANTS[status.toLowerCase()] || 'light';
  };

  return (
    <Badge variant={getBadgeVariant(status)} className="py-1.5 px-3 x-small font-weight-normal">{status}</Badge>
  );
};

export { StatusBadge };
