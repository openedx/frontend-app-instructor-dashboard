import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from '@openedx/frontend-base';
import CohortCard, { assignmentLink } from './CohortCard';
import { useCohortContext } from './CohortContext';
import { AlertProvider, useAlert } from '@src/providers/AlertProvider';
import { useAddLearnersToCohort, usePatchCohort } from '@src/cohorts/data/apiHook';
import { assignmentTypes } from '@src/cohorts/constants';
import { CohortData } from '@src/cohorts/types';
import messages from '../messages';

jest.mock('./CohortContext', () => ({
  useCohortContext: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('axios', () => ({
  isAxiosError: (error: any) => error?.isAxiosError === true,
}));

jest.mock('@src/cohorts/data/apiHook', () => ({
  usePatchCohort: jest.fn(),
  useAddLearnersToCohort: jest.fn(),
  useContentGroupsData: jest.fn().mockReturnValue({ data: { groups: [{ id: '2', name: 'Group 1' }], id: 1 } }),
}));

jest.mock('@src/providers/AlertProvider', () => ({
  useAlert: jest.fn(),
  AlertProvider: ({ children }: any) => children,
}));

const mockUsePatchCohort = usePatchCohort as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockUseCohortContext = useCohortContext as jest.Mock;
const mockUseAlert = useAlert as jest.Mock;
const mockUseAddLearnersToCohort = useAddLearnersToCohort as jest.Mock;
const mockCohort = {
  id: 1,
  name: 'Test Cohort',
  assignmentType: assignmentTypes.manual,
  groupId: null,
  userPartitionId: null,
  userCount: 15,
};

const createMockCohort = (overrides?: Partial<CohortData>): CohortData => ({
  ...mockCohort,
  ...overrides,
});

const renderCohortCard = (selectedCohort: CohortData | null = createMockCohort()) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockContextValue = {
    selectedCohort,
    setSelectedCohort: jest.fn(),
    clearSelectedCohort: jest.fn(),
    updateCohortField: jest.fn(),
  };

  mockUseCohortContext.mockReturnValue(mockContextValue);

  return render(
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <AlertProvider>
          <CohortCard />
        </AlertProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
};

describe('CohortCard', () => {
  const mockMutate = jest.fn();
  const mockClearAlerts = jest.fn();
  const mockAddLearnersMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ courseId: 'course-123' });
    mockUsePatchCohort.mockReturnValue({ mutate: mockMutate });
    mockUseAlert.mockReturnValue({ clearAlerts: mockClearAlerts });
    mockUseAddLearnersToCohort.mockReturnValue({ mutate: mockAddLearnersMutate });
  });

  describe('Rendering', () => {
    it('should render null when no cohort is selected', () => {
      const { container } = renderCohortCard(null);
      expect(container.firstChild).toBeNull();
    });

    it('should render cohort card with basic information', () => {
      const cohort = createMockCohort();
      renderCohortCard(cohort);
      expect(screen.getByText(mockCohort.name)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`\\(contains ${mockCohort.userCount} students\\)`))).toBeInTheDocument();
    });

    it('should render warning message for manual assignment type', () => {
      const cohort = createMockCohort({ assignmentType: assignmentTypes.manual });
      renderCohortCard(cohort);
      expect(screen.getByText(messages.manualCohortWarning.defaultMessage)).toBeInTheDocument();
    });

    it('should render warning message for automatic assignment type', () => {
      const cohort = createMockCohort({ assignmentType: assignmentTypes.automatic });
      renderCohortCard(cohort);
      expect(screen.getByText(messages.automaticCohortWarning.defaultMessage)).toBeInTheDocument();
    });

    it('should render external link with correct URL for manual cohort', () => {
      const cohort = createMockCohort({ assignmentType: assignmentTypes.manual });
      renderCohortCard(cohort);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', assignmentLink.manual);
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('should render external link with correct URL for automatic cohort', () => {
      const cohort = createMockCohort({ assignmentType: assignmentTypes.automatic });
      renderCohortCard(cohort);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', assignmentLink.random);
    });
  });

  describe('Tabs Navigation', () => {
    it('should render both tabs with correct titles', () => {
      renderCohortCard();
      expect(screen.getByText(messages.manageLearners.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.settings.defaultMessage)).toBeInTheDocument();
    });

    it('should show manage learners content by default', () => {
      renderCohortCard();
      expect(screen.getByPlaceholderText(messages.learnersExample.defaultMessage)).toBeInTheDocument();
    });

    it('should switch to settings tab and show form', async () => {
      const user = userEvent.setup();
      renderCohortCard();
      const settingsTab = screen.getByText(messages.settings.defaultMessage);
      await user.click(settingsTab);
      await waitFor(() => {
        expect(screen.getByText(messages.cohortAssignmentMethod.defaultMessage)).toBeInTheDocument();
      });
    });
  });

  describe('Success Toast', () => {
    it('should show success toast after successful form submission', async () => {
      const user = userEvent.setup();
      renderCohortCard();
      const settingsTab = screen.getByText(messages.settings.defaultMessage);
      await user.click(settingsTab);
      await waitFor(() => {
        expect(screen.getByText(messages.cohortAssignmentMethod.defaultMessage)).toBeInTheDocument();
      });

      mockMutate.mockImplementation((_options: any, callbacks: { onSuccess: () => void }) => {
        callbacks.onSuccess();
      });

      const submitBtn = screen.getByRole('button', { name: messages.saveLabel.defaultMessage });
      await user.click(submitBtn);
      await waitFor(() => {
        expect(screen.getByText(messages.cohortUpdateSuccessMessage.defaultMessage)).toBeInTheDocument();
      });
    });

    it('should close success toast when close button is clicked', async () => {
      const user = userEvent.setup();
      renderCohortCard();
      const settingsTab = screen.getByText(messages.settings.defaultMessage);
      await user.click(settingsTab);
      await waitFor(() => {
        expect(screen.getByText(messages.cohortAssignmentMethod.defaultMessage)).toBeInTheDocument();
      });

      mockMutate.mockImplementation((_options: any, callbacks: { onSuccess: () => void }) => {
        callbacks.onSuccess();
      });

      const submitBtn = screen.getByRole('button', { name: messages.saveLabel.defaultMessage });
      await user.click(submitBtn);
      await waitFor(() => {
        expect(screen.getByText(messages.cohortUpdateSuccessMessage.defaultMessage)).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      await waitFor(() => {
        expect(screen.queryByText(messages.cohortUpdateSuccessMessage.defaultMessage)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle cohort with zero users', () => {
      const cohort = createMockCohort({ userCount: 0 });
      renderCohortCard(cohort);
      expect(screen.getByText(/0 students/)).toBeInTheDocument();
    });

    it('should handle cohort with undefined userCount', () => {
      const cohort = createMockCohort({ userCount: undefined as any });
      renderCohortCard(cohort);
      expect(screen.getByText(/0 students/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should show error modal when edit cohort fails with generic error', async () => {
      const showModalMock = jest.fn();
      mockUseAlert.mockReturnValue({ clearAlerts: mockClearAlerts, showModal: showModalMock });

      const user = userEvent.setup();
      renderCohortCard();

      const settingsTab = screen.getByText(messages.settings.defaultMessage);
      await user.click(settingsTab);
      await waitFor(() => {
        expect(screen.getByText(messages.cohortAssignmentMethod.defaultMessage)).toBeInTheDocument();
      });

      mockMutate.mockImplementation((_options: any, callbacks: { onError: (error: any) => void }) => {
        callbacks.onError(new Error('Generic error'));
      });

      const submitBtn = screen.getByRole('button', { name: messages.saveLabel.defaultMessage });
      await user.click(submitBtn);

      expect(showModalMock).toHaveBeenCalledWith({
        confirmText: messages.closeButton.defaultMessage,
        message: messages.editCohortError.defaultMessage,
        variant: 'danger',
      });
    });

    it('should show error modal with API message when edit cohort fails with axios error', async () => {
      const showModalMock = jest.fn();
      mockUseAlert.mockReturnValue({ clearAlerts: mockClearAlerts, showModal: showModalMock });

      const user = userEvent.setup();
      renderCohortCard();

      const settingsTab = screen.getByText(messages.settings.defaultMessage);
      await user.click(settingsTab);
      await waitFor(() => {
        expect(screen.getByText(messages.cohortAssignmentMethod.defaultMessage)).toBeInTheDocument();
      });

      const axiosError = {
        isAxiosError: true,
        response: { data: { developer_message: 'Cohort name already exists' } },
      };
      mockMutate.mockImplementation((_options: any, callbacks: { onError: (error: any) => void }) => {
        callbacks.onError(axiosError);
      });

      const submitBtn = screen.getByRole('button', { name: messages.saveLabel.defaultMessage });
      await user.click(submitBtn);

      expect(showModalMock).toHaveBeenCalledWith({
        confirmText: messages.closeButton.defaultMessage,
        message: 'Cohort name already exists',
        variant: 'danger',
      });
    });
  });
});
