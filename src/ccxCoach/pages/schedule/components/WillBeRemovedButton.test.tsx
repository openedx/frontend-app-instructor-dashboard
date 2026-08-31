import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import WillBeRemovedButton from '@src/ccxCoach/pages/schedule/components/WillBeRemovedButton';
import messages from '../messages';

describe('WillBeRemovedButton', () => {
  const blockType = 'Subsection';

  const renderComponent = (onUndo: () => void = jest.fn()) => renderWithIntl(
    <WillBeRemovedButton blockType={blockType} onUndo={onUndo} />
  );

  it('renders the will-be-removed label by default', () => {
    renderComponent();

    expect(screen.getByRole('button', {
      name: messages.willBeRemoved.defaultMessage.replace('{blockType}', blockType),
    })).toBeInTheDocument();
  });

  it('switches to the undo-keep label on hover and restores it on mouse leave', async () => {
    const user = userEvent.setup();
    renderComponent();

    const button = screen.getByRole('button');

    await user.hover(button);
    expect(screen.getByRole('button', {
      name: messages.undoKeep.defaultMessage.replace('{blockType}', blockType),
    })).toBeInTheDocument();

    await user.unhover(button);
    expect(screen.getByRole('button', {
      name: messages.willBeRemoved.defaultMessage.replace('{blockType}', blockType),
    })).toBeInTheDocument();
  });

  it('switches to the undo-keep label on focus and restores it on blur', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.tab();
    expect(screen.getByRole('button', {
      name: messages.undoKeep.defaultMessage.replace('{blockType}', blockType),
    })).toBeInTheDocument();

    await user.tab();
    expect(screen.getByRole('button', {
      name: messages.willBeRemoved.defaultMessage.replace('{blockType}', blockType),
    })).toBeInTheDocument();
  });

  it('invokes onUndo when clicked', async () => {
    const onUndo = jest.fn();
    const user = userEvent.setup();
    renderComponent(onUndo);

    await user.click(screen.getByRole('button'));

    expect(onUndo).toHaveBeenCalledTimes(1);
  });
});
