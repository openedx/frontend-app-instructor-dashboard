import { providesCourseBarMasqueradeRolesId, providesCourseBarRolesId } from '@openedx/frontend-base';
import { instructorDashboardRole } from './constants';

const provides = {
  [providesCourseBarRolesId]: instructorDashboardRole,
  [providesCourseBarMasqueradeRolesId]: instructorDashboardRole,
};

export default provides;
