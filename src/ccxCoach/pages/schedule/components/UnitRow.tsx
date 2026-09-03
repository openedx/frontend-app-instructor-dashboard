import { Card } from '@openedx/paragon';
import BlockActions from '@src/ccxCoach/pages/schedule/components/BlockActions';
import { EditableBlockAttributes } from '../types';

const UnitRow = ({
  category,
  displayName,
  hidden,
  isEditing,
  location,
  onAdd,
  onRemove,
}: EditableBlockAttributes) => {
  if (hidden && !isEditing) {
    return null;
  }

  return (
    <Card className="p-4 mt-3">
      <Card.Section
        className="d-flex align-items-center justify-content-between p-0"
      >
        <h5 className="text-primary-700 mb-0">{displayName}</h5>
        <BlockActions
          category={category}
          location={location}
          hidden={hidden}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </Card.Section>
    </Card>
  );
};

export default UnitRow;
