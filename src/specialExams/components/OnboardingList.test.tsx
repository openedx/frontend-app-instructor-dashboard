import { screen } from '@testing-library/react';
import OnboardingList from './OnboardingList';
import { renderWithIntl } from '@src/testUtils';
import { useOnboardingStatuses } from '@src/specialExams/data/apiHook';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('../data/apiHook', () => ({
  useOnboardingStatuses: jest.fn(),
}));

const mockUseOnboardingStatuses = useOnboardingStatuses as jest.Mock;

const mockOnboardingData = {
  results: [
    { username: 'user1', enrollmentMode: 'verified', status: 'verified', modified: '2024-01-01T10:00:00Z' },
    { username: 'user2', enrollmentMode: 'audit', status: 'not_started', modified: null },
  ],
  count: 2,
  numPages: 1,
};

describe('OnboardingList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the onboarding statuses with humanized status text', () => {
    mockUseOnboardingStatuses.mockReturnValue({ data: mockOnboardingData, isLoading: false });
    renderWithIntl(<OnboardingList />);

    expect(screen.getByText('Onboarding Status')).toBeInTheDocument();
    expect(screen.getByText('Enrollment Mode')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    // 'not_started' should be rendered with the underscore replaced by a space
    expect(screen.getByText('not started')).toBeInTheDocument();
  });

  it('renders the empty message when there are no statuses', () => {
    mockUseOnboardingStatuses.mockReturnValue({
      data: { results: [], count: 0, numPages: 0 },
      isLoading: false,
    });
    renderWithIntl(<OnboardingList />);

    expect(screen.getByText('No onboarding statuses found')).toBeInTheDocument();
  });

  it('requests onboarding statuses for the current course', () => {
    mockUseOnboardingStatuses.mockReturnValue({ data: mockOnboardingData, isLoading: false });
    renderWithIntl(<OnboardingList />);

    expect(mockUseOnboardingStatuses).toHaveBeenCalledWith(
      'course-v1:edX+Test+2024',
      expect.objectContaining({ page: 0, emailOrUsername: '' }),
    );
  });
});
