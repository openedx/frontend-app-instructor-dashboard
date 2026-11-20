import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateExtensionsList, { DateExtensionListProps } from './DateExtensionsList';
import { renderWithIntl } from '../../testUtils';
import { useDateExtensions, useGradedSubsections } from '../data/apiHook';

const testCourseId = 'course-v1:edX+DemoX+Demo_Course';

const mockData = [
  {
    id: 1,
    username: 'test_user',
    fullName: 'Test User',
    email: 'test@example.com',
    unitTitle: 'Test Section',
    extendedDueDate: '2025-11-07T00:00:00Z'
  }
];

const mockGradedSubsections = [
  {
    subsectionId: 'subsection-1block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378',
    displayName: 'Three body diagrams'
  }
];

jest.mock('../data/apiHook', () => ({
  useDateExtensions: jest.fn(),
  useGradedSubsections: jest.fn().mockReturnValue({ data: { items: [] } }),
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({ courseId: testCourseId }),
}));

const mockResetExtensions = jest.fn();
const mockOnClickAdd = jest.fn();

describe('DateExtensionsList', () => {
  const renderComponent = (props: DateExtensionListProps) => renderWithIntl(
    <DateExtensionsList {...props} />
  );

  it('omits management controls without action callbacks while keeping the table and filters', () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ data: { count: 1, results: mockData } });
    renderComponent({});
    expect(screen.getByText(mockData[0].username)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by username or email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('All Graded Subsections')).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Reset' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reset extensions/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add individual extension/i })).not.toBeInTheDocument();
  });

  it('renders loading state on the table', () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ isLoading: true, data: { count: 0, results: [] } });
    renderComponent({});
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders table with data', async () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ isLoading: false, data: { count: mockData.length, results: mockData } });
    renderComponent({ onResetExtensions: mockResetExtensions });
    const user = userEvent.setup();
    expect(screen.getByText(mockData[0].username)).toBeInTheDocument();
    expect(screen.getByText(mockData[0].fullName)).toBeInTheDocument();
    expect(screen.getByText(mockData[0].email)).toBeInTheDocument();
    expect(screen.getByText(mockData[0].unitTitle)).toBeInTheDocument();
    expect(screen.getByText('11/07/2025, 12:00 AM UTC')).toBeInTheDocument();
    const resetExtensions = screen.getByRole('button', { name: /reset extensions/i });
    expect(resetExtensions).toBeInTheDocument();
    await user.click(resetExtensions);
    expect(mockResetExtensions).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders empty table when no data provided', () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ data: { count: 0, results: [] } });
    renderComponent({});
    expect(screen.queryByText(mockData[0].username)).not.toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders add extension button and handles click', async () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ isLoading: false, data: { count: 0, results: [] } });
    renderComponent({ onClickAdd: mockOnClickAdd });
    const user = userEvent.setup();

    const addButton = screen.getByRole('button', { name: /add individual extension/i });
    expect(addButton).toBeInTheDocument();

    await user.click(addButton);
    expect(mockOnClickAdd).toHaveBeenCalled();
  });

  it('filters by username/email when typing in search input', async () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ isLoading: false, data: { count: mockData.length, results: mockData } });
    renderComponent({});
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/search by username or email/i);
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, 'test_user');

    await waitFor(() => {
      expect(useDateExtensions).toHaveBeenCalledWith(testCourseId, {
        blockId: '',
        emailOrUsername: 'test_user',
        page: 0,
        pageSize: 25,
      });
    }, { timeout: 700 });
  });

  it('debounces search input to avoid excessive API calls', async () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ isLoading: false, data: { count: mockData.length, results: mockData } });
    renderComponent({});
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/search by username or email/i);

    // Type multiple characters quickly
    await user.type(searchInput, 'test');

    // Should not call immediately
    expect(useDateExtensions).not.toHaveBeenCalledWith(testCourseId, {
      blockId: '',
      emailOrUsername: 'test',
      page: 0,
      pageSize: 25,
    });

    // Wait for debounce
    await waitFor(() => {
      expect(useDateExtensions).toHaveBeenCalledWith(testCourseId, {
        blockId: '',
        emailOrUsername: 'test',
        page: 0,
        pageSize: 25,
      });
    }, { timeout: 700 });
  });

  it('filters by graded subsection when selecting from dropdown', async () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ isLoading: false, data: { count: mockData.length, results: mockData } });
    (useGradedSubsections as jest.Mock).mockReturnValue({
      data: { items: mockGradedSubsections },
      isLoading: false,
    });
    renderComponent({});
    const user = userEvent.setup();

    const subsectionSelect = screen.getByPlaceholderText('All Graded Subsections');
    expect(subsectionSelect).toBeInTheDocument();

    await user.selectOptions(subsectionSelect, mockGradedSubsections[0].subsectionId);

    await waitFor(() => {
      expect(useDateExtensions).toHaveBeenCalledWith(testCourseId, {
        blockId: mockGradedSubsections[0].subsectionId,
        emailOrUsername: '',
        page: 0,
        pageSize: 25,
      });
    }, { timeout: 700 });
  });

  it('resets page to 0 when filters change', async () => {
    // Start with some data on page 1
    (useDateExtensions as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { count: 50, results: mockData, numPages: 2 }
    });

    renderComponent({});
    const user = userEvent.setup();

    // Navigate to page 2 first (simulate pagination)
    const nextPageButton = screen.getByLabelText(/next/i);
    if (nextPageButton) {
      await user.click(nextPageButton);
    }

    // Now apply a filter
    const searchInput = screen.getByPlaceholderText(/search by username or email/i);
    await user.type(searchInput, 'test');

    // Should reset to page 0 when filter changes
    await waitFor(() => {
      expect(useDateExtensions).toHaveBeenCalledWith(testCourseId, {
        blockId: '',
        emailOrUsername: 'test',
        page: 0,
        pageSize: 25,
      });
    }, { timeout: 700 });
  });

  it('handles pagination correctly', async () => {
    (useDateExtensions as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { count: 50, results: mockData, numPages: 2 }
    });

    renderComponent({});
    const user = userEvent.setup();

    const nextPageButton = screen.getByLabelText(/next/i);
    if (nextPageButton) {
      await user.click(nextPageButton);

      expect(useDateExtensions).toHaveBeenCalledWith(testCourseId, {
        blockId: '',
        emailOrUsername: '',
        page: 1,
        pageSize: 25,
      });
    }
  });

  it('maintains filters when paginating', async () => {
    (useDateExtensions as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { count: 50, results: mockData, numPages: 2 }
    });

    renderComponent({});
    const user = userEvent.setup();

    // Apply a filter first
    const searchInput = screen.getByPlaceholderText(/search by username or email/i);
    await user.type(searchInput, 'test');

    // Wait for the filter to be applied
    await waitFor(() => {
      expect(useDateExtensions).toHaveBeenCalledWith(testCourseId, expect.objectContaining({
        emailOrUsername: 'test',
        page: 0,
      }));
    }, { timeout: 1000 });

    // Wait for all debounced callbacks to complete
    await new Promise(resolve => setTimeout(resolve, 700));

    // Clear mock calls to focus on pagination behavior
    (useDateExtensions as jest.Mock).mockClear();

    // Then paginate
    const nextPageButton = screen.getByLabelText(/next/i);
    await user.click(nextPageButton);

    // Should call with page 1 and maintain the filter
    await waitFor(() => {
      expect(useDateExtensions).toHaveBeenCalledWith(testCourseId, expect.objectContaining({
        emailOrUsername: 'test',
        page: 1,
      }));
    }, { timeout: 1000 });
  });
});
