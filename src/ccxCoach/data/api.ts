import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import { CcxCoachInfoResponse } from '../types';
import { BlockAttributes } from '../pages/schedule/types';

export const getCcxCoachInfo = async (courseId: string): Promise<CcxCoachInfoResponse> => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/ccx_coach/v2/courses/${courseId}/metadata`);
  return camelCaseObject(data);
};

export const createCcxCoachCourse = async (courseId: string, ccxCourseName: string) => {
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/ccx_coach/v2/courses/${courseId}/create_ccx`,
    {
      name: ccxCourseName
    },
  );
  return camelCaseObject(data);
};

export const getCcxSchedule = async (courseId: string) => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/ccx_coach/v2/courses/${courseId}/schedule`);
  return camelCaseObject(data);
};

export const saveCcxSchedule = async (courseId: string, editedSchedule: BlockAttributes[]) => {
  const { data } = await getAuthenticatedHttpClient()
    .put(`${getApiBaseUrl()}/api/ccx_coach/v2/courses/${courseId}/schedule`, editedSchedule);
  return camelCaseObject(data);
};

export const getCcxCoachGradingPolicy = async (courseId: string): Promise<string> => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/ccx_coach/v2/courses/${courseId}/grading_policy`);
  return data;
};

export const saveCcxCoachGradingPolicy = async (courseId: string, gradingPolicy: string) => {
  const { data } = await getAuthenticatedHttpClient().put(
    `${getApiBaseUrl()}/api/ccx_coach/v2/courses/${courseId}/grading_policy`,
    {
      policy: gradingPolicy
    },
  );
  return data;
};

/**
 * URL of the legacy LMS endpoint that streams the CCX student grades CSV.
 *
 * Not an HTTP call — this endpoint requires session auth (not JWT) and
 * responds with `Content-Disposition: attachment`, so consumers should
 * render it as an `<a href={...}>` and let the browser handle the download
 * instead of fetching it with `getAuthenticatedHttpClient`.
 */
export const getCcxGradesCsvUrl = (courseId: string): string => {
  const encodedCourseId = encodeURIComponent(courseId);
  return `${getApiBaseUrl()}/courses/${encodedCourseId}/ccx_grades.csv`;
};
