import { camelCaseObject, getSiteConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { CourseInfoResponse } from '@src/courseInfo/types';
import { SelectedLearner } from '@src/types';

export const getApiBaseUrl = () => getSiteConfig().lmsBaseUrl;

/**
 * Get course settings.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export const getCourseInfo = async (courseId: string): Promise<CourseInfoResponse> => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}`);
  const courseInfo = camelCaseObject(data) as CourseInfoResponse;
  // `authz_permissions` keys are dotted identifiers (e.g. `courses.enroll_learners`).
  // `camelCaseObject` deep-camelCases every key and would mangle them, so re-attach
  // the raw map read straight off the untransformed response.
  if (data.authz_permissions) {
    courseInfo.authzPermissions = data.authz_permissions;
  }
  return courseInfo;
};

/**
 * Fetch pending instructor tasks for a course.
 * @param {string} courseId
 * @returns {Promise<Array>}
 */
export const fetchPendingTasks = async (courseId: string) => {
  const response = await getAuthenticatedHttpClient().post<{ results: Record<string, any>[] }>(
    `${getApiBaseUrl()}/courses/${courseId}/instructor/api/list_instructor_tasks`
  );
  return response.data?.tasks?.map(camelCaseObject);
};

/**
 * Get learner information for a course.
 * @param {string} courseId
 * @param {string} emailOrUsername
 * @returns {Promise<SelectedLearner>}
 */
export const getLearner = async (courseId: string, emailOrUsername: string): Promise<SelectedLearner> => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/learners/${emailOrUsername}`);
  return camelCaseObject(data);
};

export const getProblemDetails = async (courseId: string, blockId: string, emailOrUsername?: string) => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/problems/${blockId}`, {
      params: { email_or_username: emailOrUsername },
    });
  return camelCaseObject(data);
};
