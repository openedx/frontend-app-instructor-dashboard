import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, Card, Collapsible, Icon } from '@openedx/paragon';
import { AccessTime, ArrowDropDown, ArrowDropUp } from '@openedx/paragon/icons';
import BlockActions from '@src/ccxCoach/pages/schedule/components/BlockActions';
import SubsectionCard from '@src/ccxCoach/pages/schedule/components/SubsectionCard';
import messages from '../messages';
import { EditableBlockAttributes } from '../types';

const SectionCard = ({ displayName, children, isEditing, hidden, onAdd, onRemove, location, category, start }: EditableBlockAttributes) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(true);

  const handleAdd = () => {
    onAdd(location, category);
  };

  if (hidden && !isEditing) {
    return null;
  }

  return (
    <Card className="p-4 mt-3">
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
            <h3 className="text-primary-700 mb-0">{displayName}</h3>
          </Collapsible.Trigger>
          <BlockActions
            category={category}
            location={location}
            hidden={hidden}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        </Card.Section>
        <Card.Section className="p-0 ml-4 mt-2">
          {start && (
            <Button className="text-primary-500 text-decoration-none x-small" iconBefore={AccessTime} variant="link" size="sm" onClick={handleAdd}>
              {intl.formatMessage(messages.start)}
              <span className="text-info-500 ml-1">{start}</span>
            </Button>
          )}
        </Card.Section>
        <Collapsible.Body>
          {isOpen && (
            <Card.Body>
              {children && children.length > 0 && children.map((child) => (
                <SubsectionCard
                  key={child.location}
                  {...child}
                  isEditing={isEditing}
                  onAdd={onAdd}
                  onRemove={onRemove}
                />
              ))}
            </Card.Body>
          )}
        </Collapsible.Body>
      </Collapsible.Advanced>
    </Card>
  );
};

export default SectionCard;
