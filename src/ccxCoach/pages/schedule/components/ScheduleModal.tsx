import { useEffect, useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Form, FormControl, FormGroup, FormLabel, ModalDialog, Stack } from '@openedx/paragon';
import messages from '../messages';
import { CategoryType } from '../types';
import { BLOCK_CATEGORIES } from '../constants';

interface ScheduleFormState {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  category: CategoryType;
  start?: string;
  due?: string;
  onClose: () => void;
  onSave: (startDate: string, endDate?: string) => void;
}

// Accepts both ISO 8601 (2026-08-26T08:30:00Z) and legacy space-separated formats.
const parseDateTime = (value?: string): { date: string; time: string } => {
  if (!value) {
    return { date: '', time: '' };
  }
  const [datePart = '', timePart = ''] = value.split(/[T\s]/);
  return { date: datePart, time: timePart.slice(0, 5) };
};

const buildFormState = (start?: string, due?: string): ScheduleFormState => {
  const { date: startDate, time: startTime } = parseDateTime(start);
  const { date: endDate, time: endTime } = parseDateTime(due);
  return { startDate, startTime, endDate, endTime };
};

const ScheduleModal = ({ isOpen, category, start, due, onClose, onSave }: ScheduleModalProps): JSX.Element => {
  const intl = useIntl();
  const [form, setForm] = useState<ScheduleFormState>(() => buildFormState(start, due));

  useEffect(() => {
    if (isOpen) {
      setForm(buildFormState(start, due));
    }
  }, [isOpen, start, due]);

  const toBackendFormat = (date: string, time: string): string | undefined => (
    date && time ? `${date} ${time}` : undefined
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const startValue = toBackendFormat(form.startDate, form.startTime);
    if (!startValue) {
      return;
    }
    onSave(startValue, toBackendFormat(form.endDate, form.endTime));
  };

  return (
    <ModalDialog isOpen={isOpen} title={category === BLOCK_CATEGORIES.SEQUENTIAL ? intl.formatMessage(messages.subsectionDialogTitle) : intl.formatMessage(messages.sectionDialogTitle)} onClose={onClose} isOverflowVisible={false}>
      <ModalDialog.Header className="border-bottom p-3">
        <ModalDialog.Title className="text-primary-500">
          {category === BLOCK_CATEGORIES.SEQUENTIAL ? intl.formatMessage(messages.subsectionDialogTitle) : intl.formatMessage(messages.sectionDialogTitle)}
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
          {category === BLOCK_CATEGORIES.SEQUENTIAL && (
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
            <Button disabled={!form.startDate || !form.startTime} type="submit">{intl.formatMessage(messages.scheduleContent)}</Button>
          </ActionRow>
        </ModalDialog.Footer>
      </Form>
    </ModalDialog>
  );
};

export default ScheduleModal;
