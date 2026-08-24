import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import ScheduleModal from './ScheduleModal';
import messages from '../messages';

describe('ScheduleModal', () => {
  it('renders section title and hides end date fields for section type', () => {
    renderWithIntl(
      <ScheduleModal
        isOpen
        type="section"
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
        type="subsection"
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
        type="section"
        onClose={onClose}
        onSave={jest.fn()}
      />
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: messages.cancelButton.defaultMessage }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('submits date and time values through onSave', async () => {
    const onSave = jest.fn();
    renderWithIntl(
      <ScheduleModal
        isOpen
        type="subsection"
        onClose={jest.fn()}
        onSave={onSave}
      />
    );

    const user = userEvent.setup();

    const dateInputs = document.querySelectorAll('input[type="date"]');
    const timeInputs = document.querySelectorAll('input[type="time"]');

    await user.type(dateInputs[0] as HTMLInputElement, '2026-08-26');
    await user.type(timeInputs[0] as HTMLInputElement, '08:30');
    await user.type(dateInputs[1] as HTMLInputElement, '2026-08-27');
    await user.type(timeInputs[1] as HTMLInputElement, '09:45');

    await user.click(screen.getByRole('button', { name: messages.saveButton.defaultMessage }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    expect(onSave.mock.calls[0][0]).toContain('T');
    expect(onSave.mock.calls[0][1]).toContain('T');
  });
});
