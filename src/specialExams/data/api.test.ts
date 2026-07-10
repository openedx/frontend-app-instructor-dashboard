import { camelCaseObject, getAuthenticatedHttpClient, snakeCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import { getAttempts, getAllowances, addAllowance, deleteAllowance, getSpecialExams, resetAttempt, resumeAttempt, getProctoringSettings, getOnboardingStatuses, getReviewDashboardUrl } from '@src/specialExams/data/api';
import { AttemptsParams, Attempt, AddAllowanceParams, DeleteAllowanceParams } from '@src/specialExams/types';
import { DataList } from '@src/types';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  camelCaseObject: jest.fn((obj) => obj),
  snakeCaseObject: jest.fn((obj) => obj),
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@src/data/api', () => ({
  getApiBaseUrl: jest.fn(),
}));

const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;
const mockSnakeCaseObject = snakeCaseObject as jest.MockedFunction<typeof snakeCaseObject>;
const mockGetApiBaseUrl = getApiBaseUrl as jest.MockedFunction<typeof getApiBaseUrl>;

describe('specialExams api', () => {
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn()
  };

  beforeEach(() => {
    mockGetApiBaseUrl.mockReturnValue('https://test-lms.com');
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAttempts', () => {
    const mockAttemptsData = {
      count: 2,
      num_pages: 1,
      results: [
        {
          id: 1,
          exam_id: 101,
          user: {
            username: 'student1',
            id: 1,
          },
          exam_name: 'Final Exam',
          allowed_time_limit_mins: 180,
          exam_type: 'proctored',
          start_time: '2023-01-01T10:00:00Z',
          end_time: '2023-01-01T13:00:00Z',
          status: 'completed',
        },
        {
          id: 2,
          exam_id: 102,
          user: {
            username: 'student2',
            id: 2
          },
          exam_name: 'Midterm Exam',
          allowed_time_limit_mins: 120,
          exam_type: 'timed',
          start_time: '2023-01-02T14:00:00Z',
          end_time: '2023-01-02T16:00:00Z',
          status: 'completed',
        },
      ],
    };

    const mockCamelCaseData: DataList<Attempt> = {
      count: 2,
      numPages: 1,
      results: [
        {
          id: 1,
          examId: 101,
          user: {
            username: 'student1',
            id: 1,
          },
          examName: 'Final Exam',
          allowedTimeLimitMins: 180,
          examType: 'proctored',
          startTime: '2023-01-01T10:00:00Z',
          endTime: '2023-01-01T13:00:00Z',
          status: 'completed',
          readyToResume: false
        },
        {
          id: 2,
          examId: 102,
          user: {
            username: 'student2',
            id: 2,
          },
          examName: 'Midterm Exam',
          allowedTimeLimitMins: 120,
          examType: 'timed',
          startTime: '2023-01-02T14:00:00Z',
          endTime: '2023-01-02T16:00:00Z',
          status: 'completed',
          readyToResume: true
        },
      ],
    };

    const params: AttemptsParams = { page: 1, pageSize: 20, emailOrUsername: '', ordering: '' };

    beforeEach(() => {
      mockHttpClient.get.mockResolvedValue({ data: mockAttemptsData });
      mockCamelCaseObject.mockReturnValue(mockCamelCaseData);
    });

    it('fetches attempts successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const result = await getAttempts(courseId, params);

      expect(mockGetApiBaseUrl).toHaveBeenCalled();
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/attempts?page=2&page_size=20'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockAttemptsData);
      expect(result).toBe(mockCamelCaseData);
    });

    it('handles search parameter correctly', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const paramsWithSearch: AttemptsParams = { page: 0, pageSize: 10, emailOrUsername: 'student1', ordering: '' };

      await getAttempts(courseId, paramsWithSearch);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/attempts?page=1&page_size=10&search=student1'
      );
    });

    it('handles different page and pageSize parameters', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const customParams: AttemptsParams = { page: 5, pageSize: 50, emailOrUsername: '', ordering: '' };

      await getAttempts(courseId, customParams);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/attempts?page=6&page_size=50'
      );
    });

    it('handles empty emailOrUsername parameter', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const paramsWithEmptySearch: AttemptsParams = { page: 2, pageSize: 25, emailOrUsername: '', ordering: '' };

      await getAttempts(courseId, paramsWithEmptySearch);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/attempts?page=3&page_size=25'
      );
    });

    it('handles API error', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const error = new Error('Network error');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(getAttempts(courseId, params)).rejects.toThrow('Network error');
      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalled();
    });

    it('handles special characters in courseId and search', async () => {
      const courseId = 'course-v1:edX+Special%20Course+2023';
      const paramsWithSpecialChars: AttemptsParams = { page: 0, pageSize: 20, emailOrUsername: 'user@example.com', ordering: '' };

      await getAttempts(courseId, paramsWithSpecialChars);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Special%20Course+2023/special_exams/attempts?page=1&page_size=20&search=user%40example.com'
      );
    });

    it('handles ordering parameter correctly', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const paramsWithOrdering: AttemptsParams = {
        page: 0,
        pageSize: 20,
        emailOrUsername: '',
        ordering: '-examType'
      };

      await getAttempts(courseId, paramsWithOrdering);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/attempts?page=1&page_size=20&ordering=-exam_type'
      );
    });

    it('handles complex ordering parameter with multiple parts', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const paramsWithComplexOrdering: AttemptsParams = {
        page: 1,
        pageSize: 10,
        emailOrUsername: 'test@example.com',
        ordering: 'proctoringExam.examName'
      };

      await getAttempts(courseId, paramsWithComplexOrdering);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/attempts?page=2&page_size=10&search=test%40example.com&ordering=proctoring_exam.exam_name'
      );
    });
  });

  describe('getAllowances', () => {
    const params: AttemptsParams = { page: 1, pageSize: 25, emailOrUsername: '', ordering: '' };

    it('makes correct API call and returns camelCase data', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const mockResponseData = {
        count: 1,
        num_pages: 1,
        results: [
          {
            id: 1,
            user: {
              username: 'john_doe',
              email: 'john.doe@example.com',
              id: 5,
            },
            proctored_exam: {
              exam_name: 'Midterm Exam',
              exam_type: 'proctored',
              id: 1,
            },
            key: 'additional_time_granted',
            value: '30 minutes',
          },
        ],
      };

      mockHttpClient.get.mockResolvedValue({ data: mockResponseData });
      mockCamelCaseObject.mockReturnValue(mockResponseData);

      const result = await getAllowances(courseId, params);

      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/allowances?page=2&page_size=25'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockResponseData);
      expect(result).toBe(mockResponseData);
    });

    it('handles search parameter correctly', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const paramsWithSearch: AttemptsParams = { page: 0, pageSize: 20, emailOrUsername: 'john@example.com', ordering: '' };
      const mockResponseData = { count: 0, num_pages: 0, results: [] };

      mockHttpClient.get.mockResolvedValue({ data: mockResponseData });
      await getAllowances(courseId, paramsWithSearch);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/allowances?page=1&page_size=20&search=john%40example.com'
      );
    });
  });

  describe('addAllowance', () => {
    it('makes correct API call and returns camelCase data', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const newAllowanceData: AddAllowanceParams = {
        userIds: ['john_doe'],
        examType: 'proctored',
        examIds: [1],
        allowanceType: 'additional_time_granted',
        value: '30',
      };
      const mockResponseData = [{ id: 1, key: 'additional_time_granted' }];
      const mockSnakeCaseData = { user_ids: ['john_doe'], exam_type: 'proctored' };

      mockHttpClient.post.mockResolvedValue({ data: mockResponseData });
      mockSnakeCaseObject.mockReturnValue(mockSnakeCaseData);
      mockCamelCaseObject.mockReturnValue(mockResponseData);

      const result = await addAllowance(courseId, newAllowanceData);

      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockSnakeCaseObject).toHaveBeenCalledWith(newAllowanceData);
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/allowances',
        mockSnakeCaseData
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockResponseData);
      expect(result).toBe(mockResponseData);
    });

    it('handles API error', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const newAllowanceData: AddAllowanceParams = {
        userIds: ['john_doe'],
        examType: 'proctored',
        examIds: [1],
        allowanceType: 'additional_time_granted',
        value: '30',
      };
      const error = new Error('Failed to add allowance');

      mockHttpClient.post.mockRejectedValue(error);

      await expect(addAllowance(courseId, newAllowanceData)).rejects.toThrow('Failed to add allowance');
    });
  });

  describe('deleteAllowance', () => {
    it('makes correct API call', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const deleteParams: DeleteAllowanceParams = {
        examId: 1,
        userIds: [5],
        allowanceType: 'additional_time_granted',
      };
      const mockSnakeCaseData = { exam_id: 1, user_ids: [5], allowance_type: 'additional_time_granted' };

      mockHttpClient.delete.mockResolvedValue({});
      mockSnakeCaseObject.mockReturnValue(mockSnakeCaseData);

      await deleteAllowance(courseId, deleteParams);

      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockSnakeCaseObject).toHaveBeenCalledWith(deleteParams);
      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/1/allowance',
        { data: mockSnakeCaseData }
      );
    });

    it('handles API error', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const deleteParams: DeleteAllowanceParams = {
        examId: 1,
        userIds: [5],
        allowanceType: 'additional_time_granted',
      };
      const error = new Error('Failed to delete allowance');

      mockHttpClient.delete.mockRejectedValue(error);

      await expect(deleteAllowance(courseId, deleteParams)).rejects.toThrow('Failed to delete allowance');
    });
  });

  describe('getSpecialExams', () => {
    it('makes correct API call and returns camelCase data', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const examType = 'proctored';
      const mockResponseData = [
        {
          id: 1,
          exam_name: 'Midterm Exam',
          exam_type: 'proctored',
          time_limit_mins: 120,
          content_id: 'content-123',
          course_id: 'course-v1:edX+Test+2023',
          due_date: '2023-12-01T23:59:00Z',
          is_proctored: true,
          is_active: true,
          is_practice_exam: false,
          hide_after_due: false,
        },
      ];

      mockHttpClient.get.mockResolvedValue({ data: mockResponseData });
      mockCamelCaseObject.mockReturnValue(mockResponseData);

      const result = await getSpecialExams(courseId, examType);

      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams',
        { params: { exam_type: examType } }
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockResponseData);
      expect(result).toBe(mockResponseData);
    });

    it('handles API error', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const examType = 'timed';
      const error = new Error('Network error');

      mockHttpClient.get.mockRejectedValue(error);

      await expect(getSpecialExams(courseId, examType)).rejects.toThrow('Network error');
    });
  });

  describe('resetAttempt', () => {
    it('makes correct API call and returns camelCase data', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const examId = 1;
      const username = 'testuser';
      const mockResponseData = { detail: 'Attempt reset successfully' };

      mockHttpClient.post.mockResolvedValue({ data: mockResponseData });
      mockCamelCaseObject.mockReturnValue(mockResponseData);

      const result = await resetAttempt(courseId, { examId, username });

      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/special_exams/${examId}/reset/${username}`
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockResponseData);
      expect(result).toBe(mockResponseData);
    });

    it('handles API error', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const examId = 1;
      const username = 'testuser';
      const error = new Error('Failed to reset attempt');

      mockHttpClient.post.mockRejectedValue(error);

      await expect(resetAttempt(courseId, { examId, username })).rejects.toThrow('Failed to reset attempt');
    });
  });

  describe('resumeAttempt', () => {
    it('makes correct API call and returns camelCase data', async () => {
      const attemptId = 1;
      const userId = 2;
      const mockResponseData = { detail: 'Attempt resumed successfully' };

      mockHttpClient.put.mockResolvedValue({ data: mockResponseData });
      mockCamelCaseObject.mockReturnValue(mockResponseData);

      const result = await resumeAttempt({ attemptId, userId });

      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `https://test-lms.com/api/edx_proctoring/v1/proctored_exam/attempt/${attemptId}`,
        expect.any(FormData)
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockResponseData);
      expect(result).toBe(mockResponseData);
    });

    it('handles API error', async () => {
      const attemptId = 1;
      const userId = 2;
      const error = new Error('Failed to resume attempt');

      mockHttpClient.put.mockRejectedValue(error);

      await expect(resumeAttempt({ attemptId, userId })).rejects.toThrow('Failed to resume attempt');
    });
  });

  describe('getProctoringSettings', () => {
    it('makes correct API call and returns camelCase data', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const mockResponseData = {
        proctoring_provider: 'proctortrack',
        proctoring_escalation_email: 'proctor@example.com',
        create_zendesk_tickets: true,
        enable_proctored_exams: true,
        supports_onboarding: true,
        review_dashboard_available: true,
      };

      mockHttpClient.get.mockResolvedValue({ data: mockResponseData });
      mockCamelCaseObject.mockReturnValue(mockResponseData);

      const result = await getProctoringSettings(courseId);

      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/instructor/v2/courses/course-v1:edX+Test+2023/proctoring_settings'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockResponseData);
      expect(result).toBe(mockResponseData);
    });

    it('handles API error', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      await expect(getProctoringSettings(courseId)).rejects.toThrow('Network error');
    });
  });

  describe('getOnboardingStatuses', () => {
    const params = { page: 0, emailOrUsername: '' };

    it('makes correct API call and returns camelCase data', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const mockResponseData = {
        count: 1,
        num_pages: 1,
        results: [
          { username: 'student1', enrollment_mode: 'verified', status: 'verified', modified: '2023-01-01T10:00:00Z' },
        ],
      };

      mockHttpClient.get.mockResolvedValue({ data: mockResponseData });
      mockCamelCaseObject.mockReturnValue(mockResponseData);

      const result = await getOnboardingStatuses(courseId, params);

      expect(mockGetAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/edx_proctoring/v1/user_onboarding/status/course_id/course-v1:edX+Test+2023?page=1'
      );
      expect(mockCamelCaseObject).toHaveBeenCalledWith(mockResponseData);
      expect(result).toBe(mockResponseData);
    });

    it('passes the search term as text_search and increments the page', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const paramsWithSearch = { page: 2, emailOrUsername: 'student@example.com' };
      mockHttpClient.get.mockResolvedValue({ data: { count: 0, num_pages: 0, results: [] } });

      await getOnboardingStatuses(courseId, paramsWithSearch);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://test-lms.com/api/edx_proctoring/v1/user_onboarding/status/course_id/course-v1:edX+Test+2023?page=3&text_search=student%40example.com'
      );
    });

    it('handles API error', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      await expect(getOnboardingStatuses(courseId, params)).rejects.toThrow('Network error');
    });
  });

  describe('getReviewDashboardUrl', () => {
    it('builds the edx_proctoring instructor dashboard URL for the course', () => {
      const courseId = 'course-v1:edX+Test+2023';
      expect(getReviewDashboardUrl(courseId)).toBe(
        'https://test-lms.com/api/edx_proctoring/v1/instructor/course-v1:edX+Test+2023'
      );
    });
  });
});
