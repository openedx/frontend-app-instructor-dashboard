import { TableCellValue } from '@src/types';

export interface DownloadReportData {
  dateGenerated: string;
  reportType: string;
  reportName: string;
  downloadLink: string;
}

export type DataDownloadsCellProps = TableCellValue<DownloadReportData>;
