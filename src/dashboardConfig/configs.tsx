import CertificatesPage from '@src/certificates/CertificatesPage';
import CohortsPage from '@src/cohorts/CohortsPage';
import CourseInfoPage from '@src/courseInfo/CourseInfoPage';
import CourseTeamPage from '@src/courseTeam/CourseTeamPage';
import DataDownloadsPage from '@src/dataDownloads/DataDownloadsPage';
import DateExtensionsPage from '@src/dateExtensions/DateExtensionsPage';
import EnrollmentsPage from '@src/enrollments/EnrollmentsPage';
import GradingPage from '@src/grading/GradingPage';
import GradingPolicyPage from '@src/ccxCoach/pages/gradingPolicy/GradingPolicyPage';
import NewCCXCoachCourse from '@src/ccxCoach/pages/NewCCXCourse/NewCCXCourse';
import OpenResponsesPage from '@src/openResponses/OpenResponsesPage';
import SpecialExamsPage from '@src/specialExams/SpecialExamsPage';
import mainMessages from '@src/messages';
import { useCourseInfo } from '@src/data/apiHook';
import { useCcxCoachInfo } from '@src/ccxCoach/data/apiHook';
import { DashboardConfig } from './DashboardConfigContext';
import { instructorDashboardRoutesSlotId, instructorDashboardTabsSlotId, ccxCoachRoutesSlotId, ccxCoachTabsSlotId } from '@src/constants';

export const instructorDashboardConfig: DashboardConfig = {
  variantId: 'instructorDashboard',
  defaultTabs: [
    { tabId: 'course_info', content: <CourseInfoPage /> },
    { tabId: 'enrollments', content: <EnrollmentsPage /> },
    { tabId: 'course_team', content: <CourseTeamPage /> },
    { tabId: 'cohorts', content: <CohortsPage /> },
    { tabId: 'date_extensions', content: <DateExtensionsPage /> },
    { tabId: 'grading', content: <GradingPage /> },
    { tabId: 'data_downloads', content: <DataDownloadsPage /> },
    { tabId: 'special_exams', content: <SpecialExamsPage /> },
    { tabId: 'certificates', content: <CertificatesPage /> },
    { tabId: 'open_responses', content: <OpenResponsesPage /> },
  ],
  routesSlotId: instructorDashboardRoutesSlotId,
  navTabsSlotId: instructorDashboardTabsSlotId,
  useTabsInfo: useCourseInfo,
  titleMessage: mainMessages.instructorPageTitle,
  headerMessage: mainMessages.instructorDashboardHeader,
  defaultLandingTabId: 'course_info',
};

export const ccxCoachConfig: DashboardConfig = {
  variantId: 'ccxCoach',
  defaultTabs: [
    { tabId: 'new', content: <NewCCXCoachCourse /> },
    { tabId: 'enrollments', content: <EnrollmentsPage hideBetaTesters hideEnrollmentStatus /> },
    { tabId: 'grading_policy', content: <GradingPolicyPage /> },
  ],
  routesSlotId: ccxCoachRoutesSlotId,
  navTabsSlotId: ccxCoachTabsSlotId,
  useTabsInfo: useCcxCoachInfo,
  titleMessage: mainMessages.ccxCoachPageTitle,
  headerMessage: mainMessages.ccxCoachDashboardHeader,
  defaultLandingTabId: 'new',
};
