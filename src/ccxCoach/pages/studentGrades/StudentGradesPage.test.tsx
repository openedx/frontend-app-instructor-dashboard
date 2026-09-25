import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import StudentGradesPage from './StudentGradesPage';
import messages from './messages';
import { getCcxGradesCsvUrl } from '../../data/api';

const MOCK_CSV_URL = 'https://lms.example.com/courses/test-course-id/ccx_grades.csv';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

jest.mock('../../data/api', () => ({
  getCcxGradesCsvUrl: jest.fn(() => MOCK_CSV_URL),
}));

// Stub GradebookSlot so the page's onBack wiring is exercised without pulling
// in the actual Slot/widget infrastructure. Expose the courseId via aria-label
// so tests can assert prop forwarding via getByRole.
jest.mock('@src/slots/GradebookSlot/GradebookSlot', () => {
  const MockGradebookSlot = ({ courseId, onBack }: { courseId: string; onBack: () => void }) => (
    <section aria-label={`Gradebook for ${courseId}`}>
      <button type="button" onClick={onBack}>close-gradebook</button>
    </section>
  );
  return MockGradebookSlot;
});

const mockedGetCcxGradesCsvUrl = getCcxGradesCsvUrl as jest.MockedFunction<typeof getCcxGradesCsvUrl>;

describe('StudentGradesPage', () => {
  beforeEach(() => {
    mockedGetCcxGradesCsvUrl.mockClear();
    mockedGetCcxGradesCsvUrl.mockReturnValue(MOCK_CSV_URL);
  });

  it('renders the summary view with title, view gradebook and download link', () => {
    renderWithIntl(<StudentGradesPage />);

    expect(screen.getByText(messages.studentGradesPageTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: messages.downloadStudentGradesTitle.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(messages.downloadStudentGradesDescription.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.viewGradebookButton.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: messages.downloadStudentGradesButton.defaultMessage })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /Gradebook for/ })).not.toBeInTheDocument();
  });

  it('shows the gradebook slot with the current courseId when View Gradebook is clicked', async () => {
    const user = userEvent.setup();
    renderWithIntl(<StudentGradesPage />);

    await user.click(screen.getByRole('button', { name: messages.viewGradebookButton.defaultMessage }));

    expect(screen.getByRole('region', { name: 'Gradebook for test-course-id' })).toBeInTheDocument();
    expect(screen.queryByText(messages.studentGradesPageTitle.defaultMessage)).not.toBeInTheDocument();
  });

  it('returns to the summary view when the slot invokes onBack', async () => {
    const user = userEvent.setup();
    renderWithIntl(<StudentGradesPage />);

    await user.click(screen.getByRole('button', { name: messages.viewGradebookButton.defaultMessage }));
    await user.click(screen.getByRole('button', { name: 'close-gradebook' }));

    expect(screen.queryByRole('region', { name: /Gradebook for/ })).not.toBeInTheDocument();
    expect(screen.getByText(messages.studentGradesPageTitle.defaultMessage)).toBeInTheDocument();
  });

  it('renders the download button as a link pointing to the CCX grades CSV url', () => {
    renderWithIntl(<StudentGradesPage />);

    const downloadLink = screen.getByRole('link', { name: messages.downloadStudentGradesButton.defaultMessage });

    expect(mockedGetCcxGradesCsvUrl).toHaveBeenCalledWith('test-course-id');
    expect(downloadLink).toHaveAttribute('href', MOCK_CSV_URL);
    expect(downloadLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
