import { screen } from '@testing-library/react';
import AccessErrorAlert from './AccessErrorAlert';
import messages from './messages';
import { renderWithIntl } from '@src/testUtils';

describe('AccessErrorAlert', () => {
  it.each([
    ['forbidden', messages.forbiddenErrorHeading, messages.forbiddenErrorMessage],
    ['unauthorized', messages.unauthorizedErrorHeading, messages.unauthorizedErrorMessage],
    ['generic', messages.genericErrorHeading, messages.genericErrorMessage],
  ] as const)('renders the %s heading and message', (errorType, heading, message) => {
    renderWithIntl(<AccessErrorAlert errorType={errorType} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(heading.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(message.defaultMessage)).toBeInTheDocument();
  });

  it('renders only the message of its own error type', () => {
    renderWithIntl(<AccessErrorAlert errorType="generic" />);

    expect(screen.queryByText(messages.forbiddenErrorMessage.defaultMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(messages.unauthorizedErrorMessage.defaultMessage)).not.toBeInTheDocument();
  });
});
