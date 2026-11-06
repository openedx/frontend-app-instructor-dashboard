// Public interface for the permissions feature (ADR-0002 strict module boundary).
// Consumers import from `@src/permissions`, never from deep paths.
//
// Check permissions with `useCoursePermission` or `PermissionGate`, not by
// calling frontend-base `usePermissions` directly: those share one cached
// request per course, while a different query would send its own request.
export { COURSE_PERMISSIONS } from './constants';
export { useCoursePermission } from './useCoursePermission';
export { usePermissionDeniedHandler } from './usePermissionDeniedHandler';
export { default as PermissionGate } from './PermissionGate';
export type { PermissionGateProps } from './PermissionGate';
export type {
  PermissionId,
  CoursePermissions,
  UseCoursePermissionResult,
} from './types';
