import { instructorDashboardRole } from './constants';
import slots from './slots';

describe('slots', () => {
  it('only shows the header course info on instructor dashboard routes', () => {
    const courseInfo = slots.find(({ slotId }) => slotId === 'org.openedx.frontend.slot.header.primaryLinks.v1');

    expect(courseInfo?.condition).toEqual({ active: [instructorDashboardRole] });
  });
});
