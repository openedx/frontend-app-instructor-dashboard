import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnrollmentActionsSlot from '@src/slots/EnrollmentActionsSlot/EnrollmentActionsSlot';
import messages from '@src/enrollments/messages';
import { renderWithIntl } from '@src/testUtils';

const enrollLearnersName = new RegExp(messages.enrollLearners.defaultMessage);
const addBetaTestersName = new RegExp(messages.addBetaTesters.defaultMessage);

describe('EnrollmentActionsSlot (default slot widget)', () => {
  it('renders both action buttons enabled, regardless of permissions', () => {
    renderWithIntl(
      <EnrollmentActionsSlot permissions={{}} onEnrollLearners={jest.fn()} onAddBetaTesters={jest.fn()} />,
    );
    expect(screen.getByRole('button', { name: enrollLearnersName })).toBeEnabled();
    expect(screen.getByRole('button', { name: addBetaTestersName })).toBeEnabled();
  });

  it('calls onEnrollLearners when the Enroll Learners button is clicked', async () => {
    const onEnrollLearners = jest.fn();
    renderWithIntl(
      <EnrollmentActionsSlot onEnrollLearners={onEnrollLearners} onAddBetaTesters={jest.fn()} />,
    );
    await userEvent.setup().click(screen.getByRole('button', { name: enrollLearnersName }));
    expect(onEnrollLearners).toHaveBeenCalledTimes(1);
  });

  it('calls onAddBetaTesters when the Add Beta Testers button is clicked', async () => {
    const onAddBetaTesters = jest.fn();
    renderWithIntl(
      <EnrollmentActionsSlot onEnrollLearners={jest.fn()} onAddBetaTesters={onAddBetaTesters} />,
    );
    await userEvent.setup().click(screen.getByRole('button', { name: addBetaTestersName }));
    expect(onAddBetaTesters).toHaveBeenCalledTimes(1);
  });
});
