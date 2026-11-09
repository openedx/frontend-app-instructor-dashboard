import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@openedx/paragon';
import PermissionGate from './PermissionGate';
import { useCoursePermissions } from './useCoursePermissions';
import { COURSE_PERMISSIONS } from './constants';
import { CoursePermissions } from './types';
import { renderWithIntl } from '@src/testUtils';

jest.mock('./useCoursePermissions');

const mockUseCoursePermissions = useCoursePermissions as jest.MockedFunction<typeof useCoursePermissions>;

const { ENROLL_LEARNERS, VIEW_ENROLLMENTS } = COURSE_PERMISSIONS;

const mockContext = (permissions: Partial<CoursePermissions>, isLoading = false) => {
  mockUseCoursePermissions.mockReturnValue({ permissions, isLoading, isAuthzEnabled: true });
};

describe('PermissionGate', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders children when the permission is granted', () => {
    mockContext({ [ENROLL_LEARNERS]: true });

    renderWithIntl(
      <PermissionGate permission={ENROLL_LEARNERS}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument();
  });

  it('hides children (renders fallback) when denied in hide mode', () => {
    mockContext({ [ENROLL_LEARNERS]: false });

    renderWithIntl(
      <PermissionGate permission={ENROLL_LEARNERS} fallback={<span>No access</span>}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
    expect(screen.getByText('No access')).toBeInTheDocument();
  });

  it('renders children disabled in disable mode when denied', () => {
    mockContext({ [ENROLL_LEARNERS]: false });

    renderWithIntl(
      <PermissionGate permission={ENROLL_LEARNERS} mode="disable">
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeDisabled();
  });

  it('opens when any of the anyOf permissions is granted', () => {
    mockContext({ [VIEW_ENROLLMENTS]: false, [ENROLL_LEARNERS]: true });

    renderWithIntl(
      <PermissionGate anyOf={[VIEW_ENROLLMENTS, ENROLL_LEARNERS]}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument();
  });

  it('stays closed when none of the anyOf permissions is granted', () => {
    mockContext({ [VIEW_ENROLLMENTS]: false, [ENROLL_LEARNERS]: false });

    renderWithIntl(
      <PermissionGate anyOf={[VIEW_ENROLLMENTS, ENROLL_LEARNERS]}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
  });

  it('stays closed when anyOf is empty', () => {
    mockContext({ [ENROLL_LEARNERS]: true });

    renderWithIntl(
      <PermissionGate anyOf={[]} fallback={<span>No access</span>}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
    expect(screen.getByText('No access')).toBeInTheDocument();
  });

  it('makes the disabled wrapper focusable so keyboard users can reach the tooltip', async () => {
    mockContext({ [ENROLL_LEARNERS]: false });

    renderWithIntl(
      <PermissionGate permission={ENROLL_LEARNERS} mode="disable">
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    const wrapper = screen.getByRole('button', { name: /enroll/i }).parentElement as HTMLElement;
    expect(wrapper).toHaveAttribute('tabindex', '0');

    await userEvent.tab();

    expect(wrapper).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  });

  it('gives each disabled gate its own tooltip id when several gates share a view', async () => {
    mockContext({ [ENROLL_LEARNERS]: false, [VIEW_ENROLLMENTS]: false });

    renderWithIntl(
      <>
        <PermissionGate permission={ENROLL_LEARNERS} mode="disable">
          <Button>Enroll</Button>
        </PermissionGate>
        <PermissionGate permission={VIEW_ENROLLMENTS} mode="disable">
          <Button>View</Button>
        </PermissionGate>
      </>,
    );

    const enrollWrapper = screen.getByRole('button', { name: /enroll/i }).parentElement as HTMLElement;
    const viewWrapper = screen.getByRole('button', { name: /view/i }).parentElement as HTMLElement;

    // Open both tooltips at once, as when one gate keeps its tooltip while another is hovered.
    fireEvent.mouseOver(enrollWrapper);
    fireEvent.mouseOver(viewWrapper);

    const tooltips = await screen.findAllByRole('tooltip');
    expect(tooltips).toHaveLength(2);
    const [firstId, secondId] = tooltips.map(tooltip => tooltip.id);
    expect(firstId).not.toBe(secondId);

    const describedBy = [enrollWrapper, viewWrapper].map(el => el.getAttribute('aria-describedby'));
    expect(new Set(describedBy).size).toBe(2);
    expect(describedBy.sort()).toEqual([firstId, secondId].sort());
  });

  it('renders loading node while permissions load', () => {
    mockContext({}, true);

    renderWithIntl(
      <PermissionGate permission={ENROLL_LEARNERS} loading={<span>Loading…</span>}>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
  });

  it('renders a non-element child unchanged in disable mode when denied', () => {
    mockContext({ [ENROLL_LEARNERS]: false });

    renderWithIntl(
      <PermissionGate permission={ENROLL_LEARNERS} mode="disable">
        plain text child
      </PermissionGate>,
    );

    expect(screen.getByText('plain text child')).toBeInTheDocument();
  });

  it('renders children when neither permission nor anyOf is provided', () => {
    mockContext({ [ENROLL_LEARNERS]: false });

    renderWithIntl(
      <PermissionGate>
        <Button>Enroll</Button>
      </PermissionGate>,
    );

    expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument();
  });
});
