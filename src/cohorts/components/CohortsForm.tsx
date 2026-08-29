import { useParams } from 'react-router-dom';
import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { ActionRow, Button, Form, FormControl, FormGroup, FormLabel, FormRadioSet, Hyperlink, Icon, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/cohorts/messages';
import { useContentGroupsData } from '@src/cohorts/data/apiHook';
import { Warning } from '@openedx/paragon/icons';
import { assignmentTypes } from '@src/cohorts/constants';
import { CohortData } from '@src/cohorts/types';
import { useCohortContext } from '@src/cohorts/components/CohortContext';

interface CohortsFormProps {
  disableManualAssignment?: boolean;
  onCancel: () => void;
  onSubmit: (data: Partial<CohortData>) => void;
}

export interface CohortsFormRef {
  resetForm: () => void;
}

const CohortsForm = forwardRef<CohortsFormRef, CohortsFormProps>(({ disableManualAssignment = false, onCancel, onSubmit }, ref) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = { groups: [], id: null, studioContentGroupsLink: '' } } = useContentGroupsData(courseId);
  const { selectedCohort } = useCohortContext();

  const initialCohortName = (selectedCohort?.name) ?? '';
  const initialAssignmentType = selectedCohort?.assignmentType ?? assignmentTypes.automatic;
  const initialContentGroupOption = selectedCohort?.groupId ? 'selectContentGroup' : 'noContentGroup';
  const initialContentGroup = selectedCohort?.groupId ? selectedCohort.groupId : null;

  const [selectedContentGroup, setSelectedContentGroup] = useState<number | null>(initialContentGroup);
  const [selectedContentGroupOption, setSelectedContentGroupOption] = useState<string>(initialContentGroupOption);
  const [selectedAssignmentType, setSelectedAssignmentType] = useState<string>(initialAssignmentType);
  const [name, setName] = useState<string>(initialCohortName);

  const resetToInitialValues = useCallback(() => {
    if (selectedCohort) {
      setName(selectedCohort.name);
      setSelectedAssignmentType(selectedCohort.assignmentType);
      setSelectedContentGroupOption(selectedCohort.groupId ? 'selectContentGroup' : 'noContentGroup');
      setSelectedContentGroup(selectedCohort.groupId ?? null);
    }
  }, [selectedCohort]);

  useImperativeHandle(ref, () => ({
    resetForm: resetToInitialValues
  }));

  useEffect(() => {
    resetToInitialValues();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCohort]);

  const contentGroups = [{ id: 'null', name: intl.formatMessage(messages.notSelected) }, ...data.groups];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      name,
      assignmentType: selectedAssignmentType,
      groupId: selectedContentGroup,
      userPartitionId: data.id,
    });
  };

  return (
    <Form className="my-3.5 mx-4" onSubmit={handleSubmit}>
      <FormGroup className="w-md-50">
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.cohortName)}</FormLabel>
        <FormControl value={name} onChange={(e) => setName(e.target.value)} placeholder={intl.formatMessage(messages.cohortName)} />
      </FormGroup>
      <FormGroup>
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.cohortAssignmentMethod)}</FormLabel>
        <FormRadioSet name="assignmentType" value={selectedAssignmentType} onChange={(e) => setSelectedAssignmentType(e.target.value)}>
          <Form.Radio className="mb-2" value={assignmentTypes.automatic}>{intl.formatMessage(messages.automatic)}</Form.Radio>
          {disableManualAssignment ? (
            <OverlayTrigger
              placement="top"
              overlay={(
                <Tooltip id="manual-assignment-tooltip" className="assignment-tooltip">
                  {intl.formatMessage(messages.manualAssignmentDisabledTooltip)}
                </Tooltip>
              )}
            >
              <span>
                <Form.Radio disabled value={assignmentTypes.manual}>{intl.formatMessage(messages.manual)}</Form.Radio>
              </span>
            </OverlayTrigger>
          )
            : <Form.Radio value={assignmentTypes.manual}>{intl.formatMessage(messages.manual)}</Form.Radio>}
        </FormRadioSet>
      </FormGroup>
      <FormGroup className="mb-3.5">
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.associatedContentGroup)}</FormLabel>
        <FormRadioSet
          name="associatedContentGroup"
          value={selectedContentGroupOption}
          onChange={(e) => setSelectedContentGroupOption(e.target.value)}
        >
          <Form.Radio value="noContentGroup">{intl.formatMessage(messages.noContentGroup)}</Form.Radio>
          <div className="d-flex align-items-center">
            <Form.Radio value="selectContentGroup" disabled={data.groups.length === 0}>{intl.formatMessage(messages.selectAContentGroup)}</Form.Radio>
            { data.groups.length > 0
              ? (
                  <FormControl
                    as="select"
                    className="ml-2"
                    size="sm"
                    disabled={selectedContentGroupOption !== 'selectContentGroup'}
                    name="contentGroup"
                    onChange={(e) => setSelectedContentGroup(Number(e.target.value))}
                    value={selectedContentGroup}
                  >
                    {
                      contentGroups.map((contentGroup) => (
                        <option key={contentGroup.id} value={contentGroup.id}>
                          {contentGroup.name}
                        </option>
                      ))
                    }
                  </FormControl>
                )
              : (
                  <div className="d-flex align-items-center small">
                    <Icon className="ml-2 text-danger-500" src={Warning} size="sm" />
                    <p className="mb-0 ml-1 text-danger-500">{intl.formatMessage(messages.noContentGroups)}</p>
                    <Hyperlink className="ml-1" destination={data.studioContentGroupsLink}>{intl.formatMessage(messages.createContentGroup)}</Hyperlink>
                  </div>
                )}
          </div>
        </FormRadioSet>
      </FormGroup>
      <ActionRow>
        <Button variant="tertiary" onClick={onCancel}>{intl.formatMessage(messages.cancelLabel)}</Button>
        <Button type="submit" disabled={name.trim() === ''}>{intl.formatMessage(messages.saveLabel)}</Button>
      </ActionRow>
    </Form>
  );
});

CohortsForm.displayName = 'CohortsForm';

export default CohortsForm;
