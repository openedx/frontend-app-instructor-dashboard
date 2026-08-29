import { assignmentTypes } from './constants';

export type AssignmentType = typeof assignmentTypes[keyof typeof assignmentTypes];

export interface BasicCohortData {
  name: string;
  assignmentType: AssignmentType;
  groupId: number | null;
  userPartitionId: number | null;
}
export interface CohortData extends BasicCohortData {
  id: number;
  userCount: number;
}

export interface CohortForm extends BasicCohortData {
  contentGroupOption: string;
}
