import { screen } from '@testing-library/react';
import EnrollmentsAccessAlert from '@src/enrollments/components/EnrollmentsAccessAlert';
import messages from '@src/enrollments/messages';
import { EnrollmentsAccess } from '@src/enrollments/types';
import { renderWithIntl } from '@src/testUtils';

const access = (overrides: Partial<EnrollmentsAccess>): EnrollmentsAccess => ({
  canViewEnrollments: true,
  canEnroll: false,
  canUnenroll: false,
  canManageBetaTesters: false,
  ...overrides,
});

describe('EnrollmentsAccessAlert', () => {
  it('explains view-only access', () => {
    renderWithIntl(<EnrollmentsAccessAlert access={access({})} />);
    expect(screen.getByText(messages.viewOnlyAccessAlert.defaultMessage)).toBeInTheDocument();
  });

  it('explains enroll-only access', () => {
    renderWithIntl(<EnrollmentsAccessAlert access={access({ canEnroll: true })} />);
    expect(screen.getByText(messages.enrollOnlyAccessAlert.defaultMessage)).toBeInTheDocument();
  });

  it('explains unenroll-only access', () => {
    renderWithIntl(<EnrollmentsAccessAlert access={access({ canUnenroll: true })} />);
    expect(screen.getByText(messages.unenrollOnlyAccessAlert.defaultMessage)).toBeInTheDocument();
  });

  it('still says enroll-only when the user also manages beta testers', () => {
    renderWithIntl(<EnrollmentsAccessAlert access={access({ canEnroll: true, canManageBetaTesters: true })} />);
    expect(screen.getByText(messages.enrollOnlyAccessAlert.defaultMessage)).toBeInTheDocument();
  });

  it.each([
    ['enroll and unenroll', { canEnroll: true, canUnenroll: true }],
    ['all permissions', { canEnroll: true, canUnenroll: true, canManageBetaTesters: true }],
    ['beta testers only', { canManageBetaTesters: true }],
  ])('renders nothing for %s', (_name, overrides) => {
    const { container } = renderWithIntl(<EnrollmentsAccessAlert access={access(overrides)} />);
    expect(container).toBeEmptyDOMElement();
  });
});
