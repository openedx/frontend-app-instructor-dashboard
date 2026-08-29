import { getExternalLinkUrl, useIntl } from '@openedx/frontend-base';
import { useParams } from 'react-router-dom';
import { Collapsible, Hyperlink } from '@openedx/paragon';
import CSVComponent from '@src/components/CSVComponent';
import dataDownloadsMessages from '@src/dataDownloads/messages';
import { useAlert } from '@src/providers/AlertProvider';
import CohortCard from './CohortCard';
import messages from '../messages';
import { useAddLearnersToCohortsBulk } from '../data/apiHook';

const SelectedCohortInfo = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { mutate: addLearnersToCohortsBulk } = useAddLearnersToCohortsBulk(courseId);
  const { showToast } = useAlert();

  const handleProcessUpload = ({ fileData, handleError }: { fileData: FormData; requestConfig?: RequestInit; handleError?: (error: Error) => void }) => {
    // Create new FormData with the correct field name for cohorts API
    const correctedFormData = new FormData();

    // Get the first file from the original FormData (Dropzone might use 'file', 'files[0]', etc.)
    const file = fileData.get('file') || fileData.get('files[0]') || Array.from(fileData.values()).find(value => value instanceof File);

    if (file instanceof File) {
      correctedFormData.append('uploaded-file', file);
      addLearnersToCohortsBulk(correctedFormData, {
        onSuccess: () => {
          showToast(intl.formatMessage(messages.uploadSuccessMessage, { fileName: file.name }));
        },
        onError: (error) => {
          if (handleError) {
            handleError(error);
          }
        }
      });
    } else {
      if (handleError) {
        handleError(new Error(intl.formatMessage(messages.noFileFoundMessage)));
      }
    }
  };

  return (
    <>
      <CohortCard />
      <Collapsible className="collapsible-csv mt-3 w-50" styling="basic" title={<p className="text-info-500 mb-0">{intl.formatMessage(messages.downloadCSVCaption)}</p>}>
        <CSVComponent templateLink={getExternalLinkUrl('https://docs.openedx.org/en/latest/educators/how-tos/advanced_features/manage_cohorts.html#assign-learners-to-cohorts-by-uploading-a-csv-file')} onProcessUpload={handleProcessUpload} />
      </Collapsible>
      <p className="mt-3">
        {intl.formatMessage(messages.cohortDisclaimer)} <Hyperlink className="text-info-500 text-decoration-none" destination={`/instructor/${courseId}/data_downloads`} showLaunchIcon={false}>{intl.formatMessage(dataDownloadsMessages.pageTitle)}</Hyperlink> {intl.formatMessage(messages.page)}
      </p>
    </>
  );
};

export default SelectedCohortInfo;
