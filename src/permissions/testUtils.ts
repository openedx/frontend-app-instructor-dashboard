import { CoursePermissions } from './types';
import { useCoursePermissions } from './useCoursePermissions';

/**
 * Shared test helper for components that read permissions through
 * `useCoursePermissions`. It keeps the mocked result shape in one place, so a
 * change to `CoursePermissionsResult` is fixed here rather than in every test.
 *
 * The calling test file must still declare `jest.mock(...)` for the
 * `useCoursePermissions` module, because `jest.mock` is hoisted per file and
 * cannot be done from a helper.
 */
const mockedUseCoursePermissions = useCoursePermissions as jest.MockedFunction<typeof useCoursePermissions>;

interface MockCoursePermissionsOptions {
  isLoading?: boolean;
  error?: unknown;
  isAuthzEnabled?: boolean;
}

export const mockCoursePermissions = (
  permissions: Partial<CoursePermissions>,
  { isLoading = false, error, isAuthzEnabled = true }: MockCoursePermissionsOptions = {},
) => {
  mockedUseCoursePermissions.mockReturnValue({
    permissions, isLoading, isAuthzEnabled, error,
  });
};
