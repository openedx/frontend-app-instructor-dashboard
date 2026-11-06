import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navigate, useParams } from 'react-router-dom';
import { authenticatedLoader } from '@openedx/frontend-base';
import routes from './routes';
import { DashboardConfigProvider } from './dashboardConfig/DashboardConfigContext';
import { useWidgetProps } from './slots/SlotUtils';
import { instructorDashboardRole } from './constants';
import { renderWithIntl } from './testUtils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  Navigate: jest.fn(() => null),
}));

jest.mock('./slots/SlotUtils', () => ({
  useWidgetProps: jest.fn(),
}));

jest.mock('@src/instructorNav/InstructorNav', () => ({
  __esModule: true,
  default: () => <div data-testid="instructor-nav" />,
}));

jest.mock('./dashboardConfig/configs', () => ({
  instructorDashboardConfig: {
    variantId: 'instructorDashboard',
    defaultTabs: [],
    routesSlotId: 'r.instructor',
    navTabsSlotId: 'n.instructor',
    useTabsInfo: () => ({ isLoading: false, data: { tabs: [] } }),
    titleMessage: { id: 't', defaultMessage: 't' },
    headerMessage: { id: 'h', defaultMessage: 'h' },
    defaultLandingTabId: 'instructor_landing',
  },
  ccxCoachConfig: {
    variantId: 'ccxCoach',
    defaultTabs: [],
    routesSlotId: 'r.ccx',
    navTabsSlotId: 'n.ccx',
    useTabsInfo: () => ({ isLoading: false, data: { tabs: [] } }),
    titleMessage: { id: 't2', defaultMessage: 't2' },
    headerMessage: { id: 'h2', defaultMessage: 'h2' },
    defaultLandingTabId: 'ccx_landing',
  },
}));

const testConfig = {
  variantId: 'test',
  defaultTabs: [
    { tabId: 'tab_a', content: <div>Content A</div> },
    { tabId: 'tab_b', content: <div>Content B</div> },
  ],
  routesSlotId: 'test.routes',
  navTabsSlotId: 'test.nav',
  useTabsInfo: () => ({ isLoading: false, data: { tabs: [] } }),
  titleMessage: { id: 't', defaultMessage: 't' },
  headerMessage: { id: 'h', defaultMessage: 'h' },
  defaultLandingTabId: 'tab_a',
} as any;

const renderWithConfig = (element: React.ReactNode, config = testConfig) => (
  render(<DashboardConfigProvider value={config}>{element}</DashboardConfigProvider>)
);

describe('routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shape', () => {
    it('exports two routes', () => {
      expect(routes).toHaveLength(2);
    });

    it.each([
      [0, 'org.openedx.frontend.route.instructorDashboard.main', 'instructor-dashboard/:courseId'],
      [1, 'org.openedx.frontend.route.ccxCoach.main', 'ccx-coach/:courseId'],
    ])('route %i has the expected id and path', (index, id, path) => {
      expect(routes[index].id).toBe(id);
      expect(routes[index].path).toBe(path);
    });

    it.each([[0], [1]])('route %i uses authenticatedLoader and the instructor role', (index) => {
      expect(routes[index].loader).toBe(authenticatedLoader);
      expect(routes[index].handle).toEqual({ roles: [instructorDashboardRole] });
    });

    it('the instructor-dashboard route has an index redirect and a :tabId child', () => {
      const children = routes[0].children!;
      expect(children).toHaveLength(2);
      expect(children[0]).toMatchObject({ index: true });
      expect(children[1]).toMatchObject({ path: ':tabId' });
    });

    it('the ccx-coach route wraps its tab children in a layout element (CcxCourseIdGuard)', () => {
      const children = routes[1].children!;
      expect(children).toHaveLength(1);
      const layout = children[0] as { element: React.ReactElement; children: any[] };
      expect(layout.element).toBeDefined();
      expect(layout.children).toHaveLength(2);
      expect(layout.children[0]).toMatchObject({ index: true });
      expect(layout.children[1]).toMatchObject({ path: ':tabId' });
    });
  });

  describe('lazy()', () => {
    beforeEach(() => {
      (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+DemoX+Demo_Course' });
    });

    it.each([
      [0, 'instructorDashboard', 'h'],
      [1, 'ccxCoach', 'h2'],
    ])('route %i lazily loads Main wrapped with the matching config', async (index, variantId, headerText) => {
      const result = await routes[index].lazy!();
      const { Component } = result as { Component: React.ComponentType & { displayName?: string } };

      expect(Component.displayName).toBe(`DashboardRoot(${variantId})`);

      renderWithIntl(<Component />);
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: headerText })).toBeInTheDocument();
      expect(screen.getByTestId('instructor-nav')).toBeInTheDocument();
    });
  });

  describe('DefaultTabRedirect (index child)', () => {
    it('navigates to the config defaultLandingTabId', () => {
      const element = routes[0].children![0].element;

      renderWithConfig(element);

      expect(Navigate).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'tab_a', replace: true }),
        expect.anything()
      );
    });
  });

  describe('TabContent (:tabId child)', () => {
    const getElement = () => routes[0].children![1].element;

    it('renders the matching defaultTabs content', () => {
      (useParams as jest.Mock).mockReturnValue({ tabId: 'tab_b' });
      (useWidgetProps as jest.Mock).mockReturnValue([]);

      renderWithConfig(getElement());

      expect(screen.getByText('Content B')).toBeInTheDocument();
      expect(screen.queryByRole('heading', { level: 1, name: 'Page not found' })).not.toBeInTheDocument();
    });

    it('renders route-widget content when tabId matches a widget', () => {
      (useParams as jest.Mock).mockReturnValue({ tabId: 'widget_tab' });
      (useWidgetProps as jest.Mock).mockReturnValue([
        { tabId: 'widget_tab', content: <div>Widget Content</div> },
      ]);

      renderWithConfig(getElement());

      expect(screen.getByText('Widget Content')).toBeInTheDocument();
    });

    it('lets widgets override a defaultTab with the same tabId', () => {
      (useParams as jest.Mock).mockReturnValue({ tabId: 'tab_a' });
      (useWidgetProps as jest.Mock).mockReturnValue([
        { tabId: 'tab_a', content: <div>Overridden A</div> },
      ]);

      renderWithConfig(getElement());

      expect(screen.getByText('Overridden A')).toBeInTheDocument();
      expect(screen.queryByText('Content A')).not.toBeInTheDocument();
    });

    it('renders PageNotFound when no defaultTab or widget matches', () => {
      (useParams as jest.Mock).mockReturnValue({ tabId: 'missing' });
      (useWidgetProps as jest.Mock).mockReturnValue([]);

      renderWithIntl(
        <DashboardConfigProvider value={testConfig}>{getElement()}</DashboardConfigProvider>
      );

      expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    });
  });
});
