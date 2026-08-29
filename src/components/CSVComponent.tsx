import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Card, Dropzone, Hyperlink } from '@openedx/paragon';
import messages from './messages';

interface CSVComponentProps {
  templateLink?: string;
  onProcessUpload: ({ fileData, requestConfig, handleError }: { fileData: FormData; requestConfig?: RequestInit; handleError?: (error: Error) => void }) => void;
}

const CSVComponent = ({ templateLink, onProcessUpload }: CSVComponentProps) => {
  const intl = useIntl();
  const [fileName, setFileName] = useState<string>('');

  const handleProcessUpload = ({ fileData, requestConfig, handleError }: { fileData: FormData; requestConfig?: RequestInit; handleError?: (error: Error) => void }) => {
    const file = fileData.getAll('file');
    if (file && file.length > 0 && file[0] instanceof File) {
      setFileName(file[0].name);
    }
    onProcessUpload({ fileData, requestConfig, handleError });
  };

  return (
    <Card className="bg-light-200 p-3">
      <h3 className="text-primary-700">{intl.formatMessage(messages.downloadCSVTitle)}</h3>
      {
        fileName
          ? <p className="text-primary-500">{intl.formatMessage(messages.uploadingFileMessage, { fileName })}</p>
          : <p className="small text-primary-500">{intl.formatMessage(messages.downloadCSVDescription)}</p>
      }
      <Dropzone
        accept={{ 'text/csv': ['.csv'] }}
        className="bg-light-100"
        maxSize={2 * 1048576}
        onProcessUpload={handleProcessUpload}
      />
      {templateLink && <div className="mt-3 text-right"><Hyperlink showLaunchIcon target="_blank" destination={templateLink}>{intl.formatMessage(messages.viewCSVTemplate)}</Hyperlink></div>}
    </Card>
  );
};

export default CSVComponent;
