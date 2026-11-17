import { screen } from '@testing-library/react';
import { DownloadLinkCell } from './DownloadLinkCell';
import { renderWithIntl } from '@src/testUtils';
import messages from '@src/dataDownloads/messages';

const createMockRow = (downloadLink: string | undefined) => ({
  original: {
    dateGenerated: '2025-10-01T12:00:00Z',
    reportType: 'Type A',
    reportName: 'Test Report',
    downloadLink,
  },
});

const renderComponent = (props) => renderWithIntl(<DownloadLinkCell {...props} />);

describe('DownloadLinkCell', () => {
  it('should render a link to the report that opens in a new tab', () => {
    const downloadLink = 'https://bucket.s3.amazonaws.com/grades/report.csv?X-Amz-Signature=abc';
    renderComponent({ row: createMockRow(downloadLink) });

    const link = screen.getByRole('link', { name: messages.downloadLinkLabel.defaultMessage });
    expect(link).toHaveAttribute('href', downloadLink);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render an empty href when downloadLink is undefined', () => {
    renderComponent({ row: createMockRow(undefined) });

    const link = screen.getByText(messages.downloadLinkLabel.defaultMessage).closest('a');
    expect(link).toHaveAttribute('href', '');
  });

  it('should render an empty href when original is undefined', () => {
    renderComponent({ row: { original: undefined } });

    const link = screen.getByText(messages.downloadLinkLabel.defaultMessage).closest('a');
    expect(link).toHaveAttribute('href', '');
  });
});
