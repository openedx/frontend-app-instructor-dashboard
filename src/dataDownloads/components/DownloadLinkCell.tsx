import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import messages from '@src/dataDownloads/messages';
import { DataDownloadsCellProps } from '@src/dataDownloads/types';

interface DownloadLinkCellProps extends DataDownloadsCellProps {
  onDownloadClick: (downloadLink: string, reportName: string) => void;
}

const DownloadLinkCell = ({ row, onDownloadClick }: DownloadLinkCellProps) => {
  const intl = useIntl();
  const downloadLink = row.original?.downloadLink ?? '';
  const reportName = row.original?.reportName ?? '';

  return (
    <Button variant="link" size="sm" onClick={() => onDownloadClick(downloadLink, reportName)}>
      {intl.formatMessage(messages.downloadLinkLabel)}
    </Button>
  );
};

export { DownloadLinkCell };
