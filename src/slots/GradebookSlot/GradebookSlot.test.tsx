import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import GradebookSlot from './GradebookSlot';
import messages from './messages';
import { studentGradesSlotId } from '@src/constants';

const mockUseWidgetsForId = jest.fn();

// Encode the props received by Slot into an accessible name so the test can
// assert prop forwarding via getByRole instead of test ids.
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  useWidgetsForId: (id: string) => mockUseWidgetsForId(id),
  Slot: ({ id, courseId, onBack }: { id: string; courseId: string; onBack: () => void }) => (
    <section aria-label={`Slot ${id} for ${courseId}`}>
      <button type="button" onClick={onBack}>Back</button>
    </section>
  ),
}));

const renderSlot = (props: { courseId?: string; onBack?: () => void } = {}) => render(
  <IntlProvider locale="en" messages={{}}>
    <GradebookSlot
      courseId={props.courseId ?? 'test-course-id'}
      onBack={props.onBack ?? jest.fn()}
    />
  </IntlProvider>,
);

describe('GradebookSlot', () => {
  beforeEach(() => {
    mockUseWidgetsForId.mockReset();
  });

  it('forwards courseId and onBack to the student grades Slot when a widget is registered', async () => {
    mockUseWidgetsForId.mockReturnValue([{ id: 'gradebook-widget' }]);
    const user = userEvent.setup();
    const onBack = jest.fn();
    renderSlot({ onBack });

    const slot = screen.getByRole('region', {
      name: `Slot ${studentGradesSlotId} for test-course-id`,
    });

    await user.click(within(slot).getByRole('button', { name: 'Back' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders a warning fallback with a back button when no widget is registered', async () => {
    mockUseWidgetsForId.mockReturnValue([]);
    const user = userEvent.setup();
    const onBack = jest.fn();
    renderSlot({ onBack });

    expect(
      screen.getByText(messages.gradebookNotAvailableTitle.defaultMessage),
    ).toBeInTheDocument();
    expect(
      screen.getByText(messages.gradebookNotAvailableMessage.defaultMessage),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', {
      name: messages.gradebookNotAvailableBackButton.defaultMessage,
    }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
