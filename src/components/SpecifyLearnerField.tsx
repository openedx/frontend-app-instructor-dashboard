import { useState, ChangeEvent, useImperativeHandle, forwardRef } from 'react';
import { isAxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { Avatar, Button, FormControl, FormGroup, FormLabel, useToggle } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { SpinnerIcon } from '@openedx/paragon/icons';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';
import { useCourseInfo, useLearner } from '@src/data/apiHook';
import { SelectedLearner } from '@src/types';
import messages from './messages';

interface SpecifyLearnerFieldProps {
  learner?: SelectedLearner;
  onClickSelect: (emailOrUsername: string) => void;
}

interface SpecifyLearnerFieldRef {
  reset: () => void;
}

type ErrorState = 'not_enrolled' | 'not_found' | 'generic_error' | null;

const errorMessages = {
  not_found: messages.learnerNotFound,
  generic_error: messages.learnerGenericError,
  not_enrolled: messages.learnerNotEnrolled,
};

const getErrorState = (error: Error | null, data?: SelectedLearner): ErrorState => {
  const isNotFoundError = isAxiosError(error)
    && (error.response?.status === 404 || error.response?.status === 400);

  if (isNotFoundError) return 'not_found';
  if (data && !data.isEnrolled) return 'not_enrolled';
  if (error && !isNotFoundError) return 'generic_error';
  return null;
};

const initialLearnerState = {
  username: '',
  fullName: '',
  email: '',
  isEnrolled: false,
};

const SpecifyLearnerField = forwardRef<SpecifyLearnerFieldRef, SpecifyLearnerFieldProps>(({ learner, onClickSelect }, ref) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [identifier, setIdentifier] = useState('');
  const [showLearner, enableShowLearner, disableShowLearner] = useToggle(!!learner);
  const [errorState, setErrorState] = useState<ErrorState>(null);
  const { data: courseInfo } = useCourseInfo(courseId);
  const permissions = courseInfo?.permissions || { admin: false, dataResearcher: false };
  const { inputValue, handleChange, resetFilter } = useDebouncedFilter({
    filterValue: identifier,
    setFilter: setIdentifier,
  });
  const { data, refetch } = useLearner(courseId, inputValue);

  const resetState = () => {
    resetFilter();
    onClickSelect('');
    disableShowLearner();
    setErrorState(null);
  };

  useImperativeHandle(ref, () => ({
    reset: resetState,
  }));

  const selectedLearner = learner || data || initialLearnerState;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value);

    if (errorState) {
      setErrorState(null);
    }

    if (showLearner) {
      disableShowLearner();
    }
  };

  const handleClickSelect = () => {
    if (inputValue) {
      refetch().then((result) => {
        // Need to pass empty value if learner is not valid to clear out any previously selected learner
        // We could have other conditions/fields depending on valid learner
        const formValue = !result.error && result.data?.isEnrolled ? inputValue : '';

        setErrorState(getErrorState(result.error, result?.data));
        onClickSelect(formValue);
        enableShowLearner();
      });
    }
  };

  return (
    <FormGroup className="mb-0" size="sm">
      <FormLabel className="text-primary-500 d-flex">{selectedLearner.username ? intl.formatMessage(messages.selectedLearner) : intl.formatMessage(messages.specifyLearner)}</FormLabel>
      <div className="d-flex align-items-center">
        <FormControl
          className={`mr-2 ${selectedLearner.username && showLearner ? 'd-none' : ''}`}
          name="emailOrUsername"
          placeholder={intl.formatMessage(messages.specifyLearnerPlaceholder)}
          size="md"
          autoResize
          value={inputValue}
          onChange={handleInputChange}
        />
        {selectedLearner.username && showLearner ? (
          <>
            <Avatar className="mr-2.5" size="sm" />
            <div className="d-flex flex-column mr-3 text-primary-500">
              <p className="mb-0">{selectedLearner.username}</p>
              {(permissions.admin || permissions.dataResearcher)
              && (
                <div className="d-flex x-small">
                  <p className="mr-3 mb-0">{selectedLearner.fullName}</p>
                  <p className="mb-0">{selectedLearner.email}</p>
                </div>
              )}
            </div>
            {!learner && <Button iconBefore={SpinnerIcon} onClick={resetState}>{intl.formatMessage(messages.change)}</Button>}
          </>
        ) : (
          <Button onClick={handleClickSelect} disabled={!inputValue}>{intl.formatMessage(messages.select)}</Button>
        )}
      </div>
      {showLearner && errorState && (
        <p className="text-danger-500 mb-0 x-small mt-2">
          {intl.formatMessage(errorMessages[errorState], { identifier: inputValue })}
        </p>
      )}
    </FormGroup>
  );
});

SpecifyLearnerField.displayName = 'SpecifyLearnerField';

export default SpecifyLearnerField;
