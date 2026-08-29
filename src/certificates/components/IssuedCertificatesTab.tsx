import CertificateTable from '@src/certificates/components/CertificateTable';
import CertificatesToolbar from '@src/certificates/components/CertificatesToolbar';
import { CertificateData, CertificateFilter } from '@src/certificates/types';

interface IssuedCertificatesTabProps {
  data: CertificateData[];
  isLoading: boolean;
  itemCount: number;
  pageCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  filter: CertificateFilter;
  onFilterChange: (value: CertificateFilter) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRemoveException: (username: string, email: string) => void;
  onRemoveInvalidation: (username: string, email: string) => void;
  onRegenerateCertificates: () => void;
}

const IssuedCertificatesTab = ({
  data,
  isLoading,
  itemCount,
  pageCount,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  currentPage,
  onPageChange,
  onRemoveException,
  onRemoveInvalidation,
  onRegenerateCertificates,
}: IssuedCertificatesTabProps) => (
  <div className="d-flex flex-column certificates-tab-container">
    <CertificatesToolbar
      search={search}
      onSearchChange={onSearchChange}
      filter={filter}
      onFilterChange={onFilterChange}
      onRegenerateCertificates={onRegenerateCertificates}
    />
    <div className="certificates-table-wrapper">
      <CertificateTable
        data={data}
        isLoading={isLoading}
        itemCount={itemCount}
        pageCount={pageCount}
        currentPage={currentPage}
        filter={filter}
        onPageChange={onPageChange}
        onRemoveException={onRemoveException}
        onRemoveInvalidation={onRemoveInvalidation}
      />
    </div>
  </div>
);

export default IssuedCertificatesTab;
