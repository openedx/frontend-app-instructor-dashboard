import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCcxSchedule, useSaveCcxSchedule } from '@src/ccxCoach/data/apiHook';
import { renderWithIntl } from '@src/testUtils';
import SchedulePage from '@src/ccxCoach/pages/schedule/SchedulePage';
import messages from './messages';

jest.mock('@src/ccxCoach/data/apiHook', () => ({
  useCcxSchedule: jest.fn(),
  useSaveCcxSchedule: jest.fn(),
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
  beforeEach(() => {
    jest.clearAllMocks();
    (useSaveCcxSchedule as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    } as any);
  });

  it('renders loading skeleton while schedule data is loading', () => {
    mockUseCcxSchedule.mockReturnValue({ isLoading: true, data: [] } as any);

    const { container } = renderWithIntl(<SchedulePage />);

    const skeletons = container.querySelectorAll('.react-loading-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders empty schedule state and does not use flex wrapper', () => {
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [] } as any);

    const { container } = renderWithIntl(<SchedulePage />);

    expect(screen.getByText(messages.schedulePageTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText('EmptySchedule')).toBeInTheDocument();
    expect(screen.queryByText('Schedule')).not.toBeInTheDocument();
    expect(container.firstChild).not.toHaveClass('d-flex');
    expect(screen.queryByRole('button', { name: messages.editCcxSchedule.defaultMessage })).not.toBeInTheDocument();
  });

  it('renders edit state and uses flex wrapper when schedule has entries', () => {
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [{ id: 'block-1' }] } as any);

    const { container } = renderWithIntl(<SchedulePage />);

    expect(screen.getByRole('button', { name: messages.editCcxSchedule.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.queryByText('EmptySchedule')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('d-flex');
    expect(container.firstChild).toHaveClass('justify-content-between');
  });

  it('shows tooltip when the edit button is disabled', async () => {
    const user = userEvent.setup();
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [{ id: 'block-1' }] } as any);

    renderWithIntl(<SchedulePage />);

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

    renderWithIntl(<SchedulePage />);

    await user.click(screen.getByRole('button', { name: messages.editCcxSchedule.defaultMessage }));
    expect(screen.getByText('ScheduleEditing')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Trigger Save' }));

    expect(mockMutate).toHaveBeenCalledWith([{ location: 'block-1', hidden: false }]);
    expect(screen.getByText('Schedule')).toBeInTheDocument();
  });
});
