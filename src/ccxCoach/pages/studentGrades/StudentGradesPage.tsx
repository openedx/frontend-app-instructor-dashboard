import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import { TrendingUp } from '@openedx/paragon/icons';
import GradebookSlot from '@src/slots/GradebookSlot/GradebookSlot';
import { getCcxGradesCsvUrl } from '../../data/api';
import messages from './messages';

const StudentGradesPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const [showGradebook, setShowGradebook] = useState(false);

  if (showGradebook) {
    return <GradebookSlot courseId={courseId} onBack={() => setShowGradebook(false)} />;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h4 className="text-primary-700 mb-0">
          {intl.formatMessage(messages.studentGradesPageTitle)}
        </h4>
        <Button
          variant="outline-primary"
          iconBefore={TrendingUp}
          onClick={() => setShowGradebook(true)}
        >
          {intl.formatMessage(messages.viewGradebookButton)}
        </Button>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mt-3 text-primary-700 font-weight-bold h4">
            {intl.formatMessage(messages.downloadStudentGradesTitle)}
          </h5>
          <p className="text-primary-500 font-weight-normal h4">{intl.formatMessage(messages.downloadStudentGradesDescription)}</p>
        </div>
        <Button
          as="a"
          variant="primary"
          href={getCcxGradesCsvUrl(courseId)}
          disabled={!courseId}
          rel="noopener noreferrer"
        >
          {intl.formatMessage(messages.downloadStudentGradesButton)}
        </Button>
      </div>
    </>
  );
};

export default StudentGradesPage;
