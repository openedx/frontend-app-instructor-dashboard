import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import PermissionGate from './PermissionGate';
import { useCoursePermissions } from './useCoursePermissions';
import { COURSE_PERMISSIONS } from './constants';
import { CoursePermissions } from './types';

jest.mock('./useCoursePermissions');

const mockUseCoursePermissions = useCoursePermissions as jest.MockedFunction<typeof useCoursePermissions>;

const { ENROLL_LEARNERS, VIEW_ENROLLMENTS } = COURSE_PERMISSIONS;

const mockContext = (permissions: Partial<CoursePermissions>, isLoading = false) => {
  mockUseCoursePermissions.mockReturnValue({ permissions, isLoading, isAuthzEnabled: true });
};

const renderGate = (ui: React.ReactElement) => render(
  <IntlProvider locale="en" messages={{}}>{ui}</IntlProvider>,
);

describe('PermissionGate', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders children when the permission is granted', () => {
    mockContext({ [ENROLL_LEARNERS]: true });

    renderGate(
      <PermissionGate permission={ENROLL_LEARNERS}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument();
  });

  it('hides children (renders fallback) when denied in hide mode', () => {
    mockContext({ [ENROLL_LEARNERS]: false });

    renderGate(
      <PermissionGate permission={ENROLL_LEARNERS} fallback={<span>No access</span>}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
    expect(screen.getByText('No access')).toBeInTheDocument();
  });

  it('renders children disabled in disable mode when denied', () => {
    mockContext({ [ENROLL_LEARNERS]: false });

    renderGate(
      <PermissionGate permission={ENROLL_LEARNERS} mode="disable">
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeDisabled();
  });

  it('opens when any of the anyOf permissions is granted', () => {
    mockContext({ [VIEW_ENROLLMENTS]: false, [ENROLL_LEARNERS]: true });

    renderGate(
      <PermissionGate anyOf={[VIEW_ENROLLMENTS, ENROLL_LEARNERS]}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument();
  });

  it('stays closed when none of the anyOf permissions is granted', () => {
    mockContext({ [VIEW_ENROLLMENTS]: false, [ENROLL_LEARNERS]: false });

    renderGate(
      <PermissionGate anyOf={[VIEW_ENROLLMENTS, ENROLL_LEARNERS]}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
  });

  it('renders loading node while permissions load', () => {
    mockContext({}, true);

    renderGate(
      <PermissionGate permission={ENROLL_LEARNERS} loading={<span>Loading…</span>}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
  });

  it('renders a non-element child unchanged in disable mode when denied', () => {
    mockContext({ [ENROLL_LEARNERS]: false });

    renderGate(
      <PermissionGate permission={ENROLL_LEARNERS} mode="disable">
        plain text child
      </PermissionGate>,
    );

    expect(screen.getByText('plain text child')).toBeInTheDocument();
  });

  it('renders children when neither permission nor anyOf is provided', () => {
    mockContext({ [ENROLL_LEARNERS]: false });

    renderGate(
      <PermissionGate>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument();
  });
});
