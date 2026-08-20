import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';
import { useGradingPolicy, useSaveGradingPolicy } from '@src/ccxCoach/data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';
import GradingPolicyPage from './GradingPolicyPage';
import messages from './messages';

jest.mock('@src/ccxCoach/data/apiHook', () => ({
  useGradingPolicy: jest.fn(),
  useSaveGradingPolicy: jest.fn(),
}));

jest.mock('@src/hooks/useDebouncedFilter', () => ({
  useDebouncedFilter: jest.fn(),
}));

jest.mock('@src/providers/AlertProvider', () => ({
  ...jest.requireActual('@src/providers/AlertProvider'),
  useAlert: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

const mockMutate = jest.fn();
const mockShowToast = jest.fn();
const mockShowModal = jest.fn();
const mockHandleChange = jest.fn();

describe('GradingPolicyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAlert as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
      showModal: mockShowModal,
    });

    (useGradingPolicy as jest.Mock).mockReturnValue({
      data: '{"GRADER":[]}',
    } as any);

    (useSaveGradingPolicy as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    } as any);

    (useDebouncedFilter as jest.Mock).mockImplementation(({ filterValue, setFilter }) => ({
      inputValue: filterValue,
      handleChange: (value: string) => {
        mockHandleChange(value);
        setFilter(value);
      },
      resetFilter: jest.fn(),
    }) as any);
  });

  it('renders warning texts, textarea, and action buttons', () => {
    renderWithIntl(<GradingPolicyPage />);

    expect(screen.getByText(messages.gradingPolicyPageTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.warningTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.warningMessage.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.warningFooter.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.discardButton.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.saveButton.defaultMessage })).toBeInTheDocument();
  });

  it('calls grading policy hooks with the current course id', () => {
    renderWithIntl(<GradingPolicyPage />);

    expect(useGradingPolicy).toHaveBeenCalledWith('test-course-id');
    expect(useSaveGradingPolicy).toHaveBeenCalledWith('test-course-id');
  });

  it('disables action buttons when there are no changes', () => {
    renderWithIntl(<GradingPolicyPage />);

    expect(screen.getByRole('button', { name: messages.discardButton.defaultMessage })).toBeDisabled();
    expect(screen.getByRole('button', { name: messages.saveButton.defaultMessage })).toBeDisabled();
  });

  it('enables action buttons after editing the grading policy', async () => {
    renderWithIntl(<GradingPolicyPage />);
    const user = userEvent.setup();

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.click(input);
    await user.paste('{"GRADER":[{"type":"Homework"}]}');

    expect(mockHandleChange).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: messages.discardButton.defaultMessage })).toBeEnabled();
    expect(screen.getByRole('button', { name: messages.saveButton.defaultMessage })).toBeEnabled();
  });

  it('restores original policy value when Discard Changes is clicked', async () => {
    renderWithIntl(<GradingPolicyPage />);
    const user = userEvent.setup();

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.click(input);
    await user.paste('{"GRADER":[{"type":"Homework"}]}');

    await user.click(screen.getByRole('button', { name: messages.discardButton.defaultMessage }));

    expect(mockHandleChange).toHaveBeenCalledWith('{"GRADER":[]}');
    expect(screen.getByRole('textbox')).toHaveValue('{"GRADER":[]}');
  });

  it('opens the confirmation modal when Save Grading Policy is clicked', async () => {
    renderWithIntl(<GradingPolicyPage />);
    const user = userEvent.setup();

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.click(input);
    await user.paste('{"GRADER":[{"type":"Homework"}]}');

    await user.click(screen.getAllByRole('button', { name: messages.saveButton.defaultMessage })[0]);

    const dialog = await screen.findByRole('dialog');

    expect(within(dialog).getByText(messages.confirmationMessage.defaultMessage)).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: messages.cancelButton.defaultMessage })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: messages.saveButton.defaultMessage })).toBeInTheDocument();
  });

  it('closes the confirmation modal on Cancel and does not call save mutation', async () => {
    renderWithIntl(<GradingPolicyPage />);
    const user = userEvent.setup();

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.click(input);
    await user.paste('{"GRADER":[{"type":"Homework"}]}');

    await user.click(screen.getAllByRole('button', { name: messages.saveButton.defaultMessage })[0]);
    const dialog = await screen.findByRole('dialog');

    await user.click(within(dialog).getByRole('button', { name: messages.cancelButton.defaultMessage }));

    expect(screen.queryByText(messages.confirmationMessage.defaultMessage)).not.toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls save mutation and shows success toast when save succeeds', async () => {
    mockMutate.mockImplementation((_payload, { onSuccess }) => {
      onSuccess();
    });

    renderWithIntl(<GradingPolicyPage />);
    const user = userEvent.setup();

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.click(input);
    await user.paste('{"GRADER":[{"type":"Exam"}]}');

    await user.click(screen.getAllByRole('button', { name: messages.saveButton.defaultMessage })[0]);
    const dialog = await screen.findByRole('dialog');

    await user.click(within(dialog).getByRole('button', { name: messages.saveButton.defaultMessage }));

    expect(mockMutate).toHaveBeenCalledWith('{"GRADER":[{"type":"Exam"}]}', expect.objectContaining({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    }));
    expect(mockShowToast).toHaveBeenCalledWith(messages.saveSuccess.defaultMessage);
    expect(screen.queryByText(messages.confirmationMessage.defaultMessage)).not.toBeInTheDocument();
  });

  it('shows error modal when save fails', async () => {
    mockMutate.mockImplementation((_payload, { onError }) => {
      onError();
    });

    renderWithIntl(<GradingPolicyPage />);
    const user = userEvent.setup();

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.click(input);
    await user.paste('{"GRADER":[{"type":"Exam"}]}');

    await user.click(screen.getAllByRole('button', { name: messages.saveButton.defaultMessage })[0]);
    const dialog = await screen.findByRole('dialog');

    await user.click(within(dialog).getByRole('button', { name: messages.saveButton.defaultMessage }));

    expect(mockShowModal).toHaveBeenCalledWith({
      confirmText: messages.closeButton.defaultMessage,
      message: messages.saveError.defaultMessage,
      variant: 'danger',
    });
  });
});
