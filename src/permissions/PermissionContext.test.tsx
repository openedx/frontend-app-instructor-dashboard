import { render, renderHook, screen } from '@testing-library/react';
import { useCourseInfo } from '@src/data/apiHook';
import { PermissionProvider, usePermissionContext } from './PermissionContext';

jest.mock('@src/data/apiHook');
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
}));

const mockUseCourseInfo = useCourseInfo as jest.MockedFunction<typeof useCourseInfo>;

describe('PermissionContext', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ courseId: 'course-v1:edX+Demo+2024' });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('PermissionProvider', () => {
    it('exposes the authzPermissions, isLoading, and error from useCourseInfo', () => {
      const permissions = { 'courses.enroll_learners': true };
      mockUseCourseInfo.mockReturnValue({
        data: { authzPermissions: permissions },
        isLoading: false,
        error: null,
      } as any);

      const Consumer = () => {
        const ctx = usePermissionContext();
        return (
          <span>
            {`allowed:${String(ctx.permissions?.['courses.enroll_learners'])}|loading:${String(ctx.isLoading)}`}
          </span>
        );
      };

      render(
        <PermissionProvider>
          <Consumer />
        </PermissionProvider>,
      );

      expect(screen.getByText('allowed:true|loading:false')).toBeInTheDocument();
    });

    it('exposes undefined permissions and the loading flag while the query loads', () => {
      mockUseCourseInfo.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      const Consumer = () => {
        const ctx = usePermissionContext();
        return <span>{`permissions:${String(ctx.permissions)}|loading:${String(ctx.isLoading)}`}</span>;
      };

      render(
        <PermissionProvider>
          <Consumer />
        </PermissionProvider>,
      );

      expect(screen.getByText('permissions:undefined|loading:true')).toBeInTheDocument();
    });

    it('defaults courseId to an empty string when the route param is absent', () => {
      mockUseParams.mockReturnValue({});
      mockUseCourseInfo.mockReturnValue({ data: undefined, isLoading: false, error: null } as any);

      render(
        <PermissionProvider>
          <span>child</span>
        </PermissionProvider>,
      );

      expect(mockUseCourseInfo).toHaveBeenCalledWith('');
    });
  });

  describe('usePermissionContext', () => {
    it('throws when used outside a PermissionProvider', () => {
      // Silence the expected React error boundary console output.
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => renderHook(() => usePermissionContext())).toThrow(
        'usePermissionContext must be used within a PermissionProvider',
      );

      consoleError.mockRestore();
    });
  });
});
