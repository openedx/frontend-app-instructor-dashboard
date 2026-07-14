export { default as instructorDashboardApp } from './app';
export { default as instructorDashboardRoutes } from './routes';

// Public slot API for site operators (e.g. to override the enrollment action buttons via site.config).
export { enrollmentActionsSlotId, enrollmentActionsWidgetId } from './constants';
export type { EnrollmentActionsSlotProps } from './slots/EnrollmentActionsSlot/EnrollmentActionsSlot';
