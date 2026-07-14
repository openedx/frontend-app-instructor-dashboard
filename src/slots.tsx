import { helpButtonSlotOperation, SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import CourseInfoSlot from '@src/slots/CourseInfoSlot/CourseInfoSlot';
import EnrollmentActionsSlot from '@src/slots/EnrollmentActionsSlot/EnrollmentActionsSlot';
import { appId, enrollmentActionsSlotId, enrollmentActionsWidgetId, instructorDashboardRole } from '@src/constants';

const slots: SlotOperation[] = [
  helpButtonSlotOperation({ appId, role: instructorDashboardRole }),
  {
    slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
    id: 'org.openedx.frontend.widget.slotShowcase.headerLink',
    op: WidgetOperationTypes.APPEND,
    element: <CourseInfoSlot />,
  },
  {
    slotId: enrollmentActionsSlotId,
    id: enrollmentActionsWidgetId,
    op: WidgetOperationTypes.APPEND,
    component: EnrollmentActionsSlot,
  },
];

export default slots;
