import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import SpecialExamsPage from './SpecialExamsPage';
import { useProctoringSettings } from './data/apiHook';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:test+test+test' }),
}));

jest.mock('./data/apiHook', () => ({
  useProctoringSettings: jest.fn(),
}));

// Mock child components
jest.mock('./components/Allowances', () => {
  function MockedAllowances() {
    return <div>Allowances Component</div>;
  }
  return MockedAllowances;
});
jest.mock('./components/Attempts', () => {
  function MockedAttemptsList() {
    return <div>Attempts Component</div>;
  }
  return MockedAttemptsList;
});
jest.mock('./components/OnboardingList', () => {
  function MockedOnboardingList() {
    return <div>Onboarding Component</div>;
  }
  return MockedOnboardingList;
});
jest.mock('./components/ReviewDashboard', () => {
  function MockedReviewDashboard() {
    return <div>Review Dashboard Component</div>;
  }
  return MockedReviewDashboard;
});

const mockUseProctoringSettings = useProctoringSettings as jest.Mock;

describe('SpecialExamsPage', () => {
  beforeEach(() => {
    mockUseProctoringSettings.mockReturnValue({
      data: { supportsOnboarding: false, reviewDashboardAvailable: false },
    });
  });

  it('renders the page title', () => {
    renderWithIntl(<SpecialExamsPage />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders the attempts tab and its content by default', () => {
    renderWithIntl(<SpecialExamsPage />);
    expect(screen.getByText('Exam Attempts')).toBeInTheDocument();
    expect(screen.getByText('Attempts Component')).toBeInTheDocument();
    expect(screen.queryByText('Allowances Component')).not.toBeInTheDocument();
  });

  it('switches to allowances tab when clicked', async () => {
    renderWithIntl(<SpecialExamsPage />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Allowances'));
    expect(screen.getByText('Allowances Component')).toBeInTheDocument();
    expect(screen.queryByText('AttemptsList Component')).not.toBeInTheDocument();
  });

  it('switches back to attempts tab when clicked', async () => {
    renderWithIntl(<SpecialExamsPage />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Allowances'));
    await user.click(screen.getByText('Exam Attempts'));
    expect(screen.getByText('Attempts Component')).toBeInTheDocument();
    expect(screen.queryByText('Allowances Component')).not.toBeInTheDocument();
  });

  it('applies correct button variants based on selected tab', async () => {
    renderWithIntl(<SpecialExamsPage />);
    const attemptsButton = screen.getByText('Exam Attempts');
    const allowancesButton = screen.getByText('Allowances');
    expect(attemptsButton).toHaveClass('btn-primary');
    expect(allowancesButton).toHaveClass('btn-outline-primary');
    const user = userEvent.setup();
    await user.click(allowancesButton);
    expect(allowancesButton).toHaveClass('btn-primary');
    expect(attemptsButton).toHaveClass('btn-outline-primary');
  });

  it('hides onboarding and review dashboard tabs when the provider does not support them', () => {
    renderWithIntl(<SpecialExamsPage />);
    expect(screen.queryByText('Onboarding')).not.toBeInTheDocument();
    expect(screen.queryByText('Review Dashboard')).not.toBeInTheDocument();
  });

  it('shows and switches to the onboarding tab when supported', async () => {
    mockUseProctoringSettings.mockReturnValue({
      data: { supportsOnboarding: true, reviewDashboardAvailable: false },
    });
    renderWithIntl(<SpecialExamsPage />);
    const onboardingButton = screen.getByText('Onboarding');
    expect(onboardingButton).toBeInTheDocument();
    expect(screen.queryByText('Review Dashboard')).not.toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(onboardingButton);
    expect(screen.getByText('Onboarding Component')).toBeInTheDocument();
  });

  it('shows and switches to the review dashboard tab when supported', async () => {
    mockUseProctoringSettings.mockReturnValue({
      data: { supportsOnboarding: false, reviewDashboardAvailable: true },
    });
    renderWithIntl(<SpecialExamsPage />);
    const reviewButton = screen.getByText('Review Dashboard');
    expect(reviewButton).toBeInTheDocument();
    expect(screen.queryByText('Onboarding')).not.toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(reviewButton);
    expect(screen.getByText('Review Dashboard Component')).toBeInTheDocument();
  });
});
