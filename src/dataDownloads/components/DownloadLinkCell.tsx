import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import messages from '@src/dataDownloads/messages';
import { DataDownloadsCellProps } from '@src/dataDownloads/types';

// Report URLs are often pre-signed links to external storage (e.g. S3), so link to them
// directly instead of fetching them with XHR, which would require CORS on the storage.
const DownloadLinkCell = ({ row }: DataDownloadsCellProps) => {
  const intl = useIntl();
  const downloadLink = row.original?.downloadLink ?? '';

  return (
    <Button as="a" variant="link" size="sm" href={downloadLink} target="_blank" rel="noopener noreferrer">
      {intl.formatMessage(messages.downloadLinkLabel)}
    </Button>
  );
};

export { DownloadLinkCell };
