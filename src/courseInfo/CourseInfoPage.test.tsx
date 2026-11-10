import { ReactElement } from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourseInfoPage from './CourseInfoPage';
import { QueryClientWrapper, renderWithIntl } from '@src/testUtils';
import { COURSE_PERMISSIONS } from '@src/permissions';
import { mockCoursePermissions } from '@src/permissions/testUtils';
import { AccessErrorGuard, AccessErrorProvider } from '@src/providers/AccessErrorProvider';
import AccessErrorObserver from '@src/providers/AccessErrorObserver';
import { DashboardConfig, DashboardConfigProvider } from '@src/dashboardConfig/DashboardConfigContext';

jest.mock('./components/generalCourseInfo', () => ({
  GeneralCourseInfo: () => <div>General Course Info Component</div>,
}));

jest.mock('./components/EnrollmentSummary', () => ({
  EnrollmentSummary: () => <div>Enrollment Summary Component</div>,
}));

jest.mock('@src/permissions/useCoursePermissions');

describe('CourseInfoPage', () => {
  // The real PendingTasks needs a router (`useParams`) and a QueryClient.
  const renderComponent = (ui: ReactElement = <CourseInfoPage />) => renderWithIntl(
    <QueryClientWrapper>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientWrapper>
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('when the user holds courses.view_course_info', () => {
    beforeEach(() => {
      mockCoursePermissions({ [COURSE_PERMISSIONS.VIEW_COURSE_INFO]: true });
    });

    it('renders GeneralCourseInfo component', () => {
      renderComponent();
      expect(screen.getByText('General Course Info Component')).toBeInTheDocument();
    });

    it('renders the enrollment summary', () => {
      renderComponent();
      expect(screen.getByText('Enrollment Summary Component')).toBeInTheDocument();
    });

    it('renders pending tasks section', () => {
      renderComponent();
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    });
  });

  describe('when the user lacks courses.view_course_info', () => {
    beforeEach(() => {
      mockCoursePermissions({ [COURSE_PERMISSIONS.VIEW_COURSE_INFO]: false });
    });

    it('shows the forbidden alert', () => {
      renderComponent();
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('does not render the course info, the enrollment counts or the pending tasks', () => {
      renderComponent();
      expect(screen.queryByText('General Course Info Component')).not.toBeInTheDocument();
      expect(screen.queryByText('Enrollment Summary Component')).not.toBeInTheDocument();
      expect(screen.queryByText('Pending Tasks')).not.toBeInTheDocument();
    });
  });

  describe('when the permission check request fails', () => {
    // `useCoursePermissions` fails closed: every permission resolves to false and
    // the error is returned. The page treats that like a denial (ADR-0003), so it
    // shows the forbidden alert rather than the content.
    it('fails closed and shows the forbidden alert', () => {
      mockCoursePermissions({ [COURSE_PERMISSIONS.VIEW_COURSE_INFO]: false }, { error: new Error('validate failed') });
      renderComponent();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.queryByText('General Course Info Component')).not.toBeInTheDocument();
      expect(screen.queryByText('Enrollment Summary Component')).not.toBeInTheDocument();
    });
  });

  describe('when the course info request fails', () => {
    // The dashboard observes the same course info query and replaces the page
    // with the alert that matches the error, so a server error is not reported
    // as a permission denial even though every permission resolves to false.
    const renderInDashboard = (error: unknown) => {
      const config = {
        useTabsInfo: () => ({ isLoading: false, error }),
      } as unknown as DashboardConfig;
      mockCoursePermissions({ [COURSE_PERMISSIONS.VIEW_COURSE_INFO]: false }, { error });

      return renderComponent(
        <DashboardConfigProvider value={config}>
          <AccessErrorProvider>
            <AccessErrorObserver />
            <AccessErrorGuard>
              <CourseInfoPage />
            </AccessErrorGuard>
          </AccessErrorProvider>
        </DashboardConfigProvider>
      );
    };

    it('shows the generic error for a server error, not the forbidden alert', () => {
      renderInDashboard({ response: { status: 500 } });
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
      expect(screen.queryByText('General Course Info Component')).not.toBeInTheDocument();
    });

    it('shows the forbidden alert once for a 403', () => {
      renderInDashboard({ response: { status: 403 } });
      expect(screen.getAllByText('Access Denied')).toHaveLength(1);
    });
  });

  describe('while permissions are loading', () => {
    beforeEach(() => {
      mockCoursePermissions({}, { isLoading: true });
    });

    it('renders a skeleton', () => {
      const { container } = renderComponent();
      expect(container.querySelector('.react-loading-skeleton.lead')).toBeInTheDocument();
    });

    it('renders neither the content nor the forbidden alert', () => {
      renderComponent();
      expect(screen.queryByText('General Course Info Component')).not.toBeInTheDocument();
      expect(screen.queryByText('Enrollment Summary Component')).not.toBeInTheDocument();
      expect(screen.queryByText('Pending Tasks')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
