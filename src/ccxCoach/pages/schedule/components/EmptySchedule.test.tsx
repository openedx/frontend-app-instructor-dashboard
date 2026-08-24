import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import EmptySchedule from './EmptySchedule';
import messages from '../messages';

describe('EmptySchedule', () => {
  it('renders empty state message and schedule button', () => {
    const { container } = renderWithIntl(<EmptySchedule />);

    expect(screen.getByText(messages.emptyScheduleMessage.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.schedulePageTitle.defaultMessage })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('d-flex');
  });

  it('allows clicking schedule button', async () => {
    renderWithIntl(<EmptySchedule />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: messages.schedulePageTitle.defaultMessage }));

    expect(screen.getByRole('button', { name: messages.schedulePageTitle.defaultMessage })).toBeInTheDocument();
  });
});
