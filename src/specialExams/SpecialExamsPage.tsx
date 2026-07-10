import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, ButtonGroup, Card } from '@openedx/paragon';
import messages from './messages';
import Allowances from './components/Allowances';
import Attempts from './components/Attempts';
import OnboardingList from './components/OnboardingList';
import ReviewDashboard from './components/ReviewDashboard';
import { useProctoringSettings } from './data/apiHook';

const SPECIAL_EXAMS_TAB = {
  ATTEMPTS: 'attempts',
  ALLOWANCES: 'allowances',
  ONBOARDING: 'onboarding',
  REVIEW_DASHBOARD: 'reviewDashboard',
};

const SpecialExamsPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data: proctoringSettings } = useProctoringSettings(courseId);
  const [selectedTab, setSelectedTab] = useState<(typeof SPECIAL_EXAMS_TAB)[keyof typeof SPECIAL_EXAMS_TAB]>(SPECIAL_EXAMS_TAB.ATTEMPTS);

  const showOnboarding = !!proctoringSettings?.supportsOnboarding;
  const showReviewDashboard = !!proctoringSettings?.reviewDashboardAvailable;

  const renderTabContent = () => {
    switch (selectedTab) {
      case SPECIAL_EXAMS_TAB.ALLOWANCES:
        return <Allowances />;
      case SPECIAL_EXAMS_TAB.ONBOARDING:
        return showOnboarding ? <OnboardingList /> : <Attempts />;
      case SPECIAL_EXAMS_TAB.REVIEW_DASHBOARD:
        return showReviewDashboard ? <ReviewDashboard /> : <Attempts />;
      default:
        return <Attempts />;
    }
  };

  return (
    <>
      <h3 className="text-primary-700">{intl.formatMessage(messages.specialExamsTitle)}</h3>
      <Card className="bg-light-200 mt-4.5">
        <ButtonGroup className="d-block mx-4 mt-4">
          <Button
            variant={selectedTab === SPECIAL_EXAMS_TAB.ATTEMPTS ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedTab(SPECIAL_EXAMS_TAB.ATTEMPTS)}
          >{intl.formatMessage(messages.examAttempts)}
          </Button>
          <Button
            variant={selectedTab === SPECIAL_EXAMS_TAB.ALLOWANCES ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedTab(SPECIAL_EXAMS_TAB.ALLOWANCES)}
          >{intl.formatMessage(messages.allowances)}
          </Button>
          {showOnboarding && (
            <Button
              variant={selectedTab === SPECIAL_EXAMS_TAB.ONBOARDING ? 'primary' : 'outline-primary'}
              onClick={() => setSelectedTab(SPECIAL_EXAMS_TAB.ONBOARDING)}
            >{intl.formatMessage(messages.onboarding)}
            </Button>
          )}
          {showReviewDashboard && (
            <Button
              variant={selectedTab === SPECIAL_EXAMS_TAB.REVIEW_DASHBOARD ? 'primary' : 'outline-primary'}
              onClick={() => setSelectedTab(SPECIAL_EXAMS_TAB.REVIEW_DASHBOARD)}
            >{intl.formatMessage(messages.reviewDashboard)}
            </Button>
          )}
        </ButtonGroup>
        {renderTabContent()}
      </Card>
    </>
  );
};

export default SpecialExamsPage;
