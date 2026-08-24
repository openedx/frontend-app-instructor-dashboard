import { camelCaseObject, getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import {
  createCcxCoachCourse,
  getCcxCoachGradingPolicy,
  getCcxCoachInfo,
  getCcxSchedule,
  saveCcxCoachGradingPolicy,
} from './api';

jest.mock('@openedx/frontend-base');

const mockBaseUrl = 'https://lms.example.com';

const mockHttpClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
};

const mockGetSiteConfig = getSiteConfig as jest.MockedFunction<typeof getSiteConfig>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockCamelCaseObject = camelCaseObject as jest.MockedFunction<typeof camelCaseObject>;

describe('getCcxCoachInfo', () => {
  const mockData = {
    course_id: 'course-v1:edX+DemoX+Demo_Course',
    ccx_course_id: 'ccx-v1:edX+DemoX+Demo_Course+ccx@1',
    tabs: [],
  };
  const mockCamelCasedData = {
    courseId: 'course-v1:edX+DemoX+Demo_Course',
    ccxCourseId: 'ccx-v1:edX+DemoX+Demo_Course+ccx@1',
    tabs: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCasedData);
    mockHttpClient.get.mockResolvedValue({ data: mockData });
  });

  it('should fetch ccx coach info and return camelCased data', async () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';

    const result = await getCcxCoachInfo(courseId);

    expect(getSiteConfig).toHaveBeenCalled();
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/ccx_coach/v2/courses/${courseId}/metadata`
    );
    expect(mockCamelCaseObject).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockCamelCasedData);
  });

  it('should propagate errors from the HTTP client', async () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    const mockError = new Error('Network error');
    mockHttpClient.get.mockRejectedValueOnce(mockError);

    await expect(getCcxCoachInfo(courseId)).rejects.toThrow('Network error');
  });
});

describe('createCcxCoachCourse', () => {
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  const ccxCourseName = 'My New CCX Course';
  const mockData = {
    ccx_course_id: 'ccx-v1:edX+DemoX+Demo_Course+ccx@1',
  };
  const mockCamelCasedData = {
    ccxCourseId: 'ccx-v1:edX+DemoX+Demo_Course+ccx@1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCasedData);
    mockHttpClient.post.mockResolvedValue({ data: mockData });
  });

  it('should POST to the create_ccx endpoint with the ccx name and return camelCased data', async () => {
    const result = await createCcxCoachCourse(courseId, ccxCourseName);

    expect(getSiteConfig).toHaveBeenCalled();
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/ccx_coach/v2/courses/${courseId}/create_ccx`,
      { name: ccxCourseName },
    );
    expect(mockCamelCaseObject).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockCamelCasedData);
  });

  it('should propagate errors from the HTTP client', async () => {
    const mockError = new Error('Server error');
    mockHttpClient.post.mockRejectedValueOnce(mockError);

    await expect(createCcxCoachCourse(courseId, ccxCourseName)).rejects.toThrow('Server error');
  });
});

describe('getCcxCoachGradingPolicy', () => {
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  const mockGradingPolicy = '{ "GRADER": [] }';

  beforeEach(() => {
    jest.clearAllMocks();
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockHttpClient.get.mockResolvedValue({ data: mockGradingPolicy });
  });

  it('should fetch grading policy and return raw payload', async () => {
    const result = await getCcxCoachGradingPolicy(courseId);

    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/ccx_coach/v2/courses/${courseId}/grading_policy`
    );
    expect(result).toEqual(mockGradingPolicy);
  });

  it('should propagate errors from the HTTP client', async () => {
    const mockError = new Error('Network error');
    mockHttpClient.get.mockRejectedValueOnce(mockError);

    await expect(getCcxCoachGradingPolicy(courseId)).rejects.toThrow('Network error');
  });
});

describe('getCcxSchedule', () => {
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  const mockData = [{ start_date: '2026-08-26T08:30:00Z', usage_key: 'block-v1:edX+DemoX+type@chapter+block@1' }];
  const mockCamelCasedData = [{ startDate: '2026-08-26T08:30:00Z', usageKey: 'block-v1:edX+DemoX+type@chapter+block@1' }];

  beforeEach(() => {
    jest.clearAllMocks();
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockCamelCaseObject.mockReturnValue(mockCamelCasedData as any);
    mockHttpClient.get.mockResolvedValue({ data: mockData });
  });

  it('should fetch schedule data and return camelCased payload', async () => {
    const result = await getCcxSchedule(courseId);

    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/courses/${courseId}/ccx_schedule`
    );
    expect(mockCamelCaseObject).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockCamelCasedData);
  });

  it('should propagate errors from the HTTP client', async () => {
    const mockError = new Error('Schedule fetch error');
    mockHttpClient.get.mockRejectedValueOnce(mockError);

    await expect(getCcxSchedule(courseId)).rejects.toThrow('Schedule fetch error');
  });
});

describe('saveCcxCoachGradingPolicy', () => {
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  const gradingPolicy = '{ "GRADER": [{ "type": "Homework" }] }';
  const mockResponse = { success: true };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockGetSiteConfig as jest.Mock).mockReturnValue({ lmsBaseUrl: mockBaseUrl });
    mockGetAuthenticatedHttpClient.mockReturnValue(mockHttpClient as any);
    mockHttpClient.put.mockResolvedValue({ data: mockResponse });
  });

  it('should PUT grading policy payload and return API response', async () => {
    const result = await saveCcxCoachGradingPolicy(courseId, gradingPolicy);

    expect(mockHttpClient.put).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/ccx_coach/v2/courses/${courseId}/grading_policy`,
      { policy: gradingPolicy }
    );
    expect(result).toEqual(mockResponse);
  });

  it('should propagate errors from the HTTP client', async () => {
    const mockError = new Error('Server error');
    mockHttpClient.put.mockRejectedValueOnce(mockError);

    await expect(saveCcxCoachGradingPolicy(courseId, gradingPolicy)).rejects.toThrow('Server error');
  });
});
