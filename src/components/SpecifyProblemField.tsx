import { useState, useImperativeHandle, forwardRef } from 'react';
import { isAxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Form, Icon, OverlayTrigger, Tooltip, useToggle } from '@openedx/paragon';
import { InfoOutline, SpinnerIcon } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';
import { useProblemDetails } from '@src/data/apiHook';

interface SpecifyProblemFieldProps {
  buttonLabel: string;
  disabled?: boolean;
  fieldLabel: string;
  problemResponsesError?: string;
  usernameOrEmail?: string;
  onClickSelect: (problemLocation: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface SpecifyProblemFieldRef {
  reset: () => void;
}

const SpecifyProblemField = forwardRef<SpecifyProblemFieldRef, SpecifyProblemFieldProps>(({
  buttonLabel,
  disabled,
  fieldLabel,
  problemResponsesError,
  usernameOrEmail = '',
  onClickSelect,
}, ref) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [problemLocation, setProblemLocation] = useState('');
  const [showSelectedLocation, enableShowSelectedLocation, disableShowSelectedLocation] = useToggle(false);

  const { inputValue, handleChange, resetFilter } = useDebouncedFilter({
    filterValue: problemLocation,
    setFilter: setProblemLocation,
  });
  const { data = { breadcrumbs: [], name: '', id: '' }, refetch, error } = useProblemDetails(courseId, inputValue, usernameOrEmail);

  useImperativeHandle(ref, () => ({
    reset: () => {
      resetFilter();
      disableShowSelectedLocation();
    }
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);

    if (showSelectedLocation) {
      disableShowSelectedLocation();
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (inputValue) {
      refetch().then(() => {
        onClickSelect(inputValue, event);
        enableShowSelectedLocation();
      });
    }
  };

  return (
    <Form.Group className="mb-0" isInvalid={!!problemResponsesError} size="sm">
      <Form.Label className="d-flex align-content-end align-items-center gap-2 text-primary-500">
        {showSelectedLocation ? intl.formatMessage(messages.selectedProblem)
          : (
              <>
                {fieldLabel}
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip id="problem-location-tooltip" className="info-tooltip">
                      {intl.formatMessage(messages.problemLocationTooltip)}
                    </Tooltip>
                  )}
                >
                  <Icon src={InfoOutline} size="sm" aria-label={intl.formatMessage(messages.problemLocationInfoIconLabel)} />
                </OverlayTrigger>
              </>
            )}
      </Form.Label>
      <div className="d-flex align-items-center">
        {showSelectedLocation && data && !error ? (
          <div className="d-flex gap-3 align-items-center col-8 p-0">
            <div className="d-block w-100">
              <p className="x-small mb-0 text-primary-500 text-truncate">
                {data.breadcrumbs
                  .slice(1, -1)
                  .map(breadcrumb => breadcrumb.displayName)
                  .join(' > ')}
              </p>
              <p className="text-primary-500 mb-0">{data.name}</p>
              <p className="x-small text-gray-700 text-truncate mb-0">{data.id}</p>
            </div>
            <Button iconBefore={SpinnerIcon} onClick={disableShowSelectedLocation}>{intl.formatMessage(messages.change)}</Button>
          </div>
        ) : (
          <>
            <Form.Control
              type="text"
              placeholder={intl.formatMessage(messages.problemLocationPlaceholder)}
              value={inputValue}
              onChange={handleInputChange}
              className="flex-grow-1"
              size="md"
            />
            {problemResponsesError && (
              <Form.Control.Feedback type="invalid">
                {problemResponsesError}
              </Form.Control.Feedback>
            )}
            <Button
              variant="primary"
              onClick={handleClick}
              disabled={disabled || !inputValue}
              className="text-nowrap"
            >
              {buttonLabel}
            </Button>
          </>
        )}
      </div>
      {showSelectedLocation && error
      && isAxiosError(error)
      && ((error.response?.status === 400) || (error.response?.status === 404)) && (
        <p className="text-danger-500 mb-0 x-small mt-2">
          {intl.formatMessage(messages.problemNotFound, { identifier: inputValue })}
        </p>
      )}
    </Form.Group>
  );
});

SpecifyProblemField.displayName = 'SpecifyProblemField';

export default SpecifyProblemField;
