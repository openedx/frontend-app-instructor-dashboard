import React, { FC } from 'react';
import { formatNumberWithCommas } from './utils';

interface EnrollmentCounterProps {
  label: string;
  count: string | number;
  icon?: React.ReactNode;
}

const EnrollmentCounter: FC<EnrollmentCounterProps> = (props) => {
  const renderCounter = () => {
    return (<p className="text-primary-500 lead mb-0">{formatNumberWithCommas(props.count)}</p>);
  };

  const renderCounterWithIcon = () => {
    return (
      <div className="d-flex align-items-center">
        {props.icon}
        {renderCounter()}
      </div>
    );
  };

  return (
    <div className="flex-row">
      <p className="text-gray-500 x-small mb-1">{props.label}</p>
      { props.icon ? renderCounterWithIcon() : renderCounter() }
    </div>
  );
};

export { EnrollmentCounter };
