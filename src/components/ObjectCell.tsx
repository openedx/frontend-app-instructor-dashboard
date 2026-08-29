import { parseObject } from '@src/utils/formatters';

interface ObjectCellProps {
  value: Record<string, any> | null;
}

const ObjectCell = ({ value }: ObjectCellProps) => {
  return (
    <pre className="text-prewrap text-break">
      {parseObject(value ?? {})}
    </pre>
  );
};

export { ObjectCell };
