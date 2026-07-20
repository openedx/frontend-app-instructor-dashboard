import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { getReviewDashboardUrl } from '@src/specialExams/data/api';
import messages from '@src/specialExams/messages';

const ReviewDashboard = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();

  return (
    <div className="mt-3">
      <iframe
        title={intl.formatMessage(messages.reviewDashboardTitle)}
        src={getReviewDashboardUrl(courseId)}
        className="w-100 border-0"
        style={{ height: '80vh' }}
      />
    </div>
  );
};

export default ReviewDashboard;
