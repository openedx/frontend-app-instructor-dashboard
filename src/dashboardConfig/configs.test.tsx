import { isValidElement } from 'react';
import { ccxCoachConfig, instructorDashboardConfig } from './configs';
import EnrollmentsPage from '@src/enrollments/EnrollmentsPage';
import InstructorEnrollmentsPage from '@src/enrollments/InstructorEnrollmentsPage';

const enrollmentsPageType = (config: typeof instructorDashboardConfig) => {
  const content = config.defaultTabs.find(tab => tab.tabId === 'enrollments')?.content;
  return isValidElement(content) ? content.type : undefined;
};

describe('dashboard configs', () => {
  // The CCX Coach dashboard is not governed by AuthZ, and the permission hooks would send
  // instructor API requests with a CCX course id, so it must use the ungated page.
  it('gates the enrollments tab by permission in the instructor dashboard only', () => {
    expect(enrollmentsPageType(instructorDashboardConfig)).toBe(InstructorEnrollmentsPage);
    expect(enrollmentsPageType(ccxCoachConfig)).toBe(EnrollmentsPage);
  });
});
