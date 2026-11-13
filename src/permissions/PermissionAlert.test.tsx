import { screen } from '@testing-library/react';
import PermissionAlert from './PermissionAlert';
import messages from './messages';
import { renderWithIntl } from '@src/testUtils';

describe('PermissionAlert', () => {
  it('shows the view-only message by default', () => {
    renderWithIntl(<PermissionAlert />);
    expect(screen.getByRole('alert')).toHaveTextContent(messages.viewOnlyAlert.defaultMessage);
  });

  it('shows the children instead of the default message', () => {
    renderWithIntl(<PermissionAlert>You can enroll learners only.</PermissionAlert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('You can enroll learners only.');
    expect(alert).not.toHaveTextContent(messages.viewOnlyAlert.defaultMessage);
  });

  it('renders a lock icon', () => {
    renderWithIntl(<PermissionAlert />);
    expect(screen.getByRole('alert').querySelector('.alert-icon')).toBeInTheDocument();
  });

  it('applies the given className', () => {
    renderWithIntl(<PermissionAlert className="mt-3" />);
    expect(screen.getByRole('alert')).toHaveClass('mt-3');
  });
});
