// Public interface for the permissions feature (ADR-0002 strict module boundary).
// Consumers import from `@src/permissions`, never from deep paths.
export { PermissionProvider, usePermissionContext } from './PermissionContext';
export { useCoursePermission } from './useCoursePermission';
export { usePermissionDeniedHandler } from './usePermissionDeniedHandler';
export { default as PermissionGate } from './PermissionGate';
export type { PermissionGateProps } from './PermissionGate';
export type {
  PermissionId,
  AuthzPermissions,
  PermissionContextValue,
  UseCoursePermissionResult,
} from './types';
