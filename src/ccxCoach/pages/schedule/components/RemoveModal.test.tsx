import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import RemoveModal from './RemoveModal';
import messages from '../messages';

describe('RemoveModal', () => {
  it('renders title and confirmation content when open', () => {
    renderWithIntl(<RemoveModal isOpen onClose={jest.fn()} onRemove={jest.fn()} category="chapter" />);

    expect(screen.getByRole('heading', { name: 'Remove Section?' })).toBeInTheDocument();
    expect(screen.getByText('Removing Section will unschedule all content contained in the Section')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.cancelButton.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Section' })).toBeInTheDocument();
  });

  it('renders interpolated text correctly for subsection', () => {
    renderWithIntl(<RemoveModal isOpen onClose={jest.fn()} onRemove={jest.fn()} category="sequential" />);

    expect(screen.getByRole('heading', { name: 'Remove Subsection?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Subsection' })).toBeInTheDocument();
  });

  it('renders interpolated text correctly for unit', () => {
    renderWithIntl(<RemoveModal isOpen onClose={jest.fn()} onRemove={jest.fn()} category="vertical" />);

    expect(screen.getByRole('heading', { name: 'Remove Unit?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Unit' })).toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', async () => {
    const onClose = jest.fn();
    renderWithIntl(<RemoveModal isOpen onClose={onClose} onRemove={jest.fn()} category="chapter" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: messages.cancelButton.defaultMessage }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when remove is clicked', async () => {
    const onRemove = jest.fn();
    renderWithIntl(<RemoveModal isOpen onClose={jest.fn()} onRemove={onRemove} category="chapter" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Remove Section' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
