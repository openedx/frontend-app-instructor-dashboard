import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { renderWithIntl } from '@src/testUtils';
import Schedule from '@src/ccxCoach/pages/schedule/components/Schedule';
import { BlockAttributes } from '@src/ccxCoach/pages/schedule/types';
import messages from '../messages';
import { BLOCK_CATEGORIES } from '../constants';

const mockScheduleModal = jest.fn<JSX.Element, [Record<string, unknown>]>(() => <div>Schedule Modal</div>);
const mockRemoveModal = jest.fn<JSX.Element, [Record<string, unknown>]>((props) => (
  props.isOpen ? <button type="button" onClick={props.onRemove as () => void}>Confirm Remove</button> : <div>Remove Modal</div>
));

const renderMockScheduleModal = (props: Record<string, unknown>) => (
  props.isOpen
    ? <button type="button" onClick={() => (props.onSave as (startDate: string, endDate?: string) => void)('2026-08-26 08:30', '2026-08-27 09:45')}>Confirm Schedule</button>
    : <div>Schedule Modal</div>
);

jest.mock('@src/ccxCoach/pages/schedule/components/ScheduleModal', () => function MockScheduleModal(props) {
  return mockScheduleModal(props);
});
jest.mock('@src/ccxCoach/pages/schedule/components/RemoveModal', () => function MockRemoveModal(props) {
  return mockRemoveModal(props);
});

const mockScheduleData = [{
  location: 'section-location',
  displayName: 'Section One',
  category: BLOCK_CATEGORIES.CHAPTER,
  start: '2026-01-01 00:00',
  hidden: false,
  children: [{
    location: 'subsection-location',
    displayName: 'Subsection One',
    category: BLOCK_CATEGORIES.SEQUENTIAL,
    start: '2026-01-01 00:00',
    due: '2026-05-20 00:00',
    hidden: false,
    children: [{
      location: 'unit-location',
      displayName: 'Unit One',
      category: BLOCK_CATEGORIES.VERTICAL,
      start: '2026-01-01 00:00',
      due: '2026-05-20 00:00',
      hidden: true,
    }],
  }],
}];

describe('Schedule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScheduleModal.mockImplementation(renderMockScheduleModal);
  });

  const ScheduleHarness = ({ scheduleData, onSave = jest.fn() }: { scheduleData: BlockAttributes[]; onSave?: (data: BlockAttributes[]) => void }) => {
    const [isEditing, setIsEditing] = useState(true);
    return (
      <Schedule
        scheduleData={scheduleData}
        isEditing={isEditing}
        onSave={(data) => {
          onSave(data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
        startEditing={() => setIsEditing(true)}
      />
    );
  };

  it('hides blocks flagged as hidden when not editing', () => {
    const hiddenScheduleData = [{
      ...mockScheduleData[0],
      hidden: true,
      children: [{
        ...mockScheduleData[0].children[0],
        hidden: true,
        children: [{
          ...mockScheduleData[0].children[0].children[0],
          hidden: true,
        }],
      }],
    }];

    renderWithIntl(<Schedule scheduleData={hiddenScheduleData} isEditing={false} onSave={jest.fn()} onCancel={jest.fn()} startEditing={jest.fn()} />);

    expect(screen.queryByText('Section One')).not.toBeInTheDocument();
    expect(screen.queryByText('Subsection One')).not.toBeInTheDocument();
    expect(screen.queryByText('Unit One')).not.toBeInTheDocument();
  });

  it('renders schedule and remove modals with expected props when removing a block', async () => {
    const user = userEvent.setup();
    renderWithIntl(<Schedule scheduleData={mockScheduleData} isEditing onSave={jest.fn()} onCancel={jest.fn()} startEditing={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Remove Subsection' }));

    expect(mockScheduleModal).toHaveBeenCalled();
    expect(mockScheduleModal).toHaveBeenLastCalledWith(expect.objectContaining({
      isOpen: false,
      category: BLOCK_CATEGORIES.SEQUENTIAL,
      onClose: expect.any(Function),
      onSave: expect.any(Function),
    }));

    expect(mockRemoveModal).toHaveBeenCalled();
    expect(mockRemoveModal).toHaveBeenLastCalledWith(expect.objectContaining({
      isOpen: true,
      category: BLOCK_CATEGORIES.SEQUENTIAL,
      onClose: expect.any(Function),
      onRemove: expect.any(Function),
    }));
  });

  it('updates a vertical block locally on add and saves the edited tree', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();
    renderWithIntl(<Schedule scheduleData={mockScheduleData} isEditing onSave={onSave} onCancel={jest.fn()} startEditing={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: messages.addUnit.defaultMessage }));
    await user.click(screen.getByRole('button', { name: messages.saveButton.defaultMessage }));

    expect(onSave).toHaveBeenCalledWith([expect.objectContaining({
      hidden: false,
      children: [expect.objectContaining({
        hidden: false,
        children: [expect.objectContaining({
          location: 'unit-location',
          hidden: false,
        })],
      })],
    })]);
  });

  it('toggles section and subsection content visibility', async () => {
    const user = userEvent.setup();
    renderWithIntl(<Schedule scheduleData={mockScheduleData} isEditing onSave={jest.fn()} onCancel={jest.fn()} startEditing={jest.fn()} />);

    expect(screen.getByText('Subsection One')).toBeVisible();
    expect(screen.getByText('Unit One')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Section One' }));

    await waitFor(() => expect(screen.queryByText('Subsection One')).not.toBeInTheDocument());
    expect(screen.queryByText('Unit One')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Section One' }));
    await user.click(screen.getByRole('button', { name: 'Subsection One' }));

    expect(screen.getByText('Subsection One')).toBeVisible();
    await waitFor(() => expect(screen.queryByText('Unit One')).not.toBeInTheDocument());
  });

  it('updates a subsection block locally on remove and saves the edited tree', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();
    renderWithIntl(<Schedule scheduleData={mockScheduleData} isEditing onSave={onSave} onCancel={jest.fn()} startEditing={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Remove Subsection' }));
    await user.click(screen.getByRole('button', { name: 'Confirm Remove' }));
    await user.click(screen.getByRole('button', { name: messages.saveButton.defaultMessage }));

    expect(onSave).toHaveBeenCalledWith([expect.objectContaining({
      children: [expect.objectContaining({
        location: 'subsection-location',
        hidden: true,
        children: [expect.objectContaining({
          location: 'unit-location',
          hidden: true,
        })],
      })],
    })]);
  });

  it('shows the will-be-removed toggle only for blocks hidden during the edit session', async () => {
    const user = userEvent.setup();
    renderWithIntl(<Schedule scheduleData={mockScheduleData} isEditing onSave={jest.fn()} onCancel={jest.fn()} startEditing={jest.fn()} />);

    expect(screen.queryByRole('button', { name: /will be removed/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.addUnit.defaultMessage })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove Subsection' }));
    await user.click(screen.getByRole('button', { name: 'Confirm Remove' }));

    expect(screen.getByRole('button', { name: 'Subsection will be removed' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.addUnit.defaultMessage })).toBeInTheDocument();
  });

  it('disables the child Add button and shows a tooltip when an ancestor is being removed', async () => {
    const user = userEvent.setup();
    renderWithIntl(<Schedule scheduleData={mockScheduleData} isEditing onSave={jest.fn()} onCancel={jest.fn()} startEditing={jest.fn()} />);

    expect(screen.getByRole('button', { name: messages.addUnit.defaultMessage })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Remove Subsection' }));
    await user.click(screen.getByRole('button', { name: 'Confirm Remove' }));

    const disabledAddUnit = screen.getByRole('button', { name: messages.addUnit.defaultMessage });
    expect(disabledAddUnit).toBeDisabled();

    await user.hover(disabledAddUnit.parentElement as HTMLElement);

    await waitFor(() => {
      expect(screen.getByText('Subsection will be removed. To add Unit undo removal')).toBeInTheDocument();
    });
  });

  it('reverts the edited tree to the initial schedule when the user cancels', async () => {
    const user = userEvent.setup();
    const scheduleData = [{
      ...mockScheduleData[0],
      children: [{
        ...mockScheduleData[0].children[0],
        hidden: true,
      }],
    }];

    renderWithIntl(<ScheduleHarness scheduleData={scheduleData} />);

    await user.click(screen.getByRole('button', { name: messages.addSubsection.defaultMessage }));
    await user.click(screen.getByRole('button', { name: 'Confirm Schedule' }));
    expect(screen.getByRole('button', { name: 'Remove Subsection' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: messages.cancelButton.defaultMessage }));

    expect(screen.queryByText('Subsection One')).not.toBeInTheDocument();
  });

  it('does not hide section and subsection parents when removing one unit with visible siblings', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();
    const scheduleData = [{
      ...mockScheduleData[0],
      children: [{
        ...mockScheduleData[0].children[0],
        children: [
          {
            ...mockScheduleData[0].children[0].children[0],
            hidden: false,
          },
          {
            ...mockScheduleData[0].children[0].children[0],
            location: 'sibling-unit-location',
            displayName: 'Sibling Unit',
            hidden: false,
          },
        ],
      }],
    }];
    renderWithIntl(<Schedule scheduleData={scheduleData} isEditing onSave={onSave} onCancel={jest.fn()} startEditing={jest.fn()} />);

    await user.click(screen.getAllByRole('button', { name: 'Remove Unit' })[0]);
    await user.click(screen.getByRole('button', { name: messages.saveButton.defaultMessage }));

    expect(onSave).toHaveBeenCalledWith([expect.objectContaining({
      hidden: false,
      children: [expect.objectContaining({
        hidden: false,
        children: [
          expect.objectContaining({
            location: 'unit-location',
            hidden: true,
          }),
          expect.objectContaining({
            location: 'sibling-unit-location',
            hidden: false,
          }),
        ],
      })],
    })]);
  });

  it('saves normalized start date when scheduling a section', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();
    const scheduleData = [{
      ...mockScheduleData[0],
      hidden: true,
    }];
    renderWithIntl(<Schedule scheduleData={scheduleData} isEditing onSave={onSave} onCancel={jest.fn()} startEditing={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: messages.addSection.defaultMessage }));
    await user.click(screen.getByRole('button', { name: 'Confirm Schedule' }));
    await user.click(screen.getByRole('button', { name: messages.saveButton.defaultMessage }));

    expect(onSave).toHaveBeenCalledWith([expect.objectContaining({
      location: 'section-location',
      hidden: false,
      start: '2026-08-26 08:30',
      children: [expect.objectContaining({
        location: 'subsection-location',
        start: '2026-01-01 00:00',
      })],
    })]);
  });

  it('saves normalized start and due dates when scheduling a subsection', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();
    const scheduleData = [{
      ...mockScheduleData[0],
      children: [{
        ...mockScheduleData[0].children[0],
        hidden: true,
      }],
    }];
    renderWithIntl(<Schedule scheduleData={scheduleData} isEditing onSave={onSave} onCancel={jest.fn()} startEditing={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: messages.addSubsection.defaultMessage }));
    await user.click(screen.getByRole('button', { name: 'Confirm Schedule' }));
    await user.click(screen.getByRole('button', { name: messages.saveButton.defaultMessage }));

    expect(onSave).toHaveBeenCalledWith([expect.objectContaining({
      children: [expect.objectContaining({
        location: 'subsection-location',
        hidden: false,
        start: '2026-08-26 08:30',
        due: '2026-08-27 09:45',
      })],
    })]);
  });

  it('shows the Remove button when not editing', () => {
    const scheduleData = [{
      ...mockScheduleData[0],
      children: [{
        ...mockScheduleData[0].children[0],
        children: [
          {
            ...mockScheduleData[0].children[0].children[0],
            hidden: false,
          },
        ]
      }]
    }];
    renderWithIntl(<Schedule scheduleData={scheduleData} isEditing={false} onSave={jest.fn()} onCancel={jest.fn()} startEditing={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Remove Section' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Subsection' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Unit' })).toBeInTheDocument();
  });

  it('enters editing mode when confirming a remove while not editing', async () => {
    const startEditing = jest.fn();
    const user = userEvent.setup();
    renderWithIntl(<Schedule scheduleData={mockScheduleData} isEditing={false} onSave={jest.fn()} onCancel={jest.fn()} startEditing={startEditing} />);

    await user.click(screen.getByRole('button', { name: 'Remove Subsection' }));
    await user.click(screen.getByRole('button', { name: 'Confirm Remove' }));

    expect(startEditing).toHaveBeenCalledTimes(1);
  });
});
