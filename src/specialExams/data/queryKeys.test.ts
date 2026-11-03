import { partialMatchKey } from '@tanstack/react-query';
import { specialExamsQueryKeys } from './queryKeys';

const courseId = 'course-v1:edX+Test+2023';
const keyFns = {
  attempts: (page: number) => specialExamsQueryKeys.attempts(courseId, { page, pageSize: 25, emailOrUsername: 'a', ordering: 'b' }),
  allowances: (page: number) => specialExamsQueryKeys.allowances(courseId, { page, pageSize: 25, emailOrUsername: 'a', ordering: 'b' }),
  onboarding: (page: number) => specialExamsQueryKeys.onboarding(courseId, { page, emailOrUsername: 'a', statuses: [] }),
};

describe('specialExamsQueryKeys', () => {
  it.each(Object.entries(keyFns))('%s keys differ for the first two pages', (_, keyFn) => {
    expect(keyFn(0)).not.toEqual(keyFn(1));
  });

  it.each(['attempts', 'allowances'] as const)('%s keys differ by page size', (name) => {
    const params = { page: 0, emailOrUsername: 'a', ordering: 'b' };
    expect(specialExamsQueryKeys[name](courseId, { ...params, pageSize: 25 }))
      .not.toEqual(specialExamsQueryKeys[name](courseId, { ...params, pageSize: 100 }));
  });

  it.each(Object.entries(keyFns))('%s key without params matches every page and filter', (name, keyFn) => {
    const baseKey = specialExamsQueryKeys[name as keyof typeof keyFns](courseId);
    expect(partialMatchKey(keyFn(3), baseKey)).toBe(true);
  });
});
