import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Dropzone, Form, Hyperlink, Icon, ModalDialog, OverlayTrigger, Tab, Tabs, Tooltip } from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import messages from '@src/certificates/messages';

interface GrantExceptionsModalProps {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (learners: string[], notes: string) => void,
  onUploadCsv: (file: File) => void,
  isSubmitting: boolean,
}

const GrantExceptionsModal = ({
  isOpen,
  onClose,
  onSubmit,
  onUploadCsv,
  isSubmitting,
}: GrantExceptionsModalProps) => {
  const intl = useIntl();
  const [learner, setLearner] = useState('');
  const [notes, setNotes] = useState('');
  const [csvFileName, setCsvFileName] = useState<string>('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('single');

  const handleSubmit = () => {
    if (activeTab === 'single') {
      const trimmedLearner = learner.trim();
      if (trimmedLearner) {
        onSubmit([trimmedLearner], notes);
        setLearner('');
        setNotes('');
      }
    } else {
      // Handle CSV upload
      if (csvFile) {
        onUploadCsv(csvFile);
        setCsvFileName('');
        setCsvFile(null);
      }
    }
  };

  const handleClose = () => {
    setLearner('');
    setNotes('');
    setCsvFileName('');
    setCsvFile(null);
    setActiveTab('single');
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={handleClose}
      hasCloseButton
      title={intl.formatMessage(messages.grantExceptionsModalTitle)}
      className="grant-exceptions-modal"
      isOverflowVisible={false}
    >
      <ModalDialog.Header className="border-bottom">
        <ModalDialog.Title>{intl.formatMessage(messages.grantExceptionsModalTitle)}</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body className="px-4 py-3">
        <p className="mb-4">{intl.formatMessage(messages.grantExceptionsModalDescription)}</p>
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key as string)}
          id="grant-exceptions-tabs"
          className="mb-3"
        >
          <Tab eventKey="single" title={intl.formatMessage(messages.singleLearnerTab)}>
            <div className="mt-3">
              <p className="mb-3">{intl.formatMessage(messages.individualTabDescription)}</p>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder={intl.formatMessage(messages.studentEmailUsername)}
                  value={learner}
                  onChange={(e) => setLearner(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={intl.formatMessage(messages.notesOptional)}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Form.Group>
            </div>
          </Tab>
          <Tab eventKey="bulk" title={intl.formatMessage(messages.bulkUploadTab)}>
            <div className="mt-3">
              <Form.Label className="mb-3">{intl.formatMessage(messages.csvFileLabel)}</Form.Label>
              {csvFileName && (
                <div className="alert alert-success mb-3" role="alert">
                  <strong>✓</strong> {intl.formatMessage(messages.csvFileSelected, { fileName: csvFileName })}
                </div>
              )}
              <Dropzone
                accept={{ 'text/csv': ['.csv'] }}
                maxSize={5 * 1024 * 1024}
                onProcessUpload={({ fileData, handleError }) => {
                  const file = fileData.get('file') || fileData.get('files[0]') || Array.from(fileData.values()).find(value => value instanceof File);

                  if (file instanceof File) {
                    setCsvFileName(file.name);
                    setCsvFile(file);
                  } else if (handleError) {
                    handleError(new Error('No file found'));
                  }
                }}
              />
              <div className="d-flex justify-content-end mt-3">
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip id="csv-instructions-tooltip" variant="light" style={{ maxWidth: '400px' }}>
                      {intl.formatMessage(messages.csvInstructionsTooltip)}
                    </Tooltip>
                  )}
                >
                  <span className="d-inline-flex align-items-center gap-1 text-muted" style={{ cursor: 'pointer' }}>
                    <Icon src={InfoOutline} size="sm" />
                    <Hyperlink
                      destination="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Link to CSV instructions documentation
                      }}
                      className="text-muted text-decoration-none"
                    >
                      {intl.formatMessage(messages.csvInstructions)}
                    </Hyperlink>
                  </span>
                </OverlayTrigger>
              </div>
            </div>
          </Tab>
        </Tabs>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={handleClose} disabled={isSubmitting}>
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || (activeTab === 'single' ? !learner.trim() : !csvFile)}
          >
            {intl.formatMessage(messages.save)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default GrantExceptionsModal;
