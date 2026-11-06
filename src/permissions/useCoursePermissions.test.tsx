import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  MemoryRouter, Route, Routes, useNavigate,
} from 'react-router-dom';
import { usePermissions } from '@openedx/frontend-base';
import { useCourseInfo } from '@src/data/apiHook';
import { useCoursePermissions } from './useCoursePermissions';
import { COURSE_PERMISSIONS } from './constants';

jest.mock('@src/data/apiHook');
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  usePermissions: jest.fn(),
}));

const mockUseCourseInfo = useCourseInfo as jest.MockedFunction<typeof useCourseInfo>;
const mockUsePermissions = usePermissions as jest.MockedFunction<typeof usePermissions>;

const COURSE_A = 'course-v1:edX+A+2024';
const COURSE_B = 'course-v1:edX+B+2024';
const { ENROLL_LEARNERS, MANAGE_COURSE_TEAM } = COURSE_PERMISSIONS;
const ALL_IDS = Object.values(COURSE_PERMISSIONS);

const permissionsResult = (overrides: Record<string, unknown> = {}) => ({
  isLoading: false,
  isError: false,
  isPaused: false,
  error: null,
  isAuthzEnabled: true,
  ...overrides,
}) as any;

/** Every key allowed: what `usePermissions` returns when `featureEnabled` is false. */
const allAllowed = (query: Record<string, unknown>) => permissionsResult({
  isAuthzEnabled: false,
  ...Object.fromEntries(Object.keys(query).map(key => [key, true])),
});

const mockCourseInfo = (overrides: Record<string, unknown> = {}) => {
  mockUseCourseInfo.mockReturnValue({
    data: { authzEnabled: true },
    isLoading: false,
    error: null,
    ...overrides,
  } as any);
};

/** Scope sent with the latest `usePermissions` call (every item shares it). */
const lastScope = () => {
  const calls = mockUsePermissions.mock.calls;
  return calls[calls.length - 1][0][ENROLL_LEARNERS].scope;
};

const Consumer = () => {
  const result = useCoursePermissions();
  const navigate = useNavigate();
  return (
    <>
      <span>
        {[
          `enroll:${String(result.permissions[ENROLL_LEARNERS])}`,
          `team:${String(result.permissions[MANAGE_COURSE_TEAM])}`,
          `loading:${String(result.isLoading)}`,
          `authz:${String(result.isAuthzEnabled)}`,
          `error:${result.error ? (result.error as Error).message : 'none'}`,
        ].join('|')}
      </span>
      <button type="button" onClick={() => navigate(`/${COURSE_B}`)}>Go to course B</button>
    </>
  );
};

const renderAt = (path: string, routePath = '/:courseId') => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path={routePath} element={<Consumer />} />
    </Routes>
  </MemoryRouter>,
);

describe('useCoursePermissions', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('requests every dashboard permission for the course in a single query', () => {
    mockCourseInfo();
    mockUsePermissions.mockReturnValue(permissionsResult());

    renderAt(`/${COURSE_A}`);

    const [query, featureEnabled] = mockUsePermissions.mock.calls[0];
    expect(featureEnabled).toBe(true);
    expect(Object.keys(query)).toEqual(ALL_IDS);
    expect(query[ENROLL_LEARNERS]).toEqual({ action: ENROLL_LEARNERS, scope: COURSE_A });
  });

  it('returns the resolved permissions when AuthZ is enabled', () => {
    mockCourseInfo();
    mockUsePermissions.mockReturnValue(permissionsResult({
      [ENROLL_LEARNERS]: true,
      [MANAGE_COURSE_TEAM]: false,
    }));

    renderAt(`/${COURSE_A}`);

    expect(screen.getByText('enroll:true|team:false|loading:false|authz:true|error:none')).toBeInTheDocument();
  });

  it('passes featureEnabled=false when the course info has no authzEnabled', () => {
    mockCourseInfo({ data: {} });
    mockUsePermissions.mockImplementation(allAllowed);

    renderAt(`/${COURSE_A}`);

    expect(mockUsePermissions.mock.calls[0][1]).toBe(false);
    expect(screen.getByText('enroll:true|team:true|loading:false|authz:false|error:none')).toBeInTheDocument();
  });

  it('reports loading with no permissions while the course info loads', () => {
    mockCourseInfo({ data: undefined, isLoading: true });
    // featureEnabled is false until course info arrives, so the hook would allow everything.
    mockUsePermissions.mockImplementation(allAllowed);

    renderAt(`/${COURSE_A}`);

    expect(screen.getByText('enroll:undefined|team:undefined|loading:true|authz:false|error:none')).toBeInTheDocument();
  });

  it('reports loading while the permission check is in flight', () => {
    mockCourseInfo();
    mockUsePermissions.mockReturnValue(permissionsResult({ isLoading: true }));

    renderAt(`/${COURSE_A}`);

    expect(screen.getByText('enroll:undefined|team:undefined|loading:true|authz:true|error:none')).toBeInTheDocument();
  });

  it('denies and returns the error when the permission check fails', () => {
    mockCourseInfo();
    mockUsePermissions.mockReturnValue(permissionsResult({
      isError: true,
      error: new Error('validate failed'),
      [ENROLL_LEARNERS]: false,
      [MANAGE_COURSE_TEAM]: false,
    }));

    renderAt(`/${COURSE_A}`);

    expect(screen.getByText('enroll:false|team:false|loading:false|authz:true|error:validate failed')).toBeInTheDocument();
  });

  it('returns the course info error first when it fails', () => {
    mockCourseInfo({ data: undefined, error: new Error('course info failed') });
    mockUsePermissions.mockReturnValue(permissionsResult({ isAuthzEnabled: false }));

    renderAt(`/${COURSE_A}`);

    expect(screen.getByText(/error:course info failed/)).toBeInTheDocument();
  });

  it('defaults courseId to an empty string when the route has no courseId', () => {
    mockCourseInfo({ data: undefined });
    mockUsePermissions.mockReturnValue(permissionsResult({ isAuthzEnabled: false }));

    renderAt('/somewhere', '*');

    expect(mockUseCourseInfo).toHaveBeenCalledWith('');
    expect(lastScope()).toBe('');
  });

  it('requests the new course permissions and shows loading, not the old values, after switching course', async () => {
    mockCourseInfo();
    // Course A is already resolved; course B's check is still in flight.
    let courseBResolved = false;
    mockUsePermissions.mockImplementation((query) => {
      const { scope } = (query as Record<string, { scope: string }>)[ENROLL_LEARNERS];
      if (scope === COURSE_A) {
        return permissionsResult({ [ENROLL_LEARNERS]: true, [MANAGE_COURSE_TEAM]: true });
      }
      return courseBResolved
        ? permissionsResult({ [ENROLL_LEARNERS]: false, [MANAGE_COURSE_TEAM]: true })
        : permissionsResult({ isLoading: true });
    });

    const { rerender } = renderAt(`/${COURSE_A}`);
    expect(lastScope()).toBe(COURSE_A);
    expect(mockUseCourseInfo).toHaveBeenLastCalledWith(COURSE_A);
    expect(screen.getByText('enroll:true|team:true|loading:false|authz:true|error:none')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Go to course B' }));

    expect(lastScope()).toBe(COURSE_B);
    expect(mockUseCourseInfo).toHaveBeenLastCalledWith(COURSE_B);
    expect(screen.getByText('enroll:undefined|team:undefined|loading:true|authz:true|error:none')).toBeInTheDocument();

    // Course B's check finishes; re-render to pick up the new result (the router
    // keeps its current location, so initialEntries is ignored here).
    courseBResolved = true;
    rerender(
      <MemoryRouter initialEntries={[`/${COURSE_B}`]}>
        <Routes>
          <Route path="/:courseId" element={<Consumer />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('enroll:false|team:true|loading:false|authz:true|error:none')).toBeInTheDocument();
  });
});
