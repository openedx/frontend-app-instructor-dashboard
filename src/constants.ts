export const appId = 'org.openedx.frontend.app.instructorDashboard';
export const instructorDashboardRole = 'org.openedx.frontend.role.instructorDashboard';

// Slot rendered in place of the enrollment action buttons (Enroll Learners / Add Beta Testers).
// The default widget renders the buttons for everyone; a deployment can REPLACE or REMOVE it via
// site.config to change which buttons appear and who may use them.
export const enrollmentActionsSlotId = 'org.openedx.frontend.slot.instructorDashboard.enrollmentActions.v1';
export const enrollmentActionsWidgetId = 'org.openedx.frontend.widget.instructorDashboard.enrollmentActions.default';

// Slot rendered in place of gradebook on the student grades tab content in the CCX Coach dashboard.
export const studentGradesSlotId = 'org.openedx.frontend.slot.ccxCoach.studentGrades.v1';

// Slot Ids for the instructor dashboard and CCX coach dashboard routes and nav tabs.
// These slots are used to allow operators to add additional routes or tabs to the dashboards.
export const instructorDashboardRoutesSlotId = 'org.openedx.frontend.slot.instructorDashboard.routes.v1';
export const instructorDashboardTabsSlotId = 'org.openedx.frontend.slot.instructorDashboard.tabs.v1';
export const ccxCoachRoutesSlotId = 'org.openedx.frontend.slot.ccxCoach.routes.v1';
export const ccxCoachTabsSlotId = 'org.openedx.frontend.slot.ccxCoach.tabs.v1';
