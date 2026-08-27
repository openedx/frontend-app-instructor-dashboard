import { useIntl } from '@openedx/frontend-base';
import { Button, Card } from '@openedx/paragon';
import { Add, Delete } from '@openedx/paragon/icons';
import messages from '../messages';
import { EditableBlockAttributes } from '../types';

const UnitRow = ({
  category,
  displayName,
  hidden,
  isEditing,
  location,
  onAdd,
  onRemove
}: EditableBlockAttributes) => {
  const intl = useIntl();

  const handleAdd = () => {
    onAdd(location, category);
  };

  const handleRemove = () => {
    onRemove(location, category);
  };

  if (hidden && !isEditing) {
    return null;
  }

  return (
    <Card className="p-4 mt-3">
      <Card.Section
        className="d-flex align-items-center justify-content-between p-0"
      >
        <h5 className="text-primary-700 mb-0">{displayName}</h5>
        {isEditing && hidden && (
          <Button iconBefore={Add} variant="outline-primary" onClick={handleAdd}>{intl.formatMessage(messages.addUnit)}</Button>
        )}
        {isEditing && !hidden && (
          <Button iconBefore={Delete} variant="tertiary" onClick={handleRemove}>
            {intl.formatMessage(messages.removeButton, { blockType: intl.formatMessage(messages.blockTypeUnit) })}
          </Button>
        )}
      </Card.Section>
    </Card>
  );
};

export default UnitRow;
