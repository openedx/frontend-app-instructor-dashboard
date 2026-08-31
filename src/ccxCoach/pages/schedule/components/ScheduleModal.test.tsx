import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import ScheduleModal from '@src/ccxCoach/pages/schedule/components/ScheduleModal';
import messages from '../messages';

describe('ScheduleModal', () => {
  it('renders section title and hides end date fields for section type', () => {
    renderWithIntl(
      <ScheduleModal
        isOpen
        category="chapter"
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );

    expect(screen.getByText(messages.sectionDialogTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.queryByText(messages.endDate.defaultMessage)).not.toBeInTheDocument();
  });

  it('renders subsection title and shows end date fields for subsection type', () => {
    renderWithIntl(
      <ScheduleModal
        isOpen
        category="sequential"
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );

    expect(screen.getByText(messages.subsectionDialogTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.endDate.defaultMessage)).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const onClose = jest.fn();
    renderWithIntl(
      <ScheduleModal
        isOpen
        category="chapter"
        onClose={onClose}
        onSave={jest.fn()}
      />
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: messages.cancelButton.defaultMessage }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('submits date and time values through onSave', async () => {
    const startDate = '2026-08-26';
    const startTime = '08:30';
    const endDate = '2026-08-27';
    const endTime = '09:45';
    const onSave = jest.fn();
    renderWithIntl(
      <ScheduleModal
        isOpen
        category="sequential"
        onClose={jest.fn()}
        onSave={onSave}
      />
    );

    const user = userEvent.setup();

    const dateInputs = document.querySelectorAll('input[type="date"]');
    const timeInputs = document.querySelectorAll('input[type="time"]');

    await user.type(dateInputs[0] as HTMLInputElement, startDate);
    await user.type(timeInputs[0] as HTMLInputElement, startTime);
    await user.type(dateInputs[1] as HTMLInputElement, endDate);
    await user.type(timeInputs[1] as HTMLInputElement, endTime);

    await user.click(screen.getByRole('button', { name: messages.scheduleContent.defaultMessage }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(`${startDate} ${startTime}`, `${endDate} ${endTime}`);
  });

  it('prefills date and time inputs from existing start and due values', () => {
    renderWithIntl(
      <ScheduleModal
        isOpen
        category="sequential"
        start="2026-08-26T08:30:00Z"
        due="2026-08-27 09:45"
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );

    const dateInputs = document.querySelectorAll('input[type="date"]');
    const timeInputs = document.querySelectorAll('input[type="time"]');

    expect(dateInputs[0]).toHaveValue('2026-08-26');
    expect(timeInputs[0]).toHaveValue('08:30');
    expect(dateInputs[1]).toHaveValue('2026-08-27');
    expect(timeInputs[1]).toHaveValue('09:45');
  });

  it('disables the submit button when the start date is missing', () => {
    renderWithIntl(
      <ScheduleModal
        isOpen
        category="chapter"
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: messages.scheduleContent.defaultMessage })).toBeDisabled();
  });
});
