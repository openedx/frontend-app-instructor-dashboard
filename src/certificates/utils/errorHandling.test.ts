import { getErrorMessage, parseLearnersCount, type ApiError } from '@src/certificates/utils/errorHandling';

describe('errorHandling', () => {
  describe('getErrorMessage', () => {
    it('returns error message from response data', () => {
      const error: ApiError = {
        response: {
          data: {
            error: 'API error occurred',
          },
        },
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('API error occurred');
    });

    it('returns error message from error object', () => {
      const error: ApiError = {
        message: 'Direct error message',
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Direct error message');
    });

    it('returns fallback message when no error details', () => {
      const error: ApiError = {};
      expect(getErrorMessage(error, 'Fallback message')).toBe('Fallback message');
    });

    it('prioritizes response.data.error over message', () => {
      const error: ApiError = {
        response: {
          data: {
            error: 'Response error',
          },
        },
        message: 'Generic message',
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Response error');
    });

    it('handles undefined error gracefully', () => {
      const error: ApiError = {};
      expect(getErrorMessage(error, 'Default error')).toBe('Default error');
    });

    it('handles empty error response', () => {
      const error: ApiError = {
        response: {
          data: {},
        },
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Fallback');
    });

    it('returns error from response.data.message', () => {
      const error: ApiError = {
        response: {
          data: {
            message: 'Error from data.message',
          },
        },
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Error from data.message');
    });

    it('returns error from response.data.detail', () => {
      const error: ApiError = {
        response: {
          data: {
            detail: 'Error from data.detail',
          },
        },
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Error from data.detail');
    });

    it('returns error from response.data when it is a string', () => {
      const error: ApiError = {
        response: {
          data: 'Error string',
        },
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Error string');
    });

    it('prefers error over message over detail', () => {
      const error: ApiError = {
        response: {
          data: {
            error: 'Error text',
            message: 'Message text',
            detail: 'Detail text',
          },
        },
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Error text');
    });

    it('uses message when error is not present', () => {
      const error: ApiError = {
        response: {
          data: {
            message: 'Message text',
            detail: 'Detail text',
          },
        },
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Message text');
    });

    it('uses detail when error and message are not present', () => {
      const error: ApiError = {
        response: {
          data: {
            detail: 'Detail text',
          },
        },
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Detail text');
    });
  });

  describe('parseLearnersCount', () => {
    it('counts single learner', () => {
      expect(parseLearnersCount('user1')).toBe(1);
    });

    it('counts comma-separated learners', () => {
      expect(parseLearnersCount('user1,user2,user3')).toBe(3);
    });

    it('counts newline-separated learners', () => {
      expect(parseLearnersCount('user1\nuser2\nuser3')).toBe(3);
    });

    it('counts mixed comma and newline separators', () => {
      expect(parseLearnersCount('user1,user2\nuser3,user4')).toBe(4);
    });

    it('returns 0 for empty string', () => {
      expect(parseLearnersCount('')).toBe(0);
    });

    it('handles whitespace around usernames', () => {
      expect(parseLearnersCount('user1 , user2 , user3')).toBe(3);
    });

    it('handles multiple newlines and commas', () => {
      expect(parseLearnersCount('user1,,\n\nuser2,user3')).toBe(3);
    });

    it('filters out empty entries', () => {
      expect(parseLearnersCount('user1,,,user2')).toBe(2);
      expect(parseLearnersCount('user1\n\n\nuser2')).toBe(2);
    });

    it('handles single learner with whitespace', () => {
      expect(parseLearnersCount('  user1  ')).toBe(1);
    });

    it('handles trailing commas and newlines', () => {
      expect(parseLearnersCount('user1,user2,\nuser3\n')).toBe(3);
    });
  });
});
