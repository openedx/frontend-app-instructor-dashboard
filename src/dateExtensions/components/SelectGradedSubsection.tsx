import { useParams } from 'react-router-dom';
import { FormLabel, FormControl, FormGroup } from '@openedx/paragon';
import { useGradedSubsections } from '../data/apiHook';

interface SelectGradedSubsectionProps {
  label?: string;
  placeholder: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectGradedSubsection = ({ label, placeholder, value, onChange }: SelectGradedSubsectionProps) => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = { items: [] } } = useGradedSubsections(courseId);
  const selectOptions = [{ displayName: placeholder, subsectionId: '' }, ...data.items];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event);
  };

  return (
    <FormGroup className="mb-0" size="sm">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl
        as="select"
        name="blockId"
        placeholder={placeholder}
        size="md"
        value={value}
        onChange={handleChange}
      >
        {
          selectOptions.map((option) => (
            <option key={option.subsectionId} value={option.subsectionId}>
              {option.displayName}
            </option>
          ))
        }
      </FormControl>
    </FormGroup>
  );
};

export default SelectGradedSubsection;
