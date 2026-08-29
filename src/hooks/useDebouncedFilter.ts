import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';

interface UseDebouncedFilterProps {
  filterValue: string;
  setFilter: (value: string) => void;
  delay?: number;
}

/**
 * Hook for handling debounced filter input with automatic synchronization
 * @param filterValue - Current filter value from parent component
 * @param setFilter - Function to update the filter in parent component
 * @param delay - Debounce delay in milliseconds (default: 600ms)
 */
export const useDebouncedFilter = ({
  filterValue,
  setFilter,
  delay = 600
}: UseDebouncedFilterProps) => {
  const [inputValue, setInputValue] = useState(filterValue || '');

  // Debounced function to update the filter
  // Added 600ms delay after testing on 3G network - good balance between responsiveness and reducing API calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetFilter = useCallback(
    debounce((value: string) => setFilter(value), delay),
    [setFilter, delay]
  );

  useEffect(() => {
    setInputValue(filterValue || '');
  }, [filterValue]);

  const handleChange = (value: string) => {
    setInputValue(value);
    debouncedSetFilter(value);
  };

  const resetFilter = () => {
    setInputValue('');
    setFilter('');
  };

  return {
    inputValue,
    handleChange,
    resetFilter,
  };
};
