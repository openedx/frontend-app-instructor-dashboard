import {
  createContext, useContext, useMemo, FC,
} from 'react';
import { useParams } from 'react-router-dom';
import { useCourseInfo } from '@src/data/apiHook';
import { PermissionContextValue, PermissionProviderProps } from './types';

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

/**
 * Exposes the current user's effective AuthZ permissions for the course to the
 * whole dashboard.
 *
 * The permissions come from the backend's `authz_permissions` field on
 * `CourseMetadataView`, part of the openedx-authz work.
 * The field is absent until the backend AuthZ flag is enabled for the course.
 *
 * Reads from `useCourseInfo`, which is already fetched for the dashboard, so no
 * extra network request is made (React Query dedupes the shared query).
 */
export const PermissionProvider: FC<PermissionProviderProps> = ({ children }) => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data, isLoading, error } = useCourseInfo(courseId);

  const value = useMemo<PermissionContextValue>(() => ({
    permissions: data?.authzPermissions,
    isLoading,
    error,
  }), [data?.authzPermissions, isLoading, error]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = (): PermissionContextValue => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
};
