import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import type { DataList, PaginationParams } from '@src/types';
import type {
  CertificateData,
  CertificateGenerationHistory,
  CertificateQueryParams,
  GrantExceptionRequest,
  InstructorTask,
  InvalidateCertificateRequest,
  RemoveExceptionRequest,
  RemoveInvalidationRequest,
} from '@src/certificates/types';

export const getIssuedCertificates = async (
  courseId: string,
  params: CertificateQueryParams,
): Promise<DataList<CertificateData>> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/issued`,
    {
      params: {
        page: params.page + 1,
        page_size: params.pageSize,
        filter: params.filter,
        search: params.search,
      },
    },
  );
  return camelCaseObject(data);
};

export const getInstructorTasks = async (
  courseId: string,
  params: PaginationParams,
): Promise<DataList<InstructorTask>> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/instructor_tasks`,
    {
      params: {
        page: params.page + 1,
        page_size: params.pageSize,
      },
    },
  );
  return camelCaseObject(data);
};

export const grantBulkExceptions = async (
  courseId: string,
  request: GrantExceptionRequest,
): Promise<{ success: string[], errors: { learner: string, message: string }[] }> => {
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/exceptions`,
    {
      learners: request.learners,
      notes: request.notes,
    },
  );
  return camelCaseObject(data);
};

export const uploadBulkExceptionsCsv = async (
  courseId: string,
  file: File,
): Promise<{ success: string[], errors: { learner: string, message: string }[] }> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/exceptions/bulk`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return camelCaseObject(data);
};

export const invalidateCertificate = async (
  courseId: string,
  request: InvalidateCertificateRequest,
): Promise<{ success: string[], errors: { learner: string, message: string }[] }> => {
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/invalidations`,
    {
      learners: request.learners,
      notes: request.notes,
    },
  );
  return camelCaseObject(data);
};

export const removeException = async (
  courseId: string,
  request: RemoveExceptionRequest,
): Promise<void> => {
  await getAuthenticatedHttpClient().delete(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/exceptions`,
    {
      data: {
        username: request.username,
      },
    },
  );
};

export const removeInvalidation = async (
  courseId: string,
  request: RemoveInvalidationRequest,
): Promise<void> => {
  const httpClient = getAuthenticatedHttpClient();
  const url = `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/invalidations`;
  const payload = {
    username: request.username,
  };

  await httpClient.delete(url, {
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const toggleCertificateGeneration = async (
  courseId: string,
  enable: boolean,
): Promise<void> => {
  await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/toggle_generation`,
    {
      enabled: enable,
    },
  );
};

export const regenerateCertificates = async (
  courseId: string,
  filter: string,
): Promise<void> => {
  const body: { statuses?: string[], student_set?: string } = {};

  // Map filter to backend parameters (must match backend filter logic)
  switch (filter) {
    case 'all':
      body.student_set = 'all';
      break;
    case 'received':
      body.statuses = ['downloadable'];
      break;
    case 'not_received':
      // Match backend filter: notpassing or unavailable
      body.statuses = ['notpassing', 'unavailable'];
      break;
    case 'audit_passing':
      body.statuses = ['audit_passing'];
      break;
    case 'audit_not_passing':
      body.statuses = ['audit_notpassing'];
      break;
    case 'error':
      body.statuses = ['error'];
      break;
    case 'granted_exceptions':
      body.student_set = 'allowlisted';
      break;
    case 'invalidated':
      // Invalidated certificates have unavailable status
      body.statuses = ['unavailable'];
      break;
    default:
      body.student_set = 'all';
  }

  await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/regenerate`,
    body,
  );
};

export const getCertificateGenerationHistory = async (
  courseId: string,
  params: PaginationParams,
): Promise<DataList<CertificateGenerationHistory>> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/generation_history`,
    {
      params: {
        page: params.page + 1,
        page_size: params.pageSize,
      },
    },
  );
  return camelCaseObject(data);
};
