import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Form, FormControl, FormGroup, FormLabel, ModalDialog, Stack } from '@openedx/paragon';
import messages from '../messages';
import { BlockTypeT } from '../types';

interface ScheduleFormState {
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
}

interface ScheduleModalProps {
  type: Partial<BlockTypeT>,
  onClose: () => void,
  onSave: (startDate: string, endDate?: string) => void,
}

const ScheduleModal = ({ isOpen, type, onClose, onSave }: ScheduleModalProps & { isOpen: boolean }): JSX.Element => {
  const intl = useIntl();
  const [form, setForm] = useState<ScheduleFormState>({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSave(`${form.startDate}T${form.startTime}`, `${form.endDate}T${form.endTime}`);
  };

  return (
    <ModalDialog isOpen={isOpen} title={type === 'subsection' ? intl.formatMessage(messages.subsectionDialogTitle) : intl.formatMessage(messages.sectionDialogTitle)} onClose={onClose} isOverflowVisible={false}>
      <ModalDialog.Header className="border-bottom p-3">
        <ModalDialog.Title className="text-primary-500">
          {type === 'subsection' ? intl.formatMessage(messages.subsectionDialogTitle) : intl.formatMessage(messages.sectionDialogTitle)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <Form onSubmit={handleSubmit} className="position-relative overflow-auto">
        <ModalDialog.Body className="p-4">
          <p className="text-primary-500 mb-0">{intl.formatMessage(messages.setDates)}</p>
          <p className="text-gray-700 x-small">{intl.formatMessage(messages.UTCDescription)}</p>
          <FormGroup>
            <FormLabel className="text-primary-500">{intl.formatMessage(messages.startDate)}</FormLabel>
            <Stack direction="horizontal" gap={2}>
              <FormControl type="date" value={form.startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, startDate: e.target.value })} />
              <FormControl type="time" value={form.startTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, startTime: e.target.value })} />
            </Stack>
          </FormGroup>
          {type === 'subsection' && (
            <FormGroup className="mt-3">
              <FormLabel className="text-primary-500">{intl.formatMessage(messages.endDate)}</FormLabel>
              <Stack direction="horizontal" gap={2}>
                <FormControl type="date" value={form.endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, endDate: e.target.value })} />
                <FormControl type="time" value={form.endTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, endTime: e.target.value })} />
              </Stack>
            </FormGroup>
          )}
        </ModalDialog.Body>
        <ModalDialog.Footer className="border-top p-4">
          <ActionRow>
            <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancelButton)}</Button>
            <Button type="submit">{intl.formatMessage(messages.saveButton)}</Button>
          </ActionRow>
        </ModalDialog.Footer>
      </Form>
    </ModalDialog>
  );
};

export default ScheduleModal;
