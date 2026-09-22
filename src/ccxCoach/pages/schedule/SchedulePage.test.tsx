import { screen, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import userEvent from '@testing-library/user-event';
import { useCcxSchedule, useSaveCcxSchedule } from '@src/ccxCoach/data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';
import { renderWithAlertAndIntl } from '@src/testUtils';
import SchedulePage from '@src/ccxCoach/pages/schedule/SchedulePage';
import messages from './messages';

jest.mock('@src/ccxCoach/data/apiHook', () => ({
  useCcxSchedule: jest.fn(),
  useSaveCcxSchedule: jest.fn(),
}));

jest.mock('@src/providers/AlertProvider', () => ({
  ...jest.requireActual('@src/providers/AlertProvider'),
  useAlert: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

jest.mock('@src/ccxCoach/pages/schedule/components/EmptySchedule', () => function MockEmptySchedule() {
  return <div>EmptySchedule</div>;
});

jest.mock('@src/ccxCoach/pages/schedule/components/Schedule', () => function MockSchedule({ isEditing, onSave }: { isEditing: boolean; onSave: (data: any[]) => void }) {
  return (
    <div>
      {isEditing ? 'ScheduleEditing' : 'Schedule'}
      <button type="button" onClick={() => onSave([{ location: 'block-1', hidden: false }])}>Trigger Save</button>
    </div>
  );
});

const mockUseCcxSchedule = useCcxSchedule as jest.MockedFunction<typeof useCcxSchedule>;

describe('SchedulePage', () => {
  const mockMutate = jest.fn();
  const mockShowToast = jest.fn();
  const mockShowModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSaveCcxSchedule as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
    (useAlert as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
      showModal: mockShowModal,
    });
  });

  it('renders loading skeleton while schedule data is loading', () => {
    mockUseCcxSchedule.mockReturnValue({ isLoading: true, data: [] } as any);

    const { container } = renderWithAlertAndIntl(<SchedulePage />);

    const skeletons = container.querySelectorAll('.react-loading-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders loading skeleton while the save mutation is in flight', () => {
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [{ id: 'block-1' }] } as any);
    (useSaveCcxSchedule as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    const { container } = renderWithAlertAndIntl(<SchedulePage />);

    const skeletons = container.querySelectorAll('.react-loading-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByText('Schedule')).not.toBeInTheDocument();
    expect(screen.queryByText('EmptySchedule')).not.toBeInTheDocument();
  });

  it('renders loading skeleton during the post-save refetch (isFetching) even with cached data', () => {
    mockUseCcxSchedule.mockReturnValue({
      isLoading: false,
      isFetching: true,
      data: [{ id: 'block-1' }],
    } as any);

    const { container } = renderWithAlertAndIntl(<SchedulePage />);

    const skeletons = container.querySelectorAll('.react-loading-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByText('Schedule')).not.toBeInTheDocument();
    expect(screen.queryByText('EmptySchedule')).not.toBeInTheDocument();
  });

  it('renders empty schedule state and does not use flex wrapper', () => {
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [] } as any);

    const { container } = renderWithAlertAndIntl(<SchedulePage />);

    expect(screen.getByText(messages.schedulePageTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText('EmptySchedule')).toBeInTheDocument();
    expect(screen.queryByText('Schedule')).not.toBeInTheDocument();
    expect(container.firstChild).not.toHaveClass('d-flex');
    expect(screen.queryByRole('button', { name: messages.editCcxSchedule.defaultMessage })).not.toBeInTheDocument();
  });

  it('renders edit state and uses flex wrapper when schedule has entries', () => {
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [{ id: 'block-1' }] } as any);

    const { container } = renderWithAlertAndIntl(<SchedulePage />);

    expect(screen.getByRole('button', { name: messages.editCcxSchedule.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.queryByText('EmptySchedule')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('d-flex');
    expect(container.firstChild).toHaveClass('justify-content-between');
  });

  it('shows tooltip when the edit button is disabled', async () => {
    const user = userEvent.setup();
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [{ id: 'block-1' }] } as any);

    renderWithAlertAndIntl(<SchedulePage />);

    await user.click(screen.getByRole('button', { name: messages.editCcxSchedule.defaultMessage }));

    const disabledEditButton = screen.getByRole('button', { name: messages.editCcxSchedule.defaultMessage });
    expect(disabledEditButton).toBeDisabled();
    await user.hover(disabledEditButton.parentElement as HTMLElement);

    await waitFor(() => {
      expect(screen.getByText(messages.editCcxScheduleTooltip.defaultMessage)).toBeInTheDocument();
    });
  });

  it('mutates the schedule and exits edit mode when Schedule triggers onSave', async () => {
    const user = userEvent.setup();
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [{ id: 'block-1' }] } as any);

    renderWithAlertAndIntl(<SchedulePage />);

    await user.click(screen.getByRole('button', { name: messages.editCcxSchedule.defaultMessage }));
    expect(screen.getByText('ScheduleEditing')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Trigger Save' }));

    expect(mockMutate).toHaveBeenCalledWith(
      [{ location: 'block-1', hidden: false }],
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(screen.getByText('Schedule')).toBeInTheDocument();
  });

  it('shows a success toast when the save mutation resolves', async () => {
    const user = userEvent.setup();
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [{ id: 'block-1' }] } as any);
    mockMutate.mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    renderWithAlertAndIntl(<SchedulePage />);

    await user.click(screen.getByRole('button', { name: messages.editCcxSchedule.defaultMessage }));
    await user.click(screen.getByRole('button', { name: 'Trigger Save' }));

    expect(mockShowToast).toHaveBeenCalledWith(messages.saveSuccess.defaultMessage);
  });

  it('shows the backend message when save fails with an Axios error containing response.data.message', async () => {
    const user = userEvent.setup();
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [{ id: 'block-1' }] } as any);
    const apiError = new AxiosError('Request failed');
    apiError.response = {
      data: { detail: 'Cannot schedule past dates' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    };
    mockMutate.mockImplementation((_data, { onError }) => {
      onError(apiError);
    });

    renderWithAlertAndIntl(<SchedulePage />);

    await user.click(screen.getByRole('button', { name: messages.editCcxSchedule.defaultMessage }));
    await user.click(screen.getByRole('button', { name: 'Trigger Save' }));

    expect(mockShowModal).toHaveBeenCalledWith({
      confirmText: messages.closeButton.defaultMessage,
      message: 'Cannot schedule past dates',
      variant: 'danger',
    });
  });

  it('shows a generic error message when save fails with a non-Axios error', async () => {
    const user = userEvent.setup();
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [{ id: 'block-1' }] } as any);
    mockMutate.mockImplementation((_data, { onError }) => {
      onError(new Error('boom'));
    });

    renderWithAlertAndIntl(<SchedulePage />);

    await user.click(screen.getByRole('button', { name: messages.editCcxSchedule.defaultMessage }));
    await user.click(screen.getByRole('button', { name: 'Trigger Save' }));

    expect(mockShowModal).toHaveBeenCalledWith({
      confirmText: messages.closeButton.defaultMessage,
      message: messages.saveError.defaultMessage,
      variant: 'danger',
    });
  });
});
