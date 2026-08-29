import {
  createContext, ReactNode, useContext,
} from 'react';
import { MessageDescriptor } from '@openedx/frontend-base';
import type { TabProps } from '@src/instructorNav/InstructorNav';

export interface DashboardRouteProps {
  tabId: string,
  content: ReactNode,
}

// Minimal shape shared by both `useCourseInfo` and `useCcxCoachInfo` for the nav.
export interface DashboardTabsInfo {
  data?: { tabs?: TabProps[] },
  isLoading: boolean,
  error?: unknown,
}

export type UseDashboardTabsInfo = (courseId: string) => DashboardTabsInfo;

export interface DashboardConfig {
  variantId: string,
  defaultTabs: DashboardRouteProps[],
  routesSlotId: string,
  navTabsSlotId: string,
  useTabsInfo: UseDashboardTabsInfo,
  titleMessage: MessageDescriptor,
  headerMessage: MessageDescriptor,
  defaultLandingTabId: string,
}

const DashboardConfigContext = createContext<DashboardConfig | null>(null);

interface DashboardConfigProviderProps {
  value: DashboardConfig,
  children: ReactNode,
}

export const DashboardConfigProvider = ({ value, children }: DashboardConfigProviderProps) => (
  <DashboardConfigContext.Provider value={value}>
    {children}
  </DashboardConfigContext.Provider>
);

export const useDashboardConfig = (): DashboardConfig => {
  const config = useContext(DashboardConfigContext);
  if (!config) {
    throw new Error('useDashboardConfig must be used within a DashboardConfigProvider');
  }
  return config;
};
