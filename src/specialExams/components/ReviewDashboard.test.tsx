import { screen } from '@testing-library/react';
import ReviewDashboard from './ReviewDashboard';
import { renderWithIntl } from '@src/testUtils';
import { getReviewDashboardUrl } from '@src/specialExams/data/api';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('../data/api', () => ({
  getReviewDashboardUrl: jest.fn(),
}));

const mockGetReviewDashboardUrl = getReviewDashboardUrl as jest.MockedFunction<typeof getReviewDashboardUrl>;

describe('ReviewDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetReviewDashboardUrl.mockReturnValue(
      'https://test-lms.com/api/edx_proctoring/v1/instructor/course-v1:edX+Test+2024'
    );
  });

  it('renders an iframe pointing at the review dashboard URL for the course', () => {
    renderWithIntl(<ReviewDashboard />);

    expect(mockGetReviewDashboardUrl).toHaveBeenCalledWith('course-v1:edX+Test+2024');
    const iframe = screen.getByTitle('Proctoring Review Dashboard');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      'https://test-lms.com/api/edx_proctoring/v1/instructor/course-v1:edX+Test+2024'
    );
  });
});
