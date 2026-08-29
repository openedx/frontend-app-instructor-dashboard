import { TEAM_MEMBER_ACTION } from './constants';

export interface CourseTeamMember {
  username: string;
  fullName: string;
  email: string;
  roles: Role[];
};

export interface CourseTeamMemberQueryParams {
  page: number;
  pageSize: number;
  emailOrUsername?: string;
  role?: string;
}

export interface Role {
  role: string;
  displayName: string;
}

export interface TeamMembersResponse {
  results: {
    identifier: string;
    userDoesNotExist: boolean;
  }[];
}

export type TeamMemberActionType = typeof TEAM_MEMBER_ACTION[keyof typeof TEAM_MEMBER_ACTION];

export interface AddTeamMemberParams {
  identifiers: string[];
  role: string;
  action: TeamMemberActionType;
}
