import { PaginationParams } from '@src/types';

export interface LearnerDateExtension {
  username: string;
  fullName: string;
  email: string;
  unitTitle: string;
  extendedDueDate: string;
  unitLocation: string;
}

export interface ResetDueDateParams {
  student: string;
  url: string;
  reason?: string;
}

export interface AddDateExtensionFormData {
  emailOrUsername: string;
  blockId: string;
  dueDate: string;
  dueTime: string;
  reason: string;
}

export interface AddDateExtensionParams extends Omit<AddDateExtensionFormData, 'dueDate' | 'dueTime'> {
  dueDatetime: string;
}

export interface DateExtensionQueryParams extends PaginationParams {
  emailOrUsername?: string;
  blockId?: string;
}
