import { helpButtonSlotOperation, SlotOperation } from '@openedx/frontend-base';

import { appId, instructorDashboardRole } from './constants';

const slots: SlotOperation[] = [
  helpButtonSlotOperation({ appId, role: instructorDashboardRole }),
];

export default slots;
