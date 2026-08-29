import { useParams } from 'react-router-dom';
import { Button, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/grading/messages';
import { useGradingConfiguration } from '@src/grading/data/apiHook';
import CodeEditor from '@src/components/CodeEditor';

interface GradingConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GradingConfigurationModal = ({ isOpen, onClose }: GradingConfigurationModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = null } = useGradingConfiguration(courseId);

  return (
    <ModalDialog size="lg" title={intl.formatMessage(messages.gradingConfiguration)} isOpen={isOpen} onClose={onClose} isOverflowVisible={false}>
      <ModalDialog.Header className="p-3 pl-4 border-bottom">
        <ModalDialog.Title as="h3" className="m-0 text-primary-500">
          {intl.formatMessage(messages.gradingConfiguration)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        {data ? <CodeEditor data={data} /> : <p>{intl.formatMessage(messages.noGradingConfiguration)}</p>}
      </ModalDialog.Body>
      <ModalDialog.Footer className="p-4 border-top">
        <Button onClick={onClose}>{intl.formatMessage(messages.close)}</Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default GradingConfigurationModal;
