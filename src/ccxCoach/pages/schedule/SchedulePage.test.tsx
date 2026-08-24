import { screen } from '@testing-library/react';
import { useCcxSchedule } from '@src/ccxCoach/data/apiHook';
import { renderWithIntl } from '@src/testUtils';
import SchedulePage from './SchedulePage';
import messages from './messages';

jest.mock('@src/ccxCoach/data/apiHook', () => ({
  useCcxSchedule: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

jest.mock('@src/ccxCoach/pages/schedule/components/EmptySchedule', () => function MockEmptySchedule() {
  return <div>EmptySchedule</div>;
});

jest.mock('@src/ccxCoach/pages/schedule/components/EditSchedule', () => function MockEditSchedule() {
  return <div>EditSchedule</div>;
});

const mockUseCcxSchedule = useCcxSchedule as jest.MockedFunction<typeof useCcxSchedule>;

describe('SchedulePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.queryByText('EditSchedule')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('mb-3');
    expect(container.firstChild).not.toHaveClass('d-flex');
  });

  it('renders edit state and uses flex wrapper when schedule has entries', () => {
    mockUseCcxSchedule.mockReturnValue({ isLoading: false, data: [{ id: 'block-1' }] } as any);

    const { container } = renderWithIntl(<SchedulePage />);

    expect(screen.getByRole('button', { name: messages.editCcxSchedule.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText('EditSchedule')).toBeInTheDocument();
    expect(screen.queryByText('EmptySchedule')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('d-flex');
    expect(container.firstChild).toHaveClass('justify-content-between');
  });
});
