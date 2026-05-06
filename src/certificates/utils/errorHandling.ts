export interface ApiError {
  response?: {
    data?: {
      error?: string,
      message?: string,
      detail?: string,
    } | string,
  },
  message?: string,
}

export const getErrorMessage = (error: ApiError, fallbackMessage: string): string => {
  // Handle case where response.data is an object
  if (error?.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data;
    // Try different common error message fields
    if (data.error && typeof data.error === 'string') return data.error;
    if (data.message && typeof data.message === 'string') return data.message;
    if (data.detail && typeof data.detail === 'string') return data.detail;
    // If data is an object we can't display, use fallback
    return fallbackMessage;
  }

  // Handle case where response.data is a string
  if (error?.response?.data && typeof error.response.data === 'string') {
    return error.response.data;
  }

  // Fall back to error.message or the fallback
  return error?.message || fallbackMessage;
};

export const parseLearnersCount = (learners: string): number =>
  learners.split(/[\n,]/).filter((l) => l.trim()).length;
