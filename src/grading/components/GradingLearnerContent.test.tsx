import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GradingLearnerContent from '@src/grading/components/GradingLearnerContent';
import { useChangeScore, useDeleteHistory, useRescoreSubmission, useResetAttempts } from '@src/grading/data/apiHook';
import { useLearner, usePendingTasks, useProblemDetails } from '@src/data/apiHook';
import messages from '@src/grading/messages';
import { renderWithAlertAndIntl } from '@src/testUtils';

// Mock dependencies
jest.mock('@src/grading/data/apiHook');
jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  usePendingTasks: jest.fn(),
  useProblemDetails: jest.fn(),
  useLearner: jest.fn(),
}));

jest.mock('@src/components/SpecifyLearnerField', () => ({
  __esModule: true,
  default: ({ onClickSelect }: { onClickSelect: (value: string) => void }) => (
    <div data-testid="specify-learner-field">
      <button onClick={() => onClickSelect('testuser@example.com')}>
        Select Learner
      </button>
    </div>
  ),
}));
jest.mock('@src/components/SpecifyProblemField', () => ({
  __esModule: true,
  default: ({ onClickSelect, disabled }: { onClickSelect: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void, disabled?: boolean }) => (
    <div data-testid="specify-problem-field">
      <button
        onClick={(event) => onClickSelect('block-v1:test+problem', event)}
        disabled={disabled}
      >
        Select Problem
      </button>
    </div>
  ),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

const mockUseResetAttempts = useResetAttempts as jest.MockedFunction<typeof useResetAttempts>;
const mockUseDeleteHistory = useDeleteHistory as jest.MockedFunction<typeof useDeleteHistory>;
const mockUseChangeScore = useChangeScore as jest.MockedFunction<typeof useChangeScore>;
const mockUseRescoreSubmission = useRescoreSubmission as jest.MockedFunction<typeof useRescoreSubmission>;
const mockUsePendingTasks = usePendingTasks as jest.MockedFunction<typeof usePendingTasks>;

const defaultProps = {
  toolType: 'single' as const,
  onShowTasks: jest.fn(),
};

describe('GradingLearnerContent', () => {
  const mockMutateReset = jest.fn().mockResolvedValue({ success: true });
  const mockMutateDelete = jest.fn();
  const mockMutateChangeScore = jest.fn();
  const mockMutateRescore = jest.fn();
  const mockRefetch = jest.fn();

  const axiosError = (msg = 'custom error') => ({
    isAxiosError: true,
    response: { data: { error: msg } },
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseResetAttempts.mockReturnValue({ mutate: mockMutateReset } as any);
    mockUseDeleteHistory.mockReturnValue({ mutate: mockMutateDelete } as any);
    mockUseChangeScore.mockReturnValue({ mutate: mockMutateChangeScore } as any);
    mockUseRescoreSubmission.mockReturnValue({ mutate: mockMutateRescore } as any);
    mockUsePendingTasks.mockReturnValue({ refetch: mockRefetch } as any);
    (useLearner as jest.Mock).mockReturnValue({ data: { username: 'testuser', email: 'testuser@example.com', progressUrl: '/progress' }, isLoading: false, error: null });
    (useProblemDetails as jest.Mock).mockReturnValue({ data: { currentScore: { score: 0, total: null }, attempts: { current: 1, total: 1 } }, isLoading: false, error: null, refetch: jest.fn() });
  });

  it('renders correctly for single learner mode', () => {
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    expect(screen.getByText(messages.descriptionSingleLearner.defaultMessage)).toBeInTheDocument();
    expect(screen.getByTestId('specify-learner-field')).toBeInTheDocument();
    expect(screen.getByTestId('specify-problem-field')).toBeInTheDocument();

    // Check that all action cards are rendered
    expect(screen.getByText(messages.resetAttempts.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.rescoreSubmission.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.overrideScore.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.deleteHistory.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.taskStatus.defaultMessage)).toBeInTheDocument();
  });

  it('renders correctly for all learners mode', () => {
    renderWithAlertAndIntl(
      <GradingLearnerContent
        {...defaultProps}
        toolType="all"
      />
    );

    expect(screen.getByText(messages.descriptionAllLearners.defaultMessage)).toBeInTheDocument();
    expect(screen.queryByTestId('specify-learner-field')).not.toBeInTheDocument();
    expect(screen.getByTestId('specify-problem-field')).toBeInTheDocument();
  });

  it('handles learner selection correctly', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    const selectLearnerButton = screen.getByText('Select Learner');
    await user.click(selectLearnerButton);

    // The problem field should now be enabled
    const selectProblemButton = screen.getByText('Select Problem');
    expect(selectProblemButton).not.toBeDisabled();
  });

  it('handles problem selection correctly', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    // First select learner
    const selectLearnerButton = screen.getByText('Select Learner');
    await user.click(selectLearnerButton);

    // Then select problem
    const selectProblemButton = screen.getByText('Select Problem');
    await user.click(selectProblemButton);

    // Action buttons should now be enabled
    const resetButton = screen.getAllByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage })[0];
    expect(resetButton).not.toBeDisabled();
  });

  it('calls reset attempts when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Click reset attempts button
    const resetButton = screen.getAllByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage })[0];
    await user.click(resetButton);

    const confirmationModal = screen.getByRole('dialog');
    expect(confirmationModal).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: messages.resetAttempts.defaultMessage });
    await user.click(confirmButton);

    expect(mockMutateReset).toHaveBeenCalledWith({
      learner: 'testuser@example.com',
      problem: 'block-v1:test+problem',
    },
    expect.objectContaining({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    }));
  });

  it('calls rescore submission when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Click rescore submission button
    const rescoreButton = screen.getByText(messages.rescoreSubmissionButtonLabel.defaultMessage);
    await user.click(rescoreButton);

    const confirmationModal = screen.getByRole('dialog');
    expect(confirmationModal).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: messages.rescore.defaultMessage });
    await user.click(confirmButton);

    expect(mockMutateRescore).toHaveBeenCalledWith({
      learner: 'testuser@example.com',
      problem: 'block-v1:test+problem',
      onlyIfHigher: false,
    },
    expect.objectContaining({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    }));
  });

  it('calls rescore submission with onlyIfHigher when "only if improves" button is clicked', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Click rescore if improves button
    const rescoreIfImprovesButton = screen.getByText(messages.rescoreIfImprovesScoreButtonLabel.defaultMessage);
    await user.click(rescoreIfImprovesButton);

    const confirmationModal = screen.getByRole('dialog');
    expect(confirmationModal).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: messages.rescore.defaultMessage });
    await user.click(confirmButton);

    expect(mockMutateRescore).toHaveBeenCalledWith({
      learner: 'testuser@example.com',
      problem: 'block-v1:test+problem',
      onlyIfHigher: true,
    },
    expect.objectContaining({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    }));
  });

  it('handles score input correctly', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Find the score input field
    const scoreInput = screen.getByPlaceholderText(messages.overrideScorePlaceholder.defaultMessage);
    expect(scoreInput).toBeInTheDocument();

    // Type a valid score
    await user.type(scoreInput, '85.5');

    // Click override score button
    const overrideButton = screen.getByText(messages.overrideScoreButtonLabel.defaultMessage);
    await user.click(overrideButton);

    const confirmationModal = screen.getByRole('dialog');
    expect(confirmationModal).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: messages.rescore.defaultMessage });
    await user.click(confirmButton);

    expect(mockMutateChangeScore).toHaveBeenCalledWith({
      learner: 'testuser@example.com',
      problem: 'block-v1:test+problem',
      newScore: 85.5,
    },
    expect.objectContaining({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    }));
  });

  it('validates score input to only allow numeric values', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Find the score input field using placeholder text
    const scoreInput = screen.getByPlaceholderText(messages.overrideScorePlaceholder.defaultMessage) as HTMLInputElement;

    // Try to type invalid characters
    await user.type(scoreInput, 'abc');
    expect(scoreInput.value).toBe('');

    // Try valid numeric input
    await user.type(scoreInput, '123.45');
    expect(scoreInput).toHaveValue(123.45);

    // Try negative number
    await user.clear(scoreInput);
    await user.type(scoreInput, '-10.5');
    expect(scoreInput).toHaveValue(-10.5);
  });

  it('calls delete history when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Click delete history button
    const deleteButton = screen.getByText(messages.deleteHistoryButtonLabel.defaultMessage);
    await user.click(deleteButton);

    const confirmationModal = screen.getByRole('dialog');
    expect(confirmationModal).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: messages.deleteStateButtonLabel.defaultMessage });
    await user.click(confirmButton);

    expect(mockMutateDelete).toHaveBeenCalledWith({
      learner: 'testuser@example.com',
      problem: 'block-v1:test+problem',
    },
    expect.objectContaining({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    }));
  });

  it('calls onShowTasks and refetches when task status button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnShowTasks = jest.fn();

    renderWithAlertAndIntl(
      <GradingLearnerContent
        {...defaultProps}
        onShowTasks={mockOnShowTasks}
      />
    );

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Click task status button
    const taskStatusButton = screen.getByText(messages.taskStatusButtonLabel.defaultMessage);
    await user.click(taskStatusButton);

    expect(mockRefetch).toHaveBeenCalled();
    expect(mockOnShowTasks).toHaveBeenCalled();
  });

  it('disables problem selection when no learner is selected in single mode', () => {
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    const selectProblemButton = screen.getByText('Select Problem');
    expect(selectProblemButton).toBeDisabled();
  });

  it('disables action buttons when learner or problem is not selected', () => {
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    const resetButton = screen.getByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage });
    const rescoreButton = screen.getByRole('button', { name: messages.rescoreSubmissionButtonLabel.defaultMessage });
    const deleteButton = screen.getByRole('button', { name: messages.deleteHistoryButtonLabel.defaultMessage });
    const taskStatusButton = screen.getByRole('button', { name: messages.taskStatusButtonLabel.defaultMessage });

    expect(resetButton).toBeDisabled();
    expect(rescoreButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
    expect(taskStatusButton).toBeDisabled();
  });

  it('disables override score button when no score is entered', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    const overrideButton = screen.getByText(messages.overrideScoreButtonLabel.defaultMessage);
    expect(overrideButton).toBeDisabled();
  });

  it('shows custom error from API in modal when resetAttempts fails', async () => {
    mockUseResetAttempts.mockReturnValue({ mutate: (_data, { onError }) => onError(axiosError('custom error')) } as any);
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));
    await user.click(screen.getAllByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage })[0]);
    const confirmButton = screen.getByRole('button', { name: messages.resetAttempts.defaultMessage });
    await user.click(confirmButton);
    expect(screen.getByText('custom error')).toBeInTheDocument();
  });

  it('calls onSuccess and closes modal when resetAttempts succeeds', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    mockUseResetAttempts.mockReturnValue({ mutate: (_data, { onSuccess: cb }) => {
      cb();
      onSuccess();
    } } as any);
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));
    await user.click(screen.getAllByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage })[0]);
    const confirmButton = screen.getByRole('button', { name: messages.resetAttempts.defaultMessage });
    await user.click(confirmButton);
    expect(onSuccess).toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onSuccess and closes modal when rescoreSubmission succeeds', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    mockUseRescoreSubmission.mockReturnValue({ mutate: (_data, { onSuccess: cb }) => {
      cb();
      onSuccess();
    } } as any);
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));
    await user.click(screen.getByText(messages.rescoreSubmissionButtonLabel.defaultMessage));
    const confirmButton = screen.getByRole('button', { name: messages.rescore.defaultMessage });
    await user.click(confirmButton);
    expect(onSuccess).toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onSuccess and closes modal when deleteHistory succeeds', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    mockUseDeleteHistory.mockReturnValue({ mutate: (_data, { onSuccess: cb }) => {
      cb();
      onSuccess();
    } } as any);
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));
    await user.click(screen.getByText(messages.deleteHistoryButtonLabel.defaultMessage));
    const confirmButton = screen.getByRole('button', { name: messages.deleteStateButtonLabel.defaultMessage });
    await user.click(confirmButton);
    expect(onSuccess).toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onSuccess and closes modal when overrideScore succeeds', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    mockUseChangeScore.mockReturnValue({ mutate: (_data, { onSuccess: cb }) => {
      cb();
      onSuccess();
    } } as any);
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));
    const scoreInput = screen.getByPlaceholderText(messages.overrideScorePlaceholder.defaultMessage);
    await user.type(scoreInput, '99');
    await user.click(screen.getByText(messages.overrideScoreButtonLabel.defaultMessage));
    const confirmButton = screen.getByRole('button', { name: messages.rescore.defaultMessage });
    await user.click(confirmButton);
    expect(onSuccess).toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows generic error in modal when resetAttempts fails with unknown error', async () => {
    mockUseResetAttempts.mockReturnValue({ mutate: (_data, { onError }) => onError({}) } as any);
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));
    await user.click(screen.getAllByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage })[0]);
    const confirmButton = screen.getByRole('button', { name: messages.resetAttempts.defaultMessage });
    await user.click(confirmButton);
    expect(screen.getByText(messages.unexpectedError.defaultMessage)).toBeInTheDocument();
  });

  it('shows custom error from API in modal when rescoreSubmission fails', async () => {
    mockUseRescoreSubmission.mockReturnValue({ mutate: (_data, { onError }) => onError(axiosError('rescore error')) } as any);
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));
    await user.click(screen.getByText(messages.rescoreSubmissionButtonLabel.defaultMessage));
    const confirmButton = screen.getByRole('button', { name: messages.rescore.defaultMessage });
    await user.click(confirmButton);
    expect(screen.getByText('rescore error')).toBeInTheDocument();
  });

  it('shows custom error from API in modal when deleteHistory fails', async () => {
    mockUseDeleteHistory.mockReturnValue({ mutate: (_data, { onError }) => onError(axiosError('delete error')) } as any);
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));
    await user.click(screen.getByText(messages.deleteHistoryButtonLabel.defaultMessage));
    const confirmButton = screen.getByRole('button', { name: messages.deleteStateButtonLabel.defaultMessage });
    await user.click(confirmButton);
    expect(screen.getByText('delete error')).toBeInTheDocument();
  });

  it('shows custom error from API in modal when overrideScore fails', async () => {
    mockUseChangeScore.mockReturnValue({ mutate: (_data, { onError }) => onError(axiosError('override error')) } as any);
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));
    const scoreInput = screen.getByPlaceholderText(messages.overrideScorePlaceholder.defaultMessage);
    await user.type(scoreInput, '99');
    await user.click(screen.getByText(messages.overrideScoreButtonLabel.defaultMessage));
    const confirmButton = screen.getByRole('button', { name: messages.rescore.defaultMessage });
    await user.click(confirmButton);
    expect(screen.getByText('override error')).toBeInTheDocument();
  });

  it('closes confirmation modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<GradingLearnerContent {...defaultProps} />);
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));
    await user.click(screen.getAllByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage })[0]);
    const cancelButton = screen.getByRole('button', { name: messages.close.defaultMessage });
    await user.click(cancelButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // Tests for "all learners" mode functionality
  describe('All Learners Mode', () => {
    it('renders all learners specific action cards', () => {
      renderWithAlertAndIntl(
        <GradingLearnerContent
          {...defaultProps}
          toolType="all"
        />
      );

      // Check that all action cards for all learners mode are rendered
      expect(screen.getByText(messages.resetAttempts.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.rescoreSubmission.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.taskStatus.defaultMessage)).toBeInTheDocument();

      // Check specific button labels for all learners mode
      expect(screen.getByText(messages.rescoreAllSubmissionButtonLabel.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.rescoreIfImprovesScoreButtonLabel.defaultMessage)).toBeInTheDocument();
    });

    it('calls reset attempts for all learners when button is clicked', async () => {
      const user = userEvent.setup();
      renderWithAlertAndIntl(
        <GradingLearnerContent
          {...defaultProps}
          toolType="all"
        />
      );

      // Select problem first
      await user.click(screen.getByText('Select Problem'));

      // Click reset attempts button for all learners
      const resetButton = screen.getByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage });
      await user.click(resetButton);

      const confirmationModal = screen.getByRole('dialog');
      expect(confirmationModal).toBeInTheDocument();

      const confirmButton = screen.getByRole('button', { name: messages.resetAttempts.defaultMessage });
      await user.click(confirmButton);

      expect(mockMutateReset).toHaveBeenCalledWith({
        problem: 'block-v1:test+problem',
        learner: '',
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }));
    });

    it('calls rescore all submissions when button is clicked', async () => {
      const user = userEvent.setup();
      renderWithAlertAndIntl(
        <GradingLearnerContent
          {...defaultProps}
          toolType="all"
        />
      );

      // Select problem first
      await user.click(screen.getByText('Select Problem'));

      // Click rescore all submissions button
      const rescoreAllButton = screen.getByRole('button', { name: messages.rescoreAllSubmissionButtonLabel.defaultMessage });
      await user.click(rescoreAllButton);

      const confirmationModal = screen.getByRole('dialog');
      expect(confirmationModal).toBeInTheDocument();

      const confirmButton = screen.getByRole('button', { name: messages.rescore.defaultMessage });
      await user.click(confirmButton);

      expect(mockMutateRescore).toHaveBeenCalledWith({
        problem: 'block-v1:test+problem',
        onlyIfHigher: false,
        learner: '',
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }));
    });

    it('calls rescore submissions with onlyIfHigher when "if improves" button is clicked', async () => {
      const user = userEvent.setup();
      renderWithAlertAndIntl(
        <GradingLearnerContent
          {...defaultProps}
          toolType="all"
        />
      );

      // Select problem first
      await user.click(screen.getByText('Select Problem'));

      // Click rescore if improves button
      const rescoreIfImprovesButton = screen.getByRole('button', { name: messages.rescoreIfImprovesScoreButtonLabel.defaultMessage });
      await user.click(rescoreIfImprovesButton);

      const confirmationModal = screen.getByRole('dialog');
      expect(confirmationModal).toBeInTheDocument();

      const confirmButton = screen.getByRole('button', { name: messages.rescore.defaultMessage });
      await user.click(confirmButton);

      expect(mockMutateRescore).toHaveBeenCalledWith({
        problem: 'block-v1:test+problem',
        onlyIfHigher: true,
        learner: '',
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }));
    });

    it('calls onShowTasks and refetches when task status button is clicked in all learners mode', async () => {
      const user = userEvent.setup();
      const mockOnShowTasks = jest.fn();

      renderWithAlertAndIntl(
        <GradingLearnerContent
          {...defaultProps}
          toolType="all"
          onShowTasks={mockOnShowTasks}
        />
      );

      // Select problem first
      await user.click(screen.getByText('Select Problem'));

      // Click task status button
      const taskStatusButton = screen.getByText(messages.taskStatusButtonLabel.defaultMessage);
      await user.click(taskStatusButton);

      expect(mockRefetch).toHaveBeenCalled();
      expect(mockOnShowTasks).toHaveBeenCalled();
    });

    it('disables action buttons when problem is not selected in all learners mode', () => {
      renderWithAlertAndIntl(
        <GradingLearnerContent
          {...defaultProps}
          toolType="all"
        />
      );

      const resetButton = screen.getByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage });
      const rescoreAllButton = screen.getByRole('button', { name: messages.rescoreAllSubmissionButtonLabel.defaultMessage });
      const rescoreIfImprovesButton = screen.getByRole('button', { name: messages.rescoreIfImprovesScoreButtonLabel.defaultMessage });

      expect(resetButton).toBeDisabled();
      expect(rescoreAllButton).toBeDisabled();
      expect(rescoreIfImprovesButton).toBeDisabled();
    });

    it('enables action buttons when problem is selected in all learners mode', async () => {
      const user = userEvent.setup();
      renderWithAlertAndIntl(
        <GradingLearnerContent
          {...defaultProps}
          toolType="all"
        />
      );

      // Select problem
      await user.click(screen.getByText('Select Problem'));

      const resetButton = screen.getByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage });
      const rescoreAllButton = screen.getByRole('button', { name: messages.rescoreAllSubmissionButtonLabel.defaultMessage });
      const rescoreIfImprovesButton = screen.getByRole('button', { name: messages.rescoreIfImprovesScoreButtonLabel.defaultMessage });
      const taskStatusButton = screen.getByRole('button', { name: messages.taskStatusButtonLabel.defaultMessage });

      expect(resetButton).not.toBeDisabled();
      expect(rescoreAllButton).not.toBeDisabled();
      expect(rescoreIfImprovesButton).not.toBeDisabled();
      expect(taskStatusButton).not.toBeDisabled();
    });

    it('task status button is always enabled in all learners mode (does not depend on problem selection)', () => {
      renderWithAlertAndIntl(
        <GradingLearnerContent
          {...defaultProps}
          toolType="all"
        />
      );

      // Task status button should be enabled even without selecting a problem
      const taskStatusButton = screen.getByRole('button', { name: messages.taskStatusButtonLabel.defaultMessage });
      expect(taskStatusButton).not.toBeDisabled();
    });
  });
});
