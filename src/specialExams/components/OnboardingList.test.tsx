import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OnboardingList from '@src/specialExams/components/OnboardingList';
import { renderWithIntl } from '@src/testUtils';
import { useOnboardingStatuses } from '@src/specialExams/data/apiHook';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('@src/specialExams/data/apiHook', () => ({
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
  useOnboardingProfileApi: false,
};

describe('OnboardingList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the onboarding statuses with humanized status text', () => {
    mockUseOnboardingStatuses.mockReturnValue({ data: mockOnboardingData, isLoading: false });
    renderWithIntl(<OnboardingList />);

    expect(screen.getByRole('columnheader', { name: 'Onboarding Status' })).toBeInTheDocument();
    expect(screen.getByText('Enrollment Mode')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getAllByText('Not Started').length).toBeGreaterThan(0);
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
      expect.objectContaining({ page: 0, emailOrUsername: '', statuses: [] }),
    );
  });

  it('filters by multiple onboarding statuses and resets to the first page', async () => {
    const user = userEvent.setup();
    mockUseOnboardingStatuses.mockReturnValue({ data: { ...mockOnboardingData, count: 50, numPages: 2 }, isLoading: false });
    renderWithIntl(<OnboardingList />);

    await user.click(screen.getByLabelText(/next/i));
    expect(mockUseOnboardingStatuses).toHaveBeenLastCalledWith(
      'course-v1:edX+Test+2024',
      { page: 1, emailOrUsername: '', statuses: [] },
    );

    await user.click(screen.getByRole('button', { name: 'Onboarding Status' }));
    await user.click(screen.getByRole('checkbox', { name: 'Rejected' }));
    await user.click(screen.getByRole('checkbox', { name: 'Error' }));

    expect(mockUseOnboardingStatuses).toHaveBeenLastCalledWith(
      'course-v1:edX+Test+2024',
      { page: 0, emailOrUsername: '', statuses: ['rejected', 'error'] },
    );
    expect(screen.getByRole('button', { name: 'Onboarding Status (2)' })).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'Rejected' }));

    expect(mockUseOnboardingStatuses).toHaveBeenLastCalledWith(
      'course-v1:edX+Test+2024',
      { page: 0, emailOrUsername: '', statuses: ['error'] },
    );
  });

  it('disables the status filter until the first response arrives', () => {
    mockUseOnboardingStatuses.mockReturnValue({ data: undefined, isLoading: true });
    renderWithIntl(<OnboardingList />);

    expect(screen.getByRole('button', { name: 'Onboarding Status' })).toBeDisabled();
  });

  it('shows provider profile API statuses when the profile API is in use', async () => {
    const user = userEvent.setup();
    mockUseOnboardingStatuses.mockReturnValue({
      data: { ...mockOnboardingData, useOnboardingProfileApi: true },
      isLoading: false,
    });
    renderWithIntl(<OnboardingList />);

    await user.click(screen.getByRole('button', { name: 'Onboarding Status' }));

    expect(screen.getByRole('checkbox', { name: 'Expired' })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Setup Started' })).not.toBeInTheDocument();
  });
});
