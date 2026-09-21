import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError } from 'axios';
import { renderWithAlertAndIntl } from '@src/testUtils';
import { useCreateCcxCoachCourse } from '@src/ccxCoach/data/apiHook';
import NewCCXCourse from './NewCCXCourse';
import messages from './messages';

jest.mock('@src/ccxCoach/data/apiHook', () => ({
  useCreateCcxCoachCourse: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ courseId: 'test-course-id' }),
}));

const mockMutate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useCreateCcxCoachCourse as jest.Mock).mockReturnValue({
    mutate: mockMutate,
  } as any);
});

describe('NewCCXCourse', () => {
  it('renders the label, input and create button', () => {
    renderWithAlertAndIntl(<NewCCXCourse />);

    expect(screen.getByLabelText(messages.newCCXCourseLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.newCCXCoursePlaceholder.defaultMessage)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: messages.createCCXCourseButton.defaultMessage })
    ).toBeInTheDocument();
  });

  it('disables the create button when the input is empty', () => {
    renderWithAlertAndIntl(<NewCCXCourse />);

    expect(
      screen.getByRole('button', { name: messages.createCCXCourseButton.defaultMessage })
    ).toBeDisabled();
  });

  it('enables the create button once the user types a name', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<NewCCXCourse />);

    const input = screen.getByPlaceholderText(messages.newCCXCoursePlaceholder.defaultMessage);
    await user.type(input, 'My CCX');

    expect(input).toHaveValue('My CCX');
    expect(
      screen.getByRole('button', { name: messages.createCCXCourseButton.defaultMessage })
    ).toBeEnabled();
  });

  it('disables the button again when the input is cleared', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<NewCCXCourse />);

    const input = screen.getByPlaceholderText(messages.newCCXCoursePlaceholder.defaultMessage);
    await user.type(input, 'My CCX');
    await user.clear(input);

    expect(input).toHaveValue('');
    expect(
      screen.getByRole('button', { name: messages.createCCXCourseButton.defaultMessage })
    ).toBeDisabled();
  });

  it('calls the create mutation with the entered name when the button is clicked', async () => {
    const user = userEvent.setup();
    renderWithAlertAndIntl(<NewCCXCourse />);

    await user.type(
      screen.getByPlaceholderText(messages.newCCXCoursePlaceholder.defaultMessage),
      'My CCX',
    );
    await user.click(
      screen.getByRole('button', { name: messages.createCCXCourseButton.defaultMessage }),
    );

    expect(useCreateCcxCoachCourse).toHaveBeenCalledWith('test-course-id');
    expect(mockMutate).toHaveBeenCalledWith('My CCX', expect.objectContaining({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    }));
  });

  it('navigates to the CCX enrollments page on successful creation', async () => {
    mockMutate.mockImplementation((_name, { onSuccess }) => {
      onSuccess({ ccxCourseId: 'ccx-123' });
    });
    const user = userEvent.setup();
    renderWithAlertAndIntl(<NewCCXCourse />);

    await user.type(
      screen.getByPlaceholderText(messages.newCCXCoursePlaceholder.defaultMessage),
      'My CCX',
    );
    await user.click(
      screen.getByRole('button', { name: messages.createCCXCourseButton.defaultMessage }),
    );

    expect(mockNavigate).toHaveBeenCalledWith('/ccx-coach/ccx-123/enrollments');
  });

  it('shows an error modal with the API error message when creation fails with an Axios error', async () => {
    const apiError = new AxiosError('Request failed');
    apiError.response = {
      data: { detail: 'CCX name already exists' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    };
    mockMutate.mockImplementation((_name, { onError }) => {
      onError(apiError);
    });

    const user = userEvent.setup();
    renderWithAlertAndIntl(<NewCCXCourse />);

    await user.type(
      screen.getByPlaceholderText(messages.newCCXCoursePlaceholder.defaultMessage),
      'My CCX',
    );
    await user.click(
      screen.getByRole('button', { name: messages.createCCXCourseButton.defaultMessage }),
    );

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(await screen.findByText('CCX name already exists')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: messages.closeButton.defaultMessage }),
    ).toBeInTheDocument();
  });

  it('shows a generic error message when creation fails without an Axios error message', async () => {
    mockMutate.mockImplementation((_name, { onError }) => {
      onError(new Error('boom'));
    });

    const user = userEvent.setup();
    renderWithAlertAndIntl(<NewCCXCourse />);

    await user.type(
      screen.getByPlaceholderText(messages.newCCXCoursePlaceholder.defaultMessage),
      'My CCX',
    );
    await user.click(
      screen.getByRole('button', { name: messages.createCCXCourseButton.defaultMessage }),
    );

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(
      await screen.findByText(messages.createError.defaultMessage),
    ).toBeInTheDocument();
  });
});
