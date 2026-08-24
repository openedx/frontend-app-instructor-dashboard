import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import RemoveModal from './RemoveModal';
import messages from '../messages';

describe('RemoveModal', () => {
  it('renders title and confirmation content when open', () => {
    renderWithIntl(<RemoveModal isOpen onClose={jest.fn()} onRemove={jest.fn()} blockType="section" />);

    expect(screen.getByRole('heading', { name: 'Remove section?' })).toBeInTheDocument();
    expect(screen.getByText('Removing section will unschedule all content contained in the section')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.cancelButton.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove section' })).toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', async () => {
    const onClose = jest.fn();
    renderWithIntl(<RemoveModal isOpen onClose={onClose} onRemove={jest.fn()} blockType="section" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: messages.cancelButton.defaultMessage }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when remove is clicked', async () => {
    const onRemove = jest.fn();
    renderWithIntl(<RemoveModal isOpen onClose={jest.fn()} onRemove={onRemove} blockType="section" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Remove section' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
