import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { isAxiosError } from 'axios';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl, ModalDialog, Stack } from '@openedx/paragon';
import ActionCard, { ActionCardProps } from '@src/components/ActionCard';
import SpecifyLearnerField from '@src/components/SpecifyLearnerField';
import SpecifyProblemField from '@src/components/SpecifyProblemField';
import { useChangeScore, useDeleteHistory, useRescoreSubmission, useResetAttempts } from '@src/grading/data/apiHook';
import messages from '@src/grading/messages';
import { GradingToolsType } from '@src/grading/types';
import { useLearner, usePendingTasks, useProblemDetails } from '@src/data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';

interface GradingLearnerContentProps {
  toolType: GradingToolsType,
  onShowTasks: () => void,
}

const GradingLearnerContent = ({ toolType, onShowTasks }: GradingLearnerContentProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [blockId, setBlockId] = useState('');
  const [score, setScore] = useState('');
  const learnerFieldRef = useRef<{ reset: () => void }>(null);
  const problemFieldRef = useRef<{ reset: () => void }>(null);
  const [showCurrentStatus, setShowCurrentStatus] = useState(false);
  const [confirmationModalData, setConfirmationModalData] = useState<{ message: string, confirmButtonLabel: string, action?: () => void }>({ message: '', confirmButtonLabel: '', action: undefined });
  const { data: problemData = { currentScore: { score: 0, total: null }, attempts: { current: null, total: 0 } }, isError: isProblemDataError, refetch: refetchProblemData } = useProblemDetails(courseId, blockId, usernameOrEmail);
  const { data: learnerData = { username: '', progressUrl: '' } } = useLearner(courseId, usernameOrEmail);
  const { showModal, showToast } = useAlert();

  const { mutate: resetAttempts } = useResetAttempts(courseId);
  const { mutate: deleteHistory } = useDeleteHistory(courseId);
  const { mutate: changeScore } = useChangeScore(courseId);
  const { mutate: rescoreSubmission } = useRescoreSubmission(courseId);
  const { refetch: refetchTasks } = usePendingTasks(courseId);

  const resetConfirmationModalData = () => setConfirmationModalData({ message: '', confirmButtonLabel: '', action: undefined });

  const manageOnError = (error: Error) => {
    resetConfirmationModalData();
    const errorMessage = isAxiosError(error) && error.response?.data?.error ? error.response.data.error : intl.formatMessage(messages.unexpectedError);
    showModal({
      message: errorMessage,
      variant: 'danger',
      confirmText: intl.formatMessage(messages.close),
    });
  };

  const handleResetAttempts = (): void => {
    resetAttempts({ learner: usernameOrEmail, problem: blockId }, {
      onSuccess: () => {
        resetConfirmationModalData();
        refetchProblemData();
        showToast(intl.formatMessage(messages.resetAttemptsSuccess, { student: usernameOrEmail || intl.formatMessage(messages.allLearners), blockId }));
      },
      onError: manageOnError
    });
  };

  const handleRescoreSubmission = (onlyIfHigher = false): void => {
    rescoreSubmission({ learner: usernameOrEmail, problem: blockId, onlyIfHigher }, {
      onSuccess: () => {
        resetConfirmationModalData();
        showToast(intl.formatMessage(messages.rescoreSubmissionSuccess, { student: usernameOrEmail || intl.formatMessage(messages.allLearners), blockId }));
      },
      onError: manageOnError
    });
  };

  const handleDeleteHistory = (): void => {
    deleteHistory({ learner: usernameOrEmail, problem: blockId }, {
      onSuccess: () => {
        resetConfirmationModalData();
        showToast(intl.formatMessage(messages.deleteHistorySuccess, { student: usernameOrEmail || intl.formatMessage(messages.allLearners), blockId }));
      },
      onError: manageOnError
    });
  };

  const handleOverrideScore = (): void => {
    changeScore({ learner: usernameOrEmail, problem: blockId, newScore: Number(score) }, {
      onSuccess: () => {
        resetConfirmationModalData();
        showToast(intl.formatMessage(messages.overrideScoreSuccess, { student: usernameOrEmail || intl.formatMessage(messages.allLearners), blockId }));
      },
      onError: manageOnError
    });
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const numericRegex = /^-?\d*\.?\d*$/;

    if (numericRegex.test(value) || value === '') {
      setScore(value);
    }
  };

  const confirmationInfo = {
    resetAttempts: {
      message: messages.resetAttemptsConfirmation,
      confirmButtonLabel: messages.resetAttempts,
      action: handleResetAttempts,
    },
    deleteState: {
      message: messages.deleteStateConfirmation,
      confirmButtonLabel: messages.deleteStateButtonLabel,
      action: handleDeleteHistory,
    },
    overrideScore: {
      message: messages.overrideScoreConfirmation,
      confirmButtonLabel: messages.rescore,
      action: handleOverrideScore,
    },
    rescore: {
      message: messages.rescoreConfirmation,
      confirmButtonLabel: messages.rescore,
      action: () => handleRescoreSubmission(),
    },
    rescoreIfImproves: {
      message: messages.rescoreConfirmation,
      confirmButtonLabel: messages.rescore,
      action: () => handleRescoreSubmission(true),
    }
  };

  const openConfirmationModal = (type: keyof typeof confirmationInfo): void => {
    const { message, confirmButtonLabel, action } = confirmationInfo[type];
    setConfirmationModalData({ message: intl.formatMessage(message, { student: usernameOrEmail || intl.formatMessage(messages.allLearners), blockId }), confirmButtonLabel: intl.formatMessage(confirmButtonLabel), action });
  };

  const handleTaskStatusClick = (): void => {
    refetchTasks();
    onShowTasks();
  };

  useEffect(() => {
    setUsernameOrEmail('');
    setBlockId('');
    setScore('');
    setShowCurrentStatus(false);
    learnerFieldRef.current?.reset();
    problemFieldRef.current?.reset();
  }, [toolType]);

  const singleLearnerActionRows: ActionCardProps[] = [
    {
      title: intl.formatMessage(messages.resetAttempts),
      description: intl.formatMessage(messages.resetAttemptsDescription),
      customAction: (
        <Button disabled={!usernameOrEmail || !blockId} onClick={() => openConfirmationModal('resetAttempts')}>
          {intl.formatMessage(messages.resetAttemptsButtonLabel)}
        </Button>
      )
    },
    {
      title: intl.formatMessage(messages.rescoreSubmission),
      description: intl.formatMessage(messages.rescoreSubmissionDescription),
      customAction: (
        <div className="d-flex flex-column gap-3">
          <Button disabled={!usernameOrEmail || !blockId} onClick={() => openConfirmationModal('rescore')}>
            {intl.formatMessage(messages.rescoreSubmissionButtonLabel)}
          </Button>
          <Button disabled={!usernameOrEmail || !blockId} onClick={() => openConfirmationModal('rescoreIfImproves')}>
            {intl.formatMessage(messages.rescoreIfImprovesScoreButtonLabel)}
          </Button>
        </div>
      ),
    },
    {
      title: intl.formatMessage(messages.overrideScore),
      description: intl.formatMessage(messages.overrideScoreDescription),
      buttonLabel: intl.formatMessage(messages.overrideScoreButtonLabel),
      customAction: (
        <div className="d-flex align-items-center gap-2">
          <FormControl
            name={intl.formatMessage(messages.overrideScorePlaceholder)}
            type="number"
            placeholder={intl.formatMessage(messages.overrideScorePlaceholder)}
            value={score}
            onChange={handleScoreChange}
          />
          <Button disabled={!usernameOrEmail || !blockId || !score} onClick={() => openConfirmationModal('overrideScore')}>{intl.formatMessage(messages.overrideScoreButtonLabel)}</Button>
        </div>
      )
    },
    {
      title: intl.formatMessage(messages.deleteHistory),
      description: intl.formatMessage(messages.deleteHistoryDescription),
      customAction: (
        <div className="d-flex flex-column gap-3">
          <Button disabled={!usernameOrEmail || !blockId} onClick={() => openConfirmationModal('deleteState')}>{intl.formatMessage(messages.deleteHistoryButtonLabel)}</Button>
        </div>
      ),
    },
    {
      title: intl.formatMessage(messages.taskStatus),
      description: intl.formatMessage(messages.taskStatusDescription),
      customAction: (
        <Button disabled={!usernameOrEmail || !blockId} onClick={handleTaskStatusClick}>
          {intl.formatMessage(messages.taskStatusButtonLabel)}
        </Button>
      )
    }
  ];

  const allLearnersActionRows = [
    {
      title: intl.formatMessage(messages.resetAttempts),
      description: intl.formatMessage(messages.resetAllLearnersAttemptsDescription),
      buttonLabel: intl.formatMessage(messages.resetAttemptsButtonLabel),
      customAction: (
        <Button disabled={!blockId} onClick={() => openConfirmationModal('resetAttempts')}>
          {intl.formatMessage(messages.resetAttemptsButtonLabel)}
        </Button>
      )
    },
    {
      title: intl.formatMessage(messages.rescoreSubmission),
      description: intl.formatMessage(messages.rescoreSubmissionAllLearnersDescription),
      customAction: (
        <div className="d-flex flex-column gap-3">
          <Button disabled={!blockId} onClick={() => openConfirmationModal('rescore')}>{intl.formatMessage(messages.rescoreAllSubmissionButtonLabel)}</Button>
          <Button disabled={!blockId} onClick={() => openConfirmationModal('rescoreIfImproves')}>{intl.formatMessage(messages.rescoreIfImprovesScoreButtonLabel)}</Button>
        </div>
      ),
    },
    {
      title: intl.formatMessage(messages.taskStatus),
      description: intl.formatMessage(messages.taskStatusDescription),
      customAction: (
        <Button onClick={handleTaskStatusClick}>
          {intl.formatMessage(messages.taskStatusButtonLabel)}
        </Button>
      )
    }
  ];

  const rows = toolType === 'single' ? singleLearnerActionRows : allLearnersActionRows;

  const handleProblemChange = (location: string): void => {
    setBlockId(location);
    if (usernameOrEmail && location) {
      setShowCurrentStatus(true);
    }
  };

  const handleLearnerChange = (usernameOrEmail: string): void => {
    setUsernameOrEmail(usernameOrEmail);
    // Reset problem field when learner changes due to progress and attempts change for every learner
    setBlockId('');
    problemFieldRef.current?.reset();
    if (showCurrentStatus) {
      setShowCurrentStatus(false);
    }
  };

  return (
    <>
      <p className="x-small text-primary mt-3">
        {
          toolType === 'single'
            ? intl.formatMessage(messages.descriptionSingleLearner)
            : intl.formatMessage(messages.descriptionAllLearners)
        }
      </p>
      <div className="d-flex justify-content-between gap-4">
        {toolType === 'single' && (
          <div className="w-50">
            <SpecifyLearnerField ref={learnerFieldRef} onClickSelect={handleLearnerChange} />
          </div>
        )}
        <div className="w-50">
          <SpecifyProblemField
            ref={problemFieldRef}
            fieldLabel={intl.formatMessage(messages.specifyProblem)}
            buttonLabel={intl.formatMessage(messages.select)}
            disabled={!usernameOrEmail && toolType === 'single'}
            usernameOrEmail={usernameOrEmail}
            onClickSelect={handleProblemChange}
          />
        </div>
      </div>
      {
        showCurrentStatus && learnerData.username && !isProblemDataError && (
          <>
            <p className="text-primary-500 x-small mb-0 mt-3">{intl.formatMessage(messages.currentScore)}</p>
            <Stack direction="horizontal" gap={2} className="align-items-center justify-content-between mr-3.5">
              <Stack direction="horizontal" gap={5} className="align-items-end">
                <p className="text-primary-500 mb-0">{learnerData.username}</p>
                <Stack className="align-items-center">
                  <p className="x-small mb-0 text-gray-500">{intl.formatMessage(messages.score)}</p>
                  <p className="lead m-0 text-primary-700">{problemData.currentScore?.score || 0} {problemData.currentScore?.total && `/ ${problemData.currentScore.total}`}</p>
                </Stack>
                <Stack className="align-items-center">
                  <p className="x-small mb-0 text-gray-500">{intl.formatMessage(messages.attempts)}</p>
                  <p className="lead m-0 text-primary-700">{problemData.attempts?.current || 0} {problemData.attempts?.total && `/ ${problemData.attempts.total}`}</p>
                </Stack>
              </Stack>
              <Button as="a" href={learnerData.progressUrl} className="bg-white" variant="outline-primary">{intl.formatMessage(messages.viewProgress)}</Button>
            </Stack>
          </>
        )
      }
      {
        rows.map(({ title, description, buttonLabel, customAction, onButtonClick }, index) => (
          <ActionCard key={title} buttonLabel={buttonLabel} description={description} title={title} hasBorderBottom={index !== rows.length - 1} customAction={customAction} onButtonClick={onButtonClick} />
        ))
      }
      {
        confirmationModalData.message !== '' && (
          <ModalDialog
            title={confirmationModalData.confirmButtonLabel}
            isOpen={confirmationModalData.message !== ''}
            onClose={() => setConfirmationModalData({ message: '', confirmButtonLabel: '', action: undefined })}
            isOverflowVisible={false}
            hasCloseButton={false}
          >
            <ModalDialog.Body className="pt-4">
              <p className="text-break">{confirmationModalData.message}</p>
            </ModalDialog.Body>
            <ModalDialog.Footer>
              <Button variant="tertiary" onClick={() => setConfirmationModalData({ message: '', confirmButtonLabel: '', action: undefined })}>{intl.formatMessage(messages.close)}</Button>
              <Button className="ml-2" onClick={confirmationModalData.action}>{confirmationModalData.confirmButtonLabel}</Button>
            </ModalDialog.Footer>
          </ModalDialog>
        )
      }
    </>
  );
};

export default GradingLearnerContent;
