import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CohortsForm from '@src/cohorts/components/CohortsForm';
import messages from '@src/cohorts/messages';
import { renderWithAlertAndIntl, renderWithIntl } from '@src/testUtils';
import { useContentGroupsData } from '@src/cohorts/data/apiHook';
import { CohortProvider } from '@src/cohorts/components/CohortContext';
import * as CohortContextModule from '@src/cohorts/components/CohortContext';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ courseId: 'course-v1:edX+DemoX+Demo_Course' }),
}));

const mockContentGroups = [
  { id: '2', name: 'Group 1' },
  { id: '3', name: 'Group 2' },
];

jest.mock('@src/cohorts/data/apiHook', () => ({
  useContentGroupsData: jest.fn(),
}));

describe('CohortsForm', () => {
  const onCancel = jest.fn();
  const onSubmit = jest.fn();

  const renderComponent = () =>
    renderWithAlertAndIntl(
      <CohortProvider>
        <CohortsForm onCancel={onCancel} onSubmit={onSubmit} />
      </CohortProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('disables all settings and hides edit actions in read-only mode', async () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups } });
    renderWithIntl(<CohortProvider><CohortsForm readOnly onCancel={onCancel} onSubmit={onSubmit} /></CohortProvider>);
    expect(screen.getByRole('textbox')).toBeDisabled();
    screen.getAllByRole('radio').forEach(radio => expect(radio).toBeDisabled());
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    await userEvent.setup().type(screen.getByRole('textbox'), 'Unauthorized edit');
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('hides the content-group creation link in read-only mode', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: [], studioContentGroupsLink: 'https://example.com/groups' } });
    renderWithIntl(<CohortProvider><CohortsForm readOnly onCancel={onCancel} onSubmit={onSubmit} /></CohortProvider>);
    expect(screen.getByText(messages.noContentGroups.defaultMessage)).toBeInTheDocument();
    expect(screen.queryByText(messages.createContentGroup.defaultMessage)).not.toBeInTheDocument();
  });

  it('renders cohort name input', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups } });
    renderComponent();
    expect(screen.getByPlaceholderText(messages.cohortName.defaultMessage)).toBeInTheDocument();
  });

  it('renders assignment method radios', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups } });
    renderComponent();
    expect(screen.getByLabelText(messages.automatic.defaultMessage)).toBeInTheDocument();
    expect(screen.getByLabelText(messages.manual.defaultMessage)).toBeInTheDocument();
  });

  it('renders content group radios and select', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups } });
    renderComponent();
    expect(screen.getByLabelText(messages.noContentGroup.defaultMessage)).toBeInTheDocument();
    expect(screen.getByLabelText(messages.selectAContentGroup.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(mockContentGroups[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockContentGroups[1].name)).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups } });
    renderComponent();
    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: messages.cancelLabel.defaultMessage });
    await user.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onSubmit when Save button is enabled and clicked', async () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups } });
    renderComponent();
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(messages.cohortName.defaultMessage);
    await user.type(input, 'Test Cohort');
    await user.click(screen.getByText(messages.saveLabel.defaultMessage));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('updates cohort name input value', async () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups } });
    renderComponent();
    const input = screen.getByPlaceholderText(messages.cohortName.defaultMessage);
    const user = userEvent.setup();
    await user.type(input, 'Test Cohort');
    expect(input).toHaveValue('Test Cohort');
  });

  it('disables select when "Select a Content Group" is not chosen', async () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups } });
    renderComponent();
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(messages.selectAContentGroup.defaultMessage));
    expect(select).not.toBeDisabled();
  });

  it('renders warning and create link when no content groups', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: [] } });
    renderComponent();
    expect(screen.getByText(messages.noContentGroups.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.createContentGroup.defaultMessage)).toBeInTheDocument();
  });

  it('submits correct data when selecting a content group', async () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups, id: 1 } });
    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByLabelText(messages.selectAContentGroup.defaultMessage));
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, mockContentGroups[1].id);

    const input = screen.getByPlaceholderText(messages.cohortName.defaultMessage);
    await user.clear(input);
    await user.type(input, 'Cohort With Group');

    await user.click(screen.getByText(messages.saveLabel.defaultMessage));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Cohort With Group',
        groupId: 3,
        userPartitionId: 1,
        assignmentType: 'random',
      })
    );
  });

  it('disables manual assignment radio when disableManualAssignment is true', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups } });
    renderWithIntl(
      <CohortProvider>
        <CohortsForm onCancel={onCancel} onSubmit={onSubmit} disableManualAssignment />
      </CohortProvider>
    );
    const manualRadio = screen.getByLabelText(messages.manual.defaultMessage);
    expect(manualRadio).toBeDisabled();
  });

  it('shows initial values in context', async () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups } });

    jest.spyOn(CohortContextModule, 'useCohortContext').mockReturnValue({
      selectedCohort: {
        id: 1,
        name: 'Initial Cohort',
        assignmentType: 'manual',
        groupId: 2,
        userPartitionId: 3,
        userCount: 0
      },
      setSelectedCohort: jest.fn(),
      clearSelectedCohort: jest.fn(),
      updateCohortField: jest.fn(),
    });

    renderWithIntl(
      <CohortProvider>
        <CohortsForm onCancel={onCancel} onSubmit={onSubmit} />
      </CohortProvider>
    );

    await waitFor(() => {
      const nameInput = screen.getByDisplayValue('Initial Cohort');
      expect(nameInput).toBeInTheDocument();
    });

    const manualRadio = screen.getByLabelText(messages.manual.defaultMessage);
    expect(manualRadio).toBeChecked();

    const selectGroupRadio = screen.getByLabelText(messages.selectAContentGroup.defaultMessage);
    expect(selectGroupRadio).toBeChecked();

    const groupSelect = screen.getByRole('combobox');
    expect(groupSelect).toHaveValue('2');
  });
});
