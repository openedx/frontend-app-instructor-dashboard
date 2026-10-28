import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import PermissionGate from './PermissionGate';
import { usePermissionContext } from './PermissionContext';

jest.mock('./PermissionContext');

const mockUsePermissionContext = usePermissionContext as jest.MockedFunction<typeof usePermissionContext>;

const renderGate = (ui: React.ReactElement) => render(
  <IntlProvider locale="en" messages={{}}>{ui}</IntlProvider>,
);

describe('PermissionGate', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders children when the permission is granted', () => {
    mockUsePermissionContext.mockReturnValue({
      permissions: { 'courses.enroll_learners': true },
      isLoading: false,
    });

    renderGate(
      <PermissionGate permission="courses.enroll_learners">
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument();
  });

  it('hides children (renders fallback) when denied in hide mode', () => {
    mockUsePermissionContext.mockReturnValue({
      permissions: { 'courses.enroll_learners': false },
      isLoading: false,
    });

    renderGate(
      <PermissionGate permission="courses.enroll_learners" fallback={<span>No access</span>}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
    expect(screen.getByText('No access')).toBeInTheDocument();
  });

  it('renders children disabled in disable mode when denied', () => {
    mockUsePermissionContext.mockReturnValue({
      permissions: { 'courses.enroll_learners': false },
      isLoading: false,
    });

    renderGate(
      <PermissionGate permission="courses.enroll_learners" mode="disable">
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeDisabled();
  });

  it('opens when any of the anyOf permissions is granted', () => {
    mockUsePermissionContext.mockReturnValue({
      permissions: { 'courses.view_enrollments': false, 'courses.enroll_learners': true },
      isLoading: false,
    });

    renderGate(
      <PermissionGate anyOf={['courses.view_enrollments', 'courses.enroll_learners']}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument();
  });

  it('renders loading node while permissions load', () => {
    mockUsePermissionContext.mockReturnValue({ permissions: undefined, isLoading: true });

    renderGate(
      <PermissionGate permission="courses.enroll_learners" loading={<span>Loading…</span>}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
  });

  it('is permissive when the authzPermissions field is absent', () => {
    mockUsePermissionContext.mockReturnValue({ permissions: undefined, isLoading: false });

    renderGate(
      <PermissionGate permission="courses.enroll_learners">
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument();
  });

  it('renders a non-element child unchanged in disable mode when denied', () => {
    mockUsePermissionContext.mockReturnValue({
      permissions: { 'courses.enroll_learners': false },
      isLoading: false,
    });

    renderGate(
      <PermissionGate permission="courses.enroll_learners" mode="disable">
        plain text child
      </PermissionGate>,
    );

    expect(screen.getByText('plain text child')).toBeInTheDocument();
  });

  it('renders children when neither permission nor anyOf is provided', () => {
    mockUsePermissionContext.mockReturnValue({
      permissions: { 'courses.enroll_learners': false },
      isLoading: false,
    });

    renderGate(
      <PermissionGate>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument();
  });
});
