import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, Card, Collapsible, Icon } from '@openedx/paragon';
import { Add, ArrowDropDown, ArrowDropUp, Delete } from '@openedx/paragon/icons';
import UnitRow from '@src/ccxCoach/pages/schedule/components/UnitRow';
import { EditableBlockAttributes } from '../types';
import messages from '../messages';

const SubsectionCard = ({
  category,
  children,
  displayName,
  hidden,
  isEditing,
  location,
  onAdd,
  onRemove,
}: EditableBlockAttributes) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(true);

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
    <Card className="bg-light-200 p-4 mt-4">
      <Collapsible.Advanced styling="basic" open={isOpen}>
        <Card.Section
          className="d-flex align-items-center justify-content-between p-0"
        >
          <Collapsible.Trigger className="collapsible-trigger d-flex align-items-center border-0 bg-transparent p-0 text-decoration-none" onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}>
            <Collapsible.Visible whenClosed>
              <Icon className="mr-2 text-primary-500" src={ArrowDropUp} />
            </Collapsible.Visible>
            <Collapsible.Visible whenOpen>
              <Icon className="mr-2 text-primary-500" src={ArrowDropDown} />
            </Collapsible.Visible>
            <h4 className="text-primary-700 mb-0">{displayName}</h4>
          </Collapsible.Trigger>
          {isEditing && hidden && (
            <Button iconBefore={Add} variant="outline-primary" onClick={handleAdd}>{intl.formatMessage(messages.addSubsection)}</Button>
          )}
          {isEditing && !hidden && (
            <Button iconBefore={Delete} variant="tertiary" onClick={handleRemove}>
              {intl.formatMessage(messages.removeButton, { blockType: intl.formatMessage(messages.blockTypeSubsection) })}
            </Button>
          )}
        </Card.Section>
        <Collapsible.Body>
          {isOpen && (
            <Card.Body>
              {children && children.length > 0 && (
                <>
                  {children.map((child) => (
                    <UnitRow key={child.location} {...child} isEditing={isEditing} onAdd={onAdd} onRemove={onRemove} />
                  ))}
                </>
              )}
            </Card.Body>
          )}
        </Collapsible.Body>
      </Collapsible.Advanced>
    </Card>
  );
};

export default SubsectionCard;
