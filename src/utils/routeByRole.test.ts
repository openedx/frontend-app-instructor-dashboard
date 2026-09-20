import { getUrlByRouteRole } from '@openedx/frontend-base';
import { resolveRouteByRole } from '@src/utils/routeByRole';

jest.mock('@openedx/frontend-base', () => ({
  getUrlByRouteRole: jest.fn(),
}));

describe('resolveRouteByRole', () => {
  it('returns null when the site provides no route for the role', () => {
    (getUrlByRouteRole as jest.Mock).mockReturnValue(null);
    expect(resolveRouteByRole('some.role')).toBeNull();
  });

  it('substitutes params and reports an internal path', () => {
    (getUrlByRouteRole as jest.Mock).mockReturnValue('/gradebook/:courseId');
    expect(resolveRouteByRole('some.role', { courseId: 'course-v1:edX+DemoX+Demo_Course' })).toEqual({
      url: '/gradebook/course-v1:edX+DemoX+Demo_Course',
      isInternal: true,
    });
  });

  it('strips a trailing splat', () => {
    (getUrlByRouteRole as jest.Mock).mockReturnValue('/admin-console/authz/*');
    expect(resolveRouteByRole('some.role')).toEqual({
      url: '/admin-console/authz',
      isInternal: true,
    });
  });

  it('reports an absolute URL as external', () => {
    (getUrlByRouteRole as jest.Mock).mockReturnValue('https://other.example.com/gradebook');
    expect(resolveRouteByRole('some.role')).toEqual({
      url: 'https://other.example.com/gradebook',
      isInternal: false,
    });
  });
});
