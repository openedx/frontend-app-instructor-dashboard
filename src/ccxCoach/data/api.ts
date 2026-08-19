import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import { CcxCoachInfoResponse } from '../types';

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
