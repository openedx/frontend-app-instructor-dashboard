import { getCourseInfo, getLearner, getProblemDetails } from './api';
import { camelCaseObject, getSiteConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { fetchPendingTasks } from './api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  camelCaseObject: jest.fn((obj) => obj),
  getSiteConfig: jest.fn(),
  getAuthenticatedHttpClient: jest.fn(),
}));

const mockGetSiteConfig = getSiteConfig as jest.MockedFunction<typeof getSiteConfig>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;

const mockHttpClient = {
  get: jest.fn(),
  post: jest.fn(),
};

describe('base api', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getCourseInfo', () => {
    const mockCourseData = { course_name: 'Test Course' };
    const mockCamelCaseData = { courseName: 'Test Course' };

    beforeEach(() => {
      (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: 'https://test-lms.com' });
      mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
      mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
      mockHttpClient.get.mockResolvedValue({ data: mockCourseData });
    });

    it('fetches course info successfully', async () => {
      const courseId = 'test-course-123';
      const result = await getCourseInfo(courseId);
      expect(mockGetSiteConfig).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith('https://test-lms.com/api/instructor/v2/courses/test-course-123');
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockCourseData);
      expect(result).toBe(mockCamelCaseData);
    });

    it('throws error when API call fails', async () => {
      const error = new Error('Network error');
      mockHttpClient.get.mockRejectedValue(error);
      await expect(getCourseInfo('test-course')).rejects.toThrow('Network error');
    });
  });

  describe('fetchPendingTasks', () => {
    beforeEach(() => {
      mockCamelCaseObject.mockImplementation((obj) => obj);
      (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: 'https://example.com' });
      mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    });

    it('should fetch pending tasks successfully', async () => {
      const mockCourseId = 'course-v1:Example+Course+2025';
      const mockTasks = [
        {
          task_type: 'grade_course',
          task_id: '12345',
          task_state: 'SUCCESS',
          requester: 'instructor@example.com',
        },
      ];

      mockHttpClient.post.mockResolvedValue({
        data: { tasks: mockTasks },
      });

      const result = await fetchPendingTasks(mockCourseId);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://example.com/courses/course-v1:Example+Course+2025/instructor/api/list_instructor_tasks'
      );
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getLearner', () => {
    const mockLearnerData = { username: 'testuser', email: 'test@example.com', full_name: 'Test User' };
    const mockCamelCaseData = { username: 'testuser', email: 'test@example.com', fullName: 'Test User' };

    beforeEach(() => {
      (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: 'https://test-lms.com' });
      mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
      mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
      mockHttpClient.get.mockResolvedValue({ data: mockLearnerData });
    });

    it('fetches learner info successfully', async () => {
      const courseId = 'course-v1:Test+Course+2025';
      const emailOrUsername = 'testuser';
      const result = await getLearner(courseId, emailOrUsername);
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith('https://test-lms.com/api/instructor/v2/courses/course-v1:Test+Course+2025/learners/testuser');
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockLearnerData);
      expect(result).toBe(mockCamelCaseData);
    });

    it('throws error when API call fails', async () => {
      const error = new Error('Network error');
      mockHttpClient.get.mockRejectedValue(error);
      await expect(getLearner('course-v1:Test+Course+2025', 'testuser')).rejects.toThrow('Network error');
    });
  });

  describe('getProblemDetails', () => {
    const mockProblemData = {
      breadcrumbs: [
        { display_name: 'Course' },
        { display_name: 'Chapter 1' },
        { display_name: 'Section A' },
        { display_name: 'Problem 1' },
      ],
      name: 'Math Problem',
      id: 'block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378',
    };
    const mockCamelCaseData = {
      breadcrumbs: [
        { displayName: 'Course' },
        { displayName: 'Chapter 1' },
        { displayName: 'Section A' },
        { displayName: 'Problem 1' },
      ],
      name: 'Math Problem',
      id: 'block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378',
    };

    beforeEach(() => {
      (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: 'https://test-lms.com' });
      mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
      mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
      mockHttpClient.get.mockResolvedValue({ data: mockProblemData });
    });

    it('fetches problem details successfully with emailOrUsername parameter', async () => {
      const courseId = 'course-v1:Test+Course+2025';
      const blockId = 'block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378';
      const emailOrUsername = 'testuser';

      const result = await getProblemDetails(courseId, blockId, emailOrUsername);

      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:Test+Course+2025/problems/block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378',
        { params: { email_or_username: emailOrUsername } }
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockProblemData);
      expect(result).toBe(mockCamelCaseData);
    });

    it('fetches problem details successfully without emailOrUsername parameter', async () => {
      const courseId = 'course-v1:Test+Course+2025';
      const blockId = 'block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378';

      const result = await getProblemDetails(courseId, blockId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:Test+Course+2025/problems/block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378',
        { params: { email_or_username: undefined } }
      );
      expect(result).toBe(mockCamelCaseData);
    });

    it('handles empty emailOrUsername parameter', async () => {
      const courseId = 'course-v1:Test+Course+2025';
      const blockId = 'block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378';

      const result = await getProblemDetails(courseId, blockId, '');

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.any(String),
        { params: { email_or_username: '' } }
      );
      expect(result).toBe(mockCamelCaseData);
    });

    it('throws error when API call fails', async () => {
      const error = new Error('Problem not found');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(
        getProblemDetails('course-v1:Test+Course+2025', 'invalid-block-id')
      ).rejects.toThrow('Problem not found');
    });

    it('handles special characters in blockId correctly', async () => {
      const courseId = 'course-v1:Test+Course+2025';
      const blockId = 'block-v1:edX+DemoX+2015+type@problem+block@special%20chars&symbols';

      await getProblemDetails(courseId, blockId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `https://test-lms.com/api/instructor/v2/courses/${courseId}/problems/${blockId}`,
        { params: { email_or_username: undefined } }
      );
    });
  });
});
